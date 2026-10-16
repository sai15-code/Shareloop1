/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
import { CreateAlertModal, PostRequestModal } from './components/AlertAndRequestModals';
import { Footer } from './components/Footer';
import { INITIAL_ITEMS, MORE_ITEMS, NEIGHBORHOOD_OPTIONS, USER_PROFILE } from './data/mockData';
import { ItemListing, CategoryType, ConditionType, HandoverType } from './types';

export default function App() {
  // Navigation Tab
  const [currentTab, setCurrentTab] = useState<'explore' | 'my-claims' | 'how-it-works' | 'community-stories'>('explore');

  // Items State (all items available for circulation)
  const [items, setItems] = useState<ItemListing[]>([...INITIAL_ITEMS, ...MORE_ITEMS]);
  const [hasLoadedMore, setHasLoadedMore] = useState(true);

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
      const hoodTerm = hoodOption ? hoodOption.label.split(' ')[0].toLowerCase() : '';
      if (hoodTerm) {
        result = result.filter(
          (it) => it.neighborhood.toLowerCase().includes(hoodTerm) || it.distance <= radius
        );
      }
    }

    // 6. Radius filter
    if (radius < 25) {
      result = result.filter((it) => it.distance <= radius);
    }

    // 7. Availability filter
    if (availability === 'pending') {
      result = result.filter((it) => it.claimed && it.physicalStatus !== 'received');
    } else if (availability === 'available') {
      result = result.filter((it) => !it.claimed);
    }

    // 8. Sorting
    if (sortBy === 'nearest') {
      result.sort((a, b) => a.distance - b.distance);
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

  // Claims
  const claimedItems = useMemo(() => {
    return items.filter((it) => it.claimed);
  }, [items]);

  const handleConfirmClaim = (
    item: ItemListing,
    pickupWindow: string,
    note: string,
    passCode: string
  ) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              claimed: true,
              claimedBy: USER_PROFILE.name,
              pickupWindow,
              claimedNote: note,
              pickupPassCode: passCode,
              physicalStatus: 'awaiting_pickup'
            }
          : it
      )
    );
    showToast(`Claim confirmed! Pickup pass stored for "${item.title}".`);
  };

  const handleConfirmReceived = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              physicalStatus: 'received',
              receivedAt: new Date().toLocaleTimeString()
            }
          : it
      )
    );
    USER_PROFILE.savedCO2Lbs += 35;
    USER_PROFILE.claimedItems += 1;
    showToast(`Success! You confirmed physical receipt. +35 lbs CO2e saved!`);
  };

  const handleCancelClaim = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              claimed: false,
              claimedBy: undefined,
              pickupPassCode: undefined,
              pickupWindow: undefined,
              physicalStatus: undefined
            }
          : it
      )
    );
    showToast(`Claim cancelled. Item returned to circulation.`);
  };

  const handleAddItem = (newItem: ItemListing) => {
    setItems((prev) => [newItem, ...prev]);
    showToast(`"${newItem.title}" is now circulating in ${newItem.neighborhood}!`);
  };

  const handleSendMessage = (item: ItemListing, message: string) => {
    showToast(`Sent private message to ${item.donor.name}: "${message.slice(0, 30)}..."`);
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
        setCurrentTab={setCurrentTab}
        onPostItemClick={() => setIsPostModalOpen(true)}
        onChangeLocationClick={() => {
          setNeighborhood(neighborhood === 'all' ? 'capitol-hill' : 'all');
          showToast('Updated neighborhood focus area');
        }}
        currentNeighborhood={currentNeighborhoodLabel}
        radius={radius}
        claimsCount={claimedItems.length}
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
                        <span>Pins ({filteredItems.length})</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onDetailsClick={(it) => setInspectingItem(it)}
                        onClaimClick={(it) => {
                          if (it.claimed) {
                            setCurrentTab('my-claims');
                          } else {
                            setClaimingItem(it);
                          }
                        }}
                      />
                    ))}
                  </div>

                  {/* Empty search results fallback */}
                  {filteredItems.length === 0 && (
                    <div className="py-16 text-center bg-[#121215] rounded-3xl border border-[#27272a] p-8 mt-4">
                      <span className="material-symbols-outlined text-[#a78bfa] text-4xl mb-2">
                        search_off
                      </span>
                      <h3 className="text-[18px] font-semibold text-[#fafafa]">
                        No circular items matched your exact filters
                      </h3>
                      <p className="text-[13px] text-[#a1a1aa] mt-1 mb-4">
                        Click "Clear All Filters" to view all available furniture, electronics, and goods.
                      </p>
                      <button
                        type="button"
                        onClick={handleClearAllBadges}
                        className="px-6 py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)]"
                      >
                        Clear All Filters &amp; Show Everything
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
                          Set a neighborhood alert for specific goods, or post a "Looking For" request
                          to notify neighbors within 5 miles before they dispose of items.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsAlertModalOpen(true)}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#1e1e22] hover:bg-[#27272a] border border-[#27272a] text-[#fafafa] text-[12px] font-semibold transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[#a78bfa] text-base">
                          notifications_active
                        </span>
                        <span>Create Alert</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRequestModalOpen(true)}
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
          items={filteredItems}
          radius={radius}
          onClose={() => setIsMapModalOpen(false)}
          onSelectItem={(it) => setInspectingItem(it)}
        />
      )}

      <CreateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        radius={radius}
        onSuccess={(term) =>
          showToast(`Alert created for "${term}" in your ${radius}-mi circle!`)
        }
      />

      <PostRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={(req) =>
          showToast(`Broadcasted request: "${req.slice(0, 30)}..." to neighbors!`)
        }
      />
    </div>
  );
}
