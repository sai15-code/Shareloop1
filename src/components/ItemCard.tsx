import React from 'react';
import { ItemListing } from '../types';

interface ItemCardProps {
  item: ItemListing;
  onDetailsClick: (item: ItemListing) => void;
  onClaimClick: (item: ItemListing) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onDetailsClick, onClaimClick }) => {
  // Dot color depending on condition
  const getConditionDotColor = () => {
    if (item.condition.includes('Like New') || item.condition.includes('Brand New')) {
      return 'bg-[#a78bfa] shadow-[0_0_4px_#a78bfa]';
    }
    if (item.condition.includes('Good') || item.title.includes('Patagonia')) {
      return 'bg-[#34d399] shadow-[0_0_4px_#34d399]';
    }
    return 'bg-[#71717a] shadow-[0_0_4px_#71717a]';
  };

  const getConditionDisplay = () => {
    if (item.title.includes('Patagonia')) return 'Excellent';
    if (item.condition === 'Like New (Flawless)') return 'Like New';
    if (item.condition === 'Brand New (In Box)') return 'Brand New';
    if (item.id === 'item-2' || item.id === 'item-6') return 'Good Condition';
    return item.condition;
  };

  const isPorchPickup = item.handoverProtocol === 'Porch Pickup';
  const isReceived = item.physicalStatus === 'received';

  return (
    <article className="group bg-[#121215] rounded-2xl overflow-hidden border border-[#27272a]/80 hover:border-[#52525b] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] bg-[#09090b] overflow-hidden">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
            src={item.image}
            alt={item.altText}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80';
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 bg-[#09090b]/85 backdrop-blur-md text-[#fafafa] border border-[#27272a] text-[11px] font-semibold rounded-full shadow-sm flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getConditionDotColor()}`}></span>
              {getConditionDisplay()}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            {isReceived ? (
              <span className="px-2.5 py-1 bg-[#065f46]/90 backdrop-blur-md text-[#bbf7d0] border border-[#34d399]/40 text-[11px] font-semibold rounded-full shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                Received
              </span>
            ) : item.claimed ? (
              <span className="px-2.5 py-1 bg-[#7c3aed]/90 backdrop-blur-md text-[#ede9fe] border border-[#a78bfa]/40 text-[11px] font-semibold rounded-full shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                Claimed (Pickup Pending)
              </span>
            ) : isPorchPickup ? (
              <span className="px-2.5 py-1 bg-[#7c3aed]/90 backdrop-blur-md text-[#ede9fe] border border-[#a78bfa]/40 text-[11px] font-semibold rounded-full shadow-sm">
                Porch Pickup
              </span>
            ) : item.handoverProtocol === 'Curbside Alert' ? (
              <span className="px-2.5 py-1 bg-[#18181b]/90 backdrop-blur-md text-[#fafafa] border border-[#27272a] text-[11px] font-semibold rounded-full shadow-sm">
                Curbside
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-[#18181b]/90 backdrop-blur-md text-[#fafafa] border border-[#27272a] text-[11px] font-semibold rounded-full shadow-sm">
                Public Meetup
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-0.5 bg-[#09090b]/85 backdrop-blur-md text-[#a1a1aa] border border-[#27272a] text-[11px] font-medium rounded-full flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-xs text-[#a78bfa]">near_me</span>
              {item.distance === undefined ? 'Distance unavailable' : `${item.distance} mi`} • {item.neighborhood}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 text-left">
          <div className="flex items-center justify-between text-[#a1a1aa] text-[11px] font-semibold mb-1">
            <span>{item.subCategory}</span>
            <span>{item.timeAgo}</span>
          </div>
          <h3
            onClick={() => onDetailsClick(item)}
            className="text-[17px] text-[#fafafa] group-hover:text-[#a78bfa] transition-colors line-clamp-1 mb-1.5 font-semibold cursor-pointer"
          >
            {item.title}
          </h3>
          <p className="text-[13px] text-[#a1a1aa] line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Donor Metadata */}
          <div className="flex items-center justify-between pt-2 border-t border-[#27272a]/60">
            <div className="flex items-center gap-2">
              <img
                className="w-7 h-7 rounded-full object-cover ring-1 ring-[#52525b]"
                src={item.donor.avatar}
                alt={item.donor.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <div className="flex flex-col">
                <span className="text-[11px] text-[#fafafa] font-semibold leading-tight">
                  {item.donor.name}
                </span>
                <span className="text-[12px] text-[#a78bfa] leading-none">
                  {item.donor.rehomedCount} rehomed items
                </span>
              </div>
            </div>
            <span
              className="material-symbols-outlined text-[#a78bfa] text-base"
              title="Verified Neighbor Badge"
            >
              {item.donor.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onDetailsClick(item)}
          className="py-2 px-3 bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] text-[12px] font-semibold rounded-xl transition-colors text-center cursor-pointer"
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => onClaimClick(item)}
          className={`py-2 px-3 text-[12px] font-semibold rounded-xl transition-all shadow-[0_0_12px_rgba(167,139,250,0.2)] active:scale-95 text-center flex items-center justify-center gap-1 cursor-pointer ${
            isReceived
              ? 'bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/40'
              : item.claimed
              ? 'bg-[#34d399] hover:bg-[#6ee7b7] text-[#09090b]'
              : 'bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b]'
          }`}
        >
          <span>{isReceived ? 'Received' : item.claimed ? 'Pass Ready' : 'Claim'}</span>
          <span className="material-symbols-outlined text-sm font-bold">
            {isReceived ? 'check_circle' : item.claimed ? 'vpn_key' : 'arrow_forward'}
          </span>
        </button>
      </div>
    </article>
  );
};
