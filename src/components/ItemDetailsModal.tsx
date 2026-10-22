import React, { useState } from 'react';
import { ItemListing } from '../types';

interface ItemDetailsModalProps {
  item: ItemListing | null;
  onClose: () => void;
  onClaim: (item: ItemListing) => void;
  onSendMessage: (item: ItemListing, message: string) => boolean;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onClaim,
  onSendMessage
}) => {
  const [quickMessage, setQuickMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!item) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    if (onSendMessage(item, quickMessage)) {
      setMessageSent(true);
      setTimeout(() => { setMessageSent(false); setQuickMessage(''); }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#121215] border border-[#27272a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]/80 bg-[#18181b]/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a78bfa] shadow-[0_0_6px_#a78bfa]"></span>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#a78bfa]">
              {item.subCategory}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Visual */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#27272a] bg-[#09090b]">
            <img
              src={item.image}
              alt={item.altText}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-3 py-1 bg-[#09090b]/85 backdrop-blur-md text-[#fafafa] border border-[#27272a] text-[12px] font-semibold rounded-full shadow-sm">
                {item.condition}
              </span>
              <span className="px-3 py-1 bg-[#7c3aed]/90 backdrop-blur-md text-[#ede9fe] border border-[#a78bfa]/40 text-[12px] font-semibold rounded-full shadow-sm">
                {item.handoverProtocol}
              </span>
            </div>
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1 bg-[#09090b]/85 backdrop-blur-md text-[#a1a1aa] border border-[#27272a] text-[12px] font-medium rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-sm text-[#a78bfa]">near_me</span>
                {item.distance === undefined ? 'Distance unavailable' : `${item.distance} miles away`} • {item.neighborhood}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <div className="flex items-center justify-between text-[#a1a1aa] text-[12px] mb-1">
              <span>Posted {item.timeAgo}</span>
              <span className="text-[#34d399] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span> 100% Free Rehome
              </span>
            </div>
            <h2 className="text-[22px] font-semibold text-[#fafafa] tracking-tight mb-2">
              {item.title}
            </h2>
            <p className="text-[14px] text-[#a1a1aa] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#18181b] p-4 rounded-2xl border border-[#27272a]">
            <div>
              <span className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Condition</span>
              <p className="text-[13px] text-[#fafafa] font-medium mt-0.5">{item.conditionDescription}</p>
            </div>
            <div>
              <span className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Dimensions</span>
              <p className="text-[13px] text-[#fafafa] font-medium mt-0.5">{item.dimensions || 'Standard size'}</p>
            </div>
            <div>
              <span className="text-[11px] text-[#a1a1aa] uppercase font-semibold">Est. Weight</span>
              <p className="text-[13px] text-[#fafafa] font-medium mt-0.5">{item.weightEst || 'Under 10 lbs'}</p>
            </div>
          </div>

          {/* Safe Pickup Guide */}
          <div className="bg-[#18181b]/70 p-4 rounded-2xl border border-[#27272a] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#a78bfa] text-xl shrink-0 mt-0.5">
              shield_with_heart
            </span>
            <div className="text-[12px]">
              <span className="font-semibold text-[#fafafa]">
                {item.handoverProtocol} Protocol:
              </span>
              <p className="text-[#a1a1aa] mt-0.5 leading-relaxed">
                {item.handoverProtocol === 'Porch Pickup'
                  ? 'Contactless collection. Item is placed under covered shelter on private porch. Full street address & access instructions unlocked after claim.'
                  : item.handoverProtocol === 'Public Meetup'
                  ? 'Daylight meet in designated high-visibility neighborhood community spot (e.g. coffee shop or transit plaza).'
                  : 'Time-sensitive curbside alert. Item is placed out for immediate retrieval.'}
              </p>
            </div>
          </div>

          {/* Donor Box */}
          <div className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={item.donor.avatar}
                alt={item.donor.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#a78bfa]/50"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[14px] font-semibold text-[#fafafa]">{item.donor.name}</h4>
                  <span className="material-symbols-outlined text-[#a78bfa] text-sm">verified</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#a1a1aa] mt-0.5">
                  <span className="text-[#a78bfa] font-medium">{item.donor.rehomedCount} items rehomed</span>
                  <span>•</span>
                  <span>Joined {item.donor.joinedYear || '2023'}</span>
                  <span>•</span>
                  <span>Replies in {item.donor.responseRate || '15 mins'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <form onSubmit={handleSend} className="space-y-2">
            <label className="text-[12px] font-semibold text-[#a1a1aa]">
              Ask {item.donor.name} a question about this item:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Can I pick this up around 5:30pm today?"
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                className="flex-1 bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-[13px] text-[#fafafa] placeholder:text-[#a1a1aa]/50 focus:outline-none focus:border-[#a78bfa]"
              />
              <button
                type="submit"
                disabled={!quickMessage.trim()}
                className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] disabled:opacity-40 text-[#fafafa] rounded-xl text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Send
              </button>
            </div>
            {messageSent && (
              <p className="text-[11px] text-[#34d399] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                Message sent to {item.donor.name}!
              </p>
            )}
          </form>
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-[#27272a] bg-[#18181b]/70 flex items-center justify-between gap-4">
          <div className="text-[12px] text-[#a1a1aa]">
            Estimated CO2e saved: <strong className="text-[#34d399]">~35 lbs</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#27272a] hover:bg-[#27272a] text-[#fafafa] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onClaim(item);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-semibold transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{item.claimed ? 'Claimed' : 'Claim Item'}</span>
              <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
