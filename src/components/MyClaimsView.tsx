import React, { useState } from 'react';
import { ItemListing } from '../types';

interface MyClaimsViewProps {
  claimedItems: ItemListing[];
  onConfirmReceived: (itemId: string) => void;
  onCancelClaim: (itemId: string) => void;
  onBackToExplore: () => void;
  onContactDonor: (item: ItemListing) => void;
}

export const MyClaimsView: React.FC<MyClaimsViewProps> = ({
  claimedItems,
  onConfirmReceived,
  onCancelClaim,
  onBackToExplore,
  onContactDonor
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'awaiting' | 'received'>('all');

  const filtered = claimedItems.filter((it) => {
    if (filterTab === 'awaiting') return it.physicalStatus !== 'received';
    if (filterTab === 'received') return it.physicalStatus === 'received';
    return true;
  });

  const awaitingCount = claimedItems.filter((it) => it.physicalStatus !== 'received').length;
  const receivedCount = claimedItems.filter((it) => it.physicalStatus === 'received').length;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 animate-fade-in text-left">
      {/* Navigation breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToExplore}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#a78bfa] hover:text-[#c4b5fd] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Explore Listings</span>
        </button>

        <div className="flex items-center gap-2 text-[12px] bg-[#121215] px-4 py-1.5 rounded-full border border-[#27272a]">
          <span className="text-[#a1a1aa]">Total Active Passes:</span>
          <span className="text-[#a78bfa] font-bold">{awaitingCount}</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#18181b] via-[#121215] to-[#18181b] p-6 md:p-8 rounded-3xl border border-[#27272a] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#a78bfa]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#a78bfa]/10 border border-[#a78bfa]/30 rounded-full text-[#a78bfa] text-[12px] font-semibold mb-3">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span>Your Claimed Goods</span>
          </div>
          <h1 className="text-[28px] md:text-[34px] font-bold text-[#fafafa] tracking-tight">
            My Circular Claims &amp; Physical Pickup Passes
          </h1>
          <p className="text-[14px] text-[#a1a1aa] mt-2 leading-relaxed">
            Review your contactless porch passes, coordinate with verified neighbors, and click <strong>"Confirm Received Physically"</strong> once you have collected your item.
          </p>
        </div>
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#27272a] pb-3">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
            filterTab === 'all'
              ? 'bg-[#18181b] text-[#fafafa] border border-[#a78bfa]/40'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          All Claims ({claimedItems.length})
        </button>
        <button
          onClick={() => setFilterTab('awaiting')}
          className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            filterTab === 'awaiting'
              ? 'bg-[#18181b] text-[#a78bfa] border border-[#a78bfa]/40'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          <span>Awaiting Physical Pickup</span>
          {awaitingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] text-[11px] font-bold">
              {awaitingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilterTab('received')}
          className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            filterTab === 'received'
              ? 'bg-[#18181b] text-[#34d399] border border-[#34d399]/40'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          <span>Completed Handover</span>
          {receivedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#34d399]/20 text-[#34d399] text-[11px] font-bold">
              {receivedCount}
            </span>
          )}
        </button>
      </div>

      {/* Claims List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isReceived = item.physicalStatus === 'received';
            return (
              <div
                key={item.id}
                className={`bg-[#121215] rounded-2xl border transition-all p-5 md:p-6 ${
                  isReceived
                    ? 'border-[#34d399]/40 bg-[#121215]/80'
                    : 'border-[#27272a] hover:border-[#a78bfa]/50 shadow-lg'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex gap-4 items-start min-w-0 flex-1">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-[#27272a]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] font-semibold mb-1">
                        <span className="text-[#a78bfa] uppercase">{item.neighborhood}</span>
                        <span className="text-[#52525b]">•</span>
                        <span className="text-[#a1a1aa]">{item.handoverProtocol}</span>
                        <span className="text-[#52525b]">•</span>
                        <span className="text-[#fafafa] font-medium">{item.distance === undefined ? 'Distance unavailable' : `${item.distance} mi away`}</span>
                      </div>
                      <h3 className="text-[17px] font-semibold text-[#fafafa] truncate">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-[#a1a1aa] mt-1 line-clamp-1">
                        {item.description}
                      </p>

                      {/* Pickup pass pill */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {item.claimStatus && <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.claimStatus === 'accepted' ? 'bg-[#34d399]/10 text-[#34d399]' : 'bg-[#a78bfa]/10 text-[#c4b5fd]'}`}>Claim {item.claimStatus}</span>}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#18181b] rounded-lg border border-[#a78bfa]/30 text-[12px] font-mono text-[#ede9fe]">
                          <span className="material-symbols-outlined text-sm text-[#a78bfa]">vpn_key</span>
                          <span>{item.pickupPassCode || 'Pass unavailable'}</span>
                        </div>
                        <div className="text-[12px] text-[#a1a1aa] flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-[#a78bfa]">schedule</span>
                          <span>Window: {item.pickupWindow || 'Not scheduled'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Donor Info & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#27272a]">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.donor.avatar}
                        alt={item.donor.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-[#52525b]"
                      />
                      <span className="text-[12px] text-[#fafafa] font-medium">{item.donor.name}</span>
                      <button
                        onClick={() => onContactDonor(item)}
                        className="p-1 rounded-lg hover:bg-[#18181b] text-[#a78bfa] transition-colors cursor-pointer"
                        title="Direct Message"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                      </button>
                    </div>

                    {/* Status & Confirmation Button */}
                    {!isReceived ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => onCancelClaim(item.id)}
                          className="px-3 py-2 text-[12px] text-[#a1a1aa] hover:text-[#ef4444] rounded-xl border border-[#27272a] hover:border-[#ef4444]/40 transition-colors cursor-pointer"
                        >
                          Release Claim
                        </button>
                        <button
                          type="button"
                          disabled={item.claimStatus !== 'accepted'}
                          onClick={() => onConfirmReceived(item.id)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#34d399] hover:bg-[#6ee7b7] disabled:opacity-40 disabled:cursor-not-allowed text-[#09090b] text-[13px] font-bold rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span className="material-symbols-outlined text-base font-bold">check_circle</span>
                          <span>{item.claimStatus === 'accepted' ? 'Confirm Received Physically' : 'Awaiting Owner Acceptance'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-[#34d399]/15 border border-[#34d399]/40 px-4 py-2 rounded-xl text-[#34d399] text-[12px] font-semibold">
                        <span className="material-symbols-outlined text-base">verified</span>
                        <span>Item Physically Received &amp; Rehomed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Porch Coordinates Note */}
                <div className="mt-4 pt-3 border-t border-[#27272a]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-[#a1a1aa]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#a78bfa]">deck</span>
                    <span>
                      {item.pickupInstructions || `Pickup details will be provided by the owner for ${item.handoverProtocol} in ${item.neighborhood}.`}
                    </span>
                  </div>
                  {isReceived ? (
                    <span className="text-[#34d399] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">compost</span>
                      +35 lbs CO2e saved from landfill
                    </span>
                  ) : (
                    <span className="text-[#a78bfa] font-medium">
                      Reserved exclusively for you
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-[#121215] rounded-3xl border border-[#27272a] p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#27272a] text-[#a78bfa] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">shopping_bag</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[#fafafa] mb-1">
            No Claimed Items Yet
          </h3>
          <p className="text-[13px] text-[#a1a1aa] mb-6 leading-relaxed">
            Browse available furniture, tech, tools, and clothing in your neighborhood circle and claim items for free rehoming.
          </p>
          <button
            onClick={onBackToExplore}
            className="px-6 py-2.5 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-semibold rounded-full transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)] active:scale-95 cursor-pointer"
          >
            Explore Available Items
          </button>
        </div>
      )}
    </div>
  );
};
