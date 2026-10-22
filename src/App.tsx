/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchControlPanel } from './components/SearchControlPanel';
import { SidebarFilters } from './components/SidebarFilters';
import { ItemCard } from './components/ItemCard';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ClaimModal } from './components/ClaimModal';
import { PostItemModal } from './components/PostItemModal';
import { MapViewModal } from './components/MapViewModal';
import { HowItWorksView } from './components/HowItWorksView';
import { CommunityStoriesView } from './components/CommunityStoriesView';
import { MyClaimsView } from './components/MyClaimsView';
import { MyListingsView, OwnerClaim } from './components/MyListingsView';
import { CreateAlertModal, PostRequestModal } from './components/AlertAndRequestModals';
import { Footer } from './components/Footer';
import { NEIGHBORHOOD_OPTIONS, USER_PROFILE } from './data/mockData';
import { ItemListing, CategoryType, ConditionType, HandoverType } from './types';
import { api, ApiError, getToken, saveToken } from './api';

const fromListing = (raw: any): ItemListing => {
  const donor = raw.donor || {};
  const coords = raw.mapCoords;
  const hasMapCoords = Number.isFinite(coords?.x) && Number.isFinite(coords?.y)
    && coords.x >= 0 && coords.x <= 100 && coords.y >= 0 && coords.y <= 100;
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    subCategory: raw.subCategory || raw.category,
    condition: raw.condition,
    conditionDescription: raw.conditionDescription || raw.condition,
    handoverProtocol: raw.pickupDetails?.handoverType || 'Porch Pickup',
    ...(raw.pickupDetails?.instructions ? { pickupInstructions: raw.pickupDetails.instructions } : {}),
    ...(Number.isFinite(raw.distance) && raw.distance >= 0 ? { distance: raw.distance } : {}),
    neighborhood: raw.locality,
    timeAgo: raw.timeAgo || (raw.createdAt ? new Date(raw.createdAt).toLocaleDateString() : 'Recently'),
    image: raw.images?.[0] || '',
    altText: raw.altText || raw.title,
    donor: {
      name: donor.name || raw.owner?.name || 'ShareLoop member',
      avatar: donor.avatar || USER_PROFILE.avatar,
      rehomedCount: Number.isFinite(donor.rehomedCount) ? donor.rehomedCount : 0,
      badge: ['verified', 'verified_user', 'eco'].includes(donor.badge) ? donor.badge : 'verified',
      ...(donor.responseRate ? { responseRate: donor.responseRate } : {}),
      ...(donor.joinedYear ? { joinedYear: donor.joinedYear } : {}),
    },
    ...(raw.dimensions ? { dimensions: raw.dimensions } : {}),
    ...(raw.weightEst ? { weightEst: raw.weightEst } : {}),
    claimed: raw.status !== 'available',
    ...(hasMapCoords ? { mapCoords: { x: coords.x, y: coords.y } } : {}),
    ...(raw.claimId ? { claimId: raw.claimId, claimStatus: raw.claimStatus, pickupPassCode: raw.passCode, pickupWindow: raw.pickupWindow ? `${new Date(raw.pickupWindow.start).toLocaleString()} – ${new Date(raw.pickupWindow.end).toLocaleString()}` : '', claimedNote: raw.note, physicalStatus: raw.claimStatus === 'completed' ? 'received' as const : 'awaiting_pickup' as const } : {}),
  };
};

export default function App() {
  // Navigation Tab
  const [currentTab, setCurrentTab] = useState<'explore' | 'my-claims' | 'my-listings' | 'how-it-works' | 'community-stories'>('explore');

  // Items State (all items available for circulation)
  const [items, setItems] = useState<ItemListing[]>([]);
  const [claims, setClaims] = useState<ItemListing[]>([]);
  const [myListings, setMyListings] = useState<ItemListing[]>([]);
  const [receivedClaims, setReceivedClaims] = useState<OwnerClaim[]>([]);
  const [token, setToken] = useState<string | null>(() => getToken());
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [neighborhood, setNeighborhood] = useState('all');
  const [radius, setRadius] = useState(25);
  const [sortBy, setSortBy] = useState<'recent' | 'nearest' | 'condition' | 'reputable'>('nearest');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All Categories');
  const [selectedConditions, setSelectedConditions] = useState<ConditionType[]>([]);
  const [selectedProtocols, setSelectedProtocols] = useState<HandoverType[]>([]);
  const [availability, setAvailability] = useState<'all' | 'available' | 'pending'>('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modals
  const [inspectingItem, setInspectingItem] = useState<ItemListing | null>(null);
  const [claimingItem, setClaimingItem] = useState<ItemListing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick neighborhood display name
  const currentNeighborhoodLabel = useMemo(() => {
    const found = NEIGHBORHOOD_OPTIONS.find((n) => n.id === neighborhood);
    return found ? found.label : 'Seattle Central';
  }, [neighborhood]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshListings = async () => {
    const firstPage: any = await api('/listings?page=1&limit=100');
    const listings = Array.isArray(firstPage?.data?.listings) ? firstPage.data.listings : null;
    if (!listings) throw new Error('The listings API returned an unexpected response.');
    const totalPages = Number(firstPage.data.pagination?.totalPages) || 1;
    const remainingPages = await Promise.all(Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      api<any>(`/listings?page=${index + 2}&limit=100`)
    ));
    const allListings = [
      ...listings,
      ...remainingPages.flatMap((result) => Array.isArray(result?.data?.listings) ? result.data.listings : []),
    ];
    setItems(allListings.map(fromListing));
  };
  const refreshClaims = async () => {
    if (!getToken()) { setClaims([]); setMyListings([]); setReceivedClaims([]); return; }
    const result: any = await api('/claims/mine');
    setClaims(result.data.claims.filter((c: any) => ['pending', 'accepted', 'completed'].includes(c.status)).map((c: any) => fromListing({ ...c.listing, status: c.status === 'completed' ? 'completed' : 'claimed', claimId: c._id, claimStatus: c.status, passCode: c.passCode, pickupWindow: c.pickupWindow, note: c.note })));
    const [owned, received]: any[] = await Promise.all([api('/listings/mine'), api('/claims/received')]);
    setMyListings(owned.data.listings.map(fromListing));
    setReceivedClaims(received.data.claims.map((claim: any) => ({ id: claim._id, status: claim.status, claimantName: claim.claimant?.name || 'ShareLoop member', pickupWindow: claim.pickupWindow, note: claim.note, listingId: claim.listing?._id, listingTitle: claim.listing?.title || 'Listing' })));
  };
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    (async () => {
      if (getToken()) {
        try { const result: any = await api('/auth/me'); if (active) setCurrentUser(result.data.user); }
        catch (error) {
          if (error instanceof ApiError && [401, 403].includes(error.status)) { saveToken(null); setToken(null); setCurrentUser(null); setClaims([]); }
          else if (active) showToast(error instanceof Error ? error.message : 'Could not verify your session');
        }
      } else if (active) setCurrentUser(null);
      const results = await Promise.allSettled([refreshListings(), refreshClaims()]);
      if (active) {
        if (results[0].status === 'rejected') setLoadError(results[0].reason instanceof Error ? results[0].reason.message : 'Unable to load listings');
        if (results[1].status === 'rejected' && getToken()) showToast(results[1].reason instanceof Error ? results[1].reason.message : 'Unable to load claims');
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [token]);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setAuthError('');
    if (authSubmitting) return;
    setAuthSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      if (authMode === 'register') await api('/auth/register', { method: 'POST', body: JSON.stringify({ name: form.get('name'), email: form.get('email'), password: form.get('password') }) });
      const result: any = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
      saveToken(result.data.token); setToken(result.data.token); setCurrentUser(result.data.user); setAuthOpen(false); showToast(`Welcome, ${result.data.user.name}`);
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Unable to sign in'); }
    finally { setAuthSubmitting(false); }
  };

  // Toggle helpers
  const toggleCondition = (cond: ConditionType) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const toggleProtocol = (proto: HandoverType) => {
    setSelectedProtocols((prev) =>
      prev.includes(proto) ? prev.filter((p) => p !== proto) : [...prev, proto]
    );
  };

  // COMPLETE filter clearing - clears EVERYTHING and shows ALL items immediately
  const handleResetFilters = () => {
    setSearchQuery('');
    setNeighborhood('all');
    setRadius(25);
    setSelectedCategory('All Categories');
    setSelectedConditions([]);
    setSelectedProtocols([]);
    setAvailability('all');
    showToast('All filters cleared — showing all available items');
  };

  // Active badges bar "Clear All"
  const handleClearAllBadges = () => {
    setSearchQuery('');
    setNeighborhood('all');
    setSelectedCategory('All Categories');
    setRadius(25);
    setSelectedConditions([]);
    setSelectedProtocols([]);
    setAvailability('all');
    showToast('All filters cleared — showing all available items');
  };

  // Filter items logic
  const filteredItems = useMemo(() => {
    let result = [...items];

    // 1. Keyword search (case-insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          it.neighborhood.toLowerCase().includes(q) ||
          it.subCategory.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter((it) => it.category === selectedCategory);
    }

    // 3. Condition filter
    if (selectedConditions.length > 0) {
      result = result.filter((it) => selectedConditions.includes(it.condition));
    }

    // 4. Protocol filter
    if (selectedProtocols.length > 0) {
      result = result.filter((it) => selectedProtocols.includes(it.handoverProtocol));
    }

    // 5. Neighborhood filter
    if (neighborhood !== 'all') {
      const hoodOption = NEIGHBORHOOD_OPTIONS.find((n) => n.id === neighborhood);
      const hoodTerms = hoodOption
        ? [hoodOption.id.replace(/-/g, ' '), ...hoodOption.label.toLowerCase().split(/\s*&\s*/).map((term) => term.trim())]
        : [];
      if (hoodTerms.length) {
        result = result.filter((it) => hoodTerms.some((term) => it.neighborhood.toLowerCase().includes(term)));
      }
    }

    // 6. Radius filter
    if (radius < 25) {
      result = result.filter((it) => it.distance === undefined || it.distance <= radius);
    }

    // 7. Availability filter
    if (availability === 'pending') {
      result = result.filter((it) => it.claimed && it.physicalStatus !== 'received');
    } else if (availability === 'available') {
      result = result.filter((it) => !it.claimed);
    }

    // 8. Sorting
    if (sortBy === 'nearest') {
      result.sort((a, b) => (a.distance ?? Number.POSITIVE_INFINITY) - (b.distance ?? Number.POSITIVE_INFINITY));
    } else if (sortBy === 'condition') {
      result.sort((a, b) => (a.condition.includes('New') ? -1 : 1));
    } else if (sortBy === 'reputable') {
      result.sort((a, b) => b.donor.rehomedCount - a.donor.rehomedCount);
    }

    return result;
  }, [
    items,
    searchQuery,
    selectedCategory,
    selectedConditions,
    selectedProtocols,
    neighborhood,
    radius,
    availability,
    sortBy
  ]);

  const mapItems = useMemo(
    () => filteredItems.filter((item) => item.mapCoords
      && Number.isFinite(item.mapCoords.x) && Number.isFinite(item.mapCoords.y)
      && item.mapCoords.x >= 0 && item.mapCoords.x <= 100
      && item.mapCoords.y >= 0 && item.mapCoords.y <= 100),
    [filteredItems],
  );

  // Claims
  const claimedItems = useMemo(() => {
    return claims;
  }, [claims]);

  const handleConfirmClaim = async (
    item: ItemListing,
    pickupWindow: string,
    note: string,
    _passCode: string
  ): Promise<string> => {
    const start = new Date();
    const end = new Date();
    if (pickupWindow.startsWith('Tomorrow Morning')) { start.setDate(start.getDate() + 1); start.setHours(9, 0, 0, 0); end.setTime(start.getTime()); end.setHours(11, 30, 0, 0); }
    else if (pickupWindow.startsWith('Tomorrow Evening')) { start.setDate(start.getDate() + 1); start.setHours(17, 0, 0, 0); end.setTime(start.getTime()); end.setHours(19, 30, 0, 0); }
    else if (pickupWindow.startsWith('This Weekend')) { const daysUntilSaturday = (6 - start.getDay() + 7) % 7 || 7; start.setDate(start.getDate() + daysUntilSaturday); start.setHours(10, 0, 0, 0); end.setTime(start.getTime()); end.setHours(16, 0, 0, 0); }
    else { start.setHours(16, 0, 0, 0); if (start <= new Date()) start.setDate(start.getDate() + 1); end.setTime(start.getTime()); end.setHours(18, 30, 0, 0); }
    const result: any = await api('/claims', { method: 'POST', body: JSON.stringify({ listingId: item.id, pickupWindow: { start: start.toISOString(), end: end.toISOString() }, note: `${pickupWindow}: ${note}` }) });
    await Promise.all([refreshListings(), refreshClaims()]);
    showToast(`Claim confirmed for "${item.title}".`);
    return result.data.claim.passCode;
  };

  const handleConfirmReceived = (itemId: string) => {
    const item = claims.find((claim) => claim.id === itemId);
    if (!item?.claimId) return;
    api(`/claims/${item.claimId}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'completed' }) }).then(() => Promise.all([refreshListings(), refreshClaims()])).then(() => showToast('Pickup marked as received.')).catch((e) => showToast(e.message));
  };

  const handleCancelClaim = (itemId: string) => {
    const item = claims.find((claim) => claim.id === itemId);
    if (!item?.claimId) return;
    api(`/claims/${item.claimId}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'cancelled' }) }).then(() => Promise.all([refreshListings(), refreshClaims()])).then(() => showToast('Claim cancelled. Item returned to circulation.')).catch((e) => showToast(e.message));
  };

  const handleAddItem = async (newItem: ItemListing) => {
    const image = newItem.image.startsWith('http') ? newItem.image : '';
    await api('/listings', { method: 'POST', body: JSON.stringify({ title: newItem.title, description: newItem.description, category: newItem.category, condition: newItem.condition, images: image ? [image] : [], locality: newItem.neighborhood, pickupDetails: { handoverType: newItem.handoverProtocol, instructions: newItem.description } }) });
    await refreshListings();
    showToast(`"${newItem.title}" is now circulating in ${newItem.neighborhood}!`);
  };

  const handleUpdateListing = async (id: string, changes: { title: string; description: string }) => {
    await api(`/listings/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });
    await Promise.all([refreshListings(), refreshClaims()]);
    showToast('Listing updated.');
  };
  const handleDeleteListing = async (id: string) => {
    await api(`/listings/${id}`, { method: 'DELETE' });
    await Promise.all([refreshListings(), refreshClaims()]);
    showToast('Listing deleted.');
  };
  const handleOwnerClaimStatus = async (id: string, status: 'accepted' | 'rejected') => {
    await api(`/claims/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    await Promise.all([refreshListings(), refreshClaims()]);
    showToast(status === 'accepted' ? 'Claim accepted.' : 'Claim rejected and item returned to Explore.');
  };

  const handleSendMessage = (_item: ItemListing, _message: string): boolean => {
    showToast('Direct messaging is not connected yet. Please coordinate through the pickup details after the owner accepts your claim.');
    return false;
  };

  // Has active filter badges to show
  const hasActiveBadges =
    selectedCategory !== 'All Categories' ||
    radius < 25 ||
    selectedConditions.length > 0 ||
    selectedProtocols.length > 0 ||
    searchQuery.trim().length > 0;

  return (
    <div className="bg-[#09090b] min-h-screen text-[#fafafa] flex flex-col font-body selection:bg-[#7c3aed] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] border border-[#a78bfa] text-[#fafafa] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#34d399] text-xl">check_circle</span>
          <span className="text-[13px] font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => { if ((tab === 'my-claims' || tab === 'my-listings') && !token) setAuthOpen(true); else setCurrentTab(tab); }}
        onPostItemClick={() => token ? setIsPostModalOpen(true) : setAuthOpen(true)}
        onChangeLocationClick={() => {
          setNeighborhood(neighborhood === 'all' ? 'capitol-hill' : 'all');
          showToast('Updated neighborhood focus area');
        }}
        currentNeighborhood={currentNeighborhoodLabel}
        radius={radius}
        claimsCount={claimedItems.length}
        authenticated={Boolean(token)}
        currentUser={currentUser}
        onAuthClick={() => { if (token) { saveToken(null); setToken(null); setCurrentUser(null); showToast('Signed out'); } else setAuthOpen(true); }}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 bg-[#09090b] min-h-[calc(100vh-20rem)] flex-1">
        {currentTab === 'my-claims' ? (
          <MyClaimsView
            claimedItems={claimedItems}
            onConfirmReceived={handleConfirmReceived}
            onCancelClaim={handleCancelClaim}
            onBackToExplore={() => setCurrentTab('explore')}
            onContactDonor={(it) => setInspectingItem(it)}
          />
        ) : currentTab === 'my-listings' ? (
          <MyListingsView listings={myListings} claims={receivedClaims} onUpdate={handleUpdateListing} onDelete={handleDeleteListing} onClaimStatus={handleOwnerClaimStatus} onBack={() => setCurrentTab('explore')} />
        ) : currentTab === 'how-it-works' ? (
          <HowItWorksView
            onBackToExplore={() => setCurrentTab('explore')}
            onPostItemClick={() => setIsPostModalOpen(true)}
          />
        ) : currentTab === 'community-stories' ? (
          <CommunityStoriesView
            onBackToExplore={() => setCurrentTab('explore')}
            onPostItemClick={() => setIsPostModalOpen(true)}
          />
        ) : (
          <div className="flex flex-col w-full">
            {/* Ambient background glows */}
            <div className="relative w-full max-w-[1280px] mx-auto px-4 md:px-8 py-4 md:py-10">
              <div className="absolute -top-12 right-10 w-96 h-96 bg-[#7c3aed]/15 rounded-full blur-[110px] pointer-events-none -z-10"></div>
              <div className="absolute top-80 left-0 w-80 h-80 bg-[#a78bfa]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

              {/* Search & Custom Control Panel */}
              <SearchControlPanel
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                neighborhood={neighborhood}
                setNeighborhood={setNeighborhood}
                radius={radius}
                setRadius={setRadius}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              {/* Main Two-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Mobile Filter Toggle Button */}
                <div className="lg:hidden w-full mb-1">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full py-2.5 px-4 bg-[#121215] border border-[#27272a] rounded-xl text-[13px] font-semibold text-[#fafafa] flex items-center justify-between cursor-pointer hover:border-[#a78bfa]/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#a78bfa] text-base">tune</span>
                      <span>Filter by Category &amp; Condition</span>
                    </span>
                    <span className="material-symbols-outlined text-sm text-[#a1a1aa]">
                      {showMobileFilters ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                {/* Left Sidebar Filters */}
                <div className={`lg:col-span-3 w-full ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                  <SidebarFilters
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedConditions={selectedConditions}
                    toggleCondition={toggleCondition}
                    selectedProtocols={selectedProtocols}
                    toggleProtocol={toggleProtocol}
                    availability={availability}
                    setAvailability={setAvailability}
                    onResetFilters={handleResetFilters}
                    radius={radius}
                    items={items}
                  />
                </div>

                {/* Right Main Content Area */}
                <section className="lg:col-span-9 w-full flex flex-col text-left">
                  {/* Header & Map Pins Counter */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa] shadow-[0_0_8px_#a78bfa] animate-pulse"></span>
                        <h1 className="text-[24px] text-[#fafafa] font-semibold tracking-tight">
                          Available Items in {currentNeighborhoodLabel.replace(' & Central', '')}
                        </h1>
                      </div>
                      <p className="text-[14px] text-[#a1a1aa] mt-0.5">
                        {filteredItems.length} verified circular items ready for pickup nearby
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[#a1a1aa]">
                      <span className="text-[12px] font-semibold">Map View:</span>
                      <button
                        type="button"
                        onClick={() => setIsMapModalOpen(true)}
                        aria-label="Toggle map view"
                        className="flex items-center gap-1 px-3 py-1 bg-[#121215] hover:bg-[#18181b] border border-[#27272a] rounded-lg text-[#a78bfa] text-[12px] font-semibold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">map</span>
                        <span>Pins ({mapItems.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Filter Badges */}
                  {hasActiveBadges && (
                    <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
                      {searchQuery.trim() && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-[#27272a] text-[#fafafa] rounded-full text-[12px] font-semibold shadow-sm">
                          <span>Search: "{searchQuery}"</span>
                          <button
                            type="button"
                            aria-label="Remove search filter"
                            onClick={() => setSearchQuery('')}
                            className="hover:text-[#ef4444] transition-colors flex items-center text-[#a1a1aa] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </span>
                      )}

                      {selectedCategory !== 'All Categories' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-[#27272a] text-[#fafafa] rounded-full text-[12px] font-semibold shadow-sm">
                          <span>Category: {selectedCategory}</span>
                          <button
                            type="button"
                            aria-label="Remove category filter"
                            onClick={() => setSelectedCategory('All Categories')}
                            className="hover:text-[#ef4444] transition-colors flex items-center text-[#a1a1aa] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </span>
                      )}

                      {radius < 25 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-[#27272a] text-[#fafafa] rounded-full text-[12px] font-semibold shadow-sm">
                          <span>Within {radius} miles</span>
                          <button
                            type="button"
                            aria-label="Remove distance filter"
                            onClick={() => setRadius(25)}
                            className="hover:text-[#ef4444] transition-colors flex items-center text-[#a1a1aa] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </span>
                      )}

                      {selectedConditions.map((cond) => (
                        <span
                          key={cond}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-[#27272a] text-[#fafafa] rounded-full text-[12px] font-semibold shadow-sm"
                        >
                          <span>Condition: {cond.split(' ')[0]}</span>
                          <button
                            type="button"
                            aria-label={`Remove condition ${cond}`}
                            onClick={() => toggleCondition(cond)}
                            className="hover:text-[#ef4444] transition-colors flex items-center text-[#a1a1aa] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </span>
                      ))}

                      {selectedProtocols.map((proto) => (
                        <span
                          key={proto}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-[#27272a] text-[#fafafa] rounded-full text-[12px] font-semibold shadow-sm"
                        >
                          <span>Protocol: {proto}</span>
                          <button
                            type="button"
                            aria-label={`Remove protocol ${proto}`}
                            onClick={() => toggleProtocol(proto)}
                            className="hover:text-[#ef4444] transition-colors flex items-center text-[#a1a1aa] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </span>
                      ))}

                      <button
                        type="button"
                        onClick={handleClearAllBadges}
                        className="text-[#a78bfa] hover:text-[#c4b5fd] text-[12px] underline font-semibold ml-2 transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  {/* Items Grid */}
                  {!loading && loadError && (
                    <div role="alert" className="mb-4 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-200">
                      <p>Listings could not be loaded: {loadError}</p>
                      <button type="button" className="mt-2 underline" onClick={() => { setLoading(true); setLoadError(null); refreshListings().catch((error) => setLoadError(error instanceof Error ? error.message : 'Unable to load listings')).finally(() => setLoading(false)); }}>Try again</button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {loading ? <div className="col-span-full py-12 text-center text-[#a1a1aa]">Loading listings…</div> : filteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onDetailsClick={(it) => setInspectingItem(it)}
                        onClaimClick={(it) => {
                          if (it.claimed) {
                            setCurrentTab('my-claims');
                            } else if (!token) {
                              setAuthOpen(true);
                            } else {
                            setClaimingItem(it);
                          }
                        }}
                      />
                    ))}
                  </div>

                  {/* Empty search results fallback */}
                  {filteredItems.length === 0 && !loading && !loadError && (
                    <div className="py-16 text-center bg-[#121215] rounded-3xl border border-[#27272a] p-8 mt-4">
                      <span className="material-symbols-outlined text-[#a78bfa] text-4xl mb-2">{items.length === 0 ? 'inventory_2' : 'search_off'}</span>
                      <h3 className="text-[18px] font-semibold text-[#fafafa]">
                        {items.length === 0 ? 'No items posted yet' : 'No circular items matched your exact filters'}
                      </h3>
                      <p className="text-[13px] text-[#a1a1aa] mt-1 mb-4">
                        {items.length === 0 ? 'Be the first to share a useful item with your neighbors.' : 'Clear your filters to view all available furniture, electronics, and goods.'}
                      </p>
                      <button type="button" onClick={() => items.length === 0 ? (token ? setIsPostModalOpen(true) : setAuthOpen(true)) : handleClearAllBadges()} className="px-6 py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)]">
                        {items.length === 0 ? 'Post the first item' : 'Clear All Filters & Show Everything'}
                      </button>
                    </div>
                  )}

                  {/* Pagination / Showing Status */}
                  <div className="mt-10 flex flex-col items-center justify-center gap-2">
                    <span className="text-[12px] text-[#a1a1aa]">
                      Showing {filteredItems.length} circular item
                      {filteredItems.length === 1 ? '' : 's'} in circulation
                    </span>
                  </div>

                  {/* Friendly Empty State / Search Alert Banner Card */}
                  <div className="mt-10 bg-gradient-to-r from-[#18181b] via-[#121215] to-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#7c3aed]/30 border border-[#a78bfa]/30 text-[#a78bfa] flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-2xl">manage_search</span>
                      </div>
                      <div>
                        <h3 className="text-[17px] text-[#fafafa] font-semibold mb-1">
                          Can't find what you're looking for?
                        </h3>
                        <p className="text-[13px] text-[#a1a1aa] max-w-xl leading-relaxed">
                          Save a neighborhood search alert or post a "Looking For" request. Automatic neighbor notifications are not configured yet.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => token ? setIsAlertModalOpen(true) : setAuthOpen(true)}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] border border-[#27272a] text-[#fafafa] text-[12px] font-semibold transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[#a78bfa] text-base">
                          notifications_active
                        </span>
                        <span>Create Alert</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => token ? setIsRequestModalOpen(true) : setAuthOpen(true)}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[12px] font-semibold transition-all shadow-[0_0_12px_rgba(167,139,250,0.25)] active:scale-95 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base font-bold">campaign</span>
                        <span>Post Request</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        availableItemsCount={items.length}
        onSelectHub={(hub) => {
          setNeighborhood(hub);
          setCurrentTab('explore');
          showToast(`Switched neighborhood filter to ${hub}`);
        }}
        onOpenGuidelines={() => setCurrentTab('how-it-works')}
      />

      {/* Modals */}
      <ItemDetailsModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onClaim={(item) => setClaimingItem(item)}
        onSendMessage={handleSendMessage}
      />

      <ClaimModal
        item={claimingItem}
        onClose={() => setClaimingItem(null)}
        onConfirmClaim={handleConfirmClaim}
        onGoToMyClaims={() => {
          setClaimingItem(null);
          setCurrentTab('my-claims');
        }}
      />

      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddItem={handleAddItem}
      />

      {isMapModalOpen && (
        <MapViewModal
          items={mapItems}
          radius={radius}
          onClose={() => setIsMapModalOpen(false)}
          onSelectItem={(it) => setInspectingItem(it)}
        />
      )}

      <CreateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        radius={radius}
        neighborhood={currentNeighborhoodLabel}
        onSuccess={async (term, notifyByEmail) => {
          await api('/community/alerts', { method: 'POST', body: JSON.stringify({ term, radius, locality: neighborhood === 'all' ? 'Seattle' : currentNeighborhoodLabel, notifyByEmail }) });
          showToast(`Alert saved for "${term}". Notification delivery is not configured yet.`);
        }}
      />

      <PostRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={async (description, category) => {
          await api('/community/requests', { method: 'POST', body: JSON.stringify({ description, category, locality: neighborhood === 'all' ? undefined : currentNeighborhoodLabel }) });
          showToast('Request saved to your account. Neighbors are not notified automatically yet.');
        }}
      />
      {authOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"><form onSubmit={handleAuth} className="w-full max-w-md bg-[#121215] border border-[#27272a] rounded-3xl p-6 space-y-4"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{authMode === 'login' ? 'Welcome back' : 'Join ShareLoop'}</h2><button type="button" onClick={() => setAuthOpen(false)} aria-label="Close" className="text-[#a1a1aa]">×</button></div>{authError && <p role="alert" className="text-sm text-red-400">{authError}</p>}{authMode === 'register' && <input name="name" required minLength={2} placeholder="Your name" className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3" />}<input name="email" type="email" required placeholder="Email" className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3"/><input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3"/><button disabled={authSubmitting} className="w-full bg-[#a78bfa] disabled:opacity-50 text-[#09090b] font-semibold rounded-xl py-3">{authSubmitting ? 'Please wait…' : authMode === 'login' ? 'Sign in' : 'Create account'}</button><button type="button" disabled={authSubmitting} onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="w-full text-sm text-[#c4b5fd]">{authMode === 'login' ? 'New here? Create an account' : 'Already a member? Sign in'}</button></form></div>}
    </div>
  );
}
