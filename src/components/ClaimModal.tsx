import React, { useState } from 'react';
import { ItemListing } from '../types';

interface ClaimModalProps {
  item: ItemListing | null;
  onClose: () => void;
  onConfirmClaim: (item: ItemListing, pickupWindow: string, note: string, passCode: string) => void;
  onGoToMyClaims: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  onClose,
  onConfirmClaim,
  onGoToMyClaims
}) => {
  const [pickupSlot, setPickupSlot] = useState('Today (4:00 PM – 6:30 PM)');
  const [friendlyNote, setFriendlyNote] = useState(
    "Hi! I would love to rehome this item. I have reliable transport and can pick up on time!"
  );
  const [pledgeAccepted, setPledgeAccepted] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedPassCode, setGeneratedPassCode] = useState('');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeAccepted) return;
    const pass = `PIN-PASS #${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedPassCode(pass);
    setIsSubmitted(true);
    onConfirmClaim(item, pickupSlot, friendlyNote, pass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#121215] border border-[#27272a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#27272a] bg-[#121215] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a78bfa] text-xl">handshake</span>
            <h3 className="text-[17px] font-semibold text-[#fafafa]">Claim for Rehoming</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#a1a1aa] hover:text-[#fafafa] p-1.5 rounded-full hover:bg-[#18181b] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1 min-h-0">
              {/* Item Mini Card */}
              <div className="flex items-center gap-3 bg-[#18181b] p-3 rounded-2xl border border-[#27272a]">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-[#a78bfa] uppercase">
                    {item.neighborhood}
                  </span>
                  <h4 className="text-[14px] font-semibold text-[#fafafa] truncate">{item.title}</h4>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                    Rehomed by <strong className="text-[#fafafa] font-medium">{item.donor.name}</strong> •{' '}
                    {item.handoverProtocol}
                  </p>
                </div>
              </div>

              {/* Pickup Window */}
              <div>
                <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-2">
                  Select Your Pickup Window
                </label>
                <div className="space-y-2">
                  {[
                    'Today (4:00 PM – 6:30 PM)',
                    'Tomorrow Morning (9:00 AM – 11:30 AM)',
                    'Tomorrow Evening (5:00 PM – 7:30 PM)',
                    'This Weekend (Flexible daytime)'
                  ].map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-[13px] cursor-pointer transition-colors ${
                        pickupSlot === slot
                          ? 'bg-[#7c3aed]/15 border-[#a78bfa] text-[#fafafa]'
                          : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:border-[#52525b]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickupSlot"
                        value={slot}
                        checked={pickupSlot === slot}
                        onChange={() => setPickupSlot(slot)}
                        className="accent-[#a78bfa]"
                      />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Note to Donor */}
              <div>
                <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1.5">
                  Quick Note to {item.donor.name}
                </label>
                <textarea
                  rows={2}
                  value={friendlyNote}
                  onChange={(e) => setFriendlyNote(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-[13px] text-[#fafafa] focus:outline-none focus:border-[#a78bfa] resize-none"
                />
              </div>

              {/* Community Pledge */}
              <label className="flex items-start gap-2.5 bg-[#09090b] p-3 rounded-xl border border-[#27272a] cursor-pointer">
                <input
                  type="checkbox"
                  checked={pledgeAccepted}
                  onChange={(e) => setPledgeAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-[#1e1e22] accent-[#a78bfa] cursor-pointer"
                />
                <span className="text-[11px] text-[#a1a1aa] leading-relaxed">
                  <strong className="text-[#fafafa]">Neighbor Circularity Pledge:</strong> I commit to
                  picking up the item during the scheduled window or contacting {item.donor.name} at
                  least 1 hour in advance.
                </span>
              </label>
            </div>

            {/* Pinned Submit Buttons Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-[#27272a] bg-[#121215] shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!pledgeAccepted}
                className="px-6 py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] disabled:opacity-40 text-[#09090b] text-[13px] font-semibold transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)] active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Confirm Rehome Claim</span>
                <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen with Navigation Options */
          <div className="overflow-y-auto p-6 text-center space-y-4 animate-fade-in flex-1">
            <div className="w-16 h-16 rounded-full bg-[#34d399]/20 border border-[#34d399]/40 text-[#34d399] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-[#fafafa] tracking-tight">Claim Confirmed!</h3>
              <p className="text-[13px] text-[#a1a1aa] max-w-sm mx-auto mt-1 leading-relaxed">
                We notified <strong className="text-[#fafafa]">{item.donor.name}</strong>. Your pickup pass
                is active and ready for your scheduled window.
              </p>
            </div>

            <div className="p-3 bg-[#18181b] rounded-xl border border-[#a78bfa]/40 inline-flex items-center gap-2 text-[13px] text-[#ede9fe] font-mono font-semibold">
              <span className="material-symbols-outlined text-[#a78bfa] text-base">vpn_key</span>
              <span>
                {generatedPassCode} • {item.neighborhood}
              </span>
            </div>

            <div className="text-[12px] text-[#a1a1aa] bg-[#09090b] p-3 rounded-xl border border-[#27272a] max-w-md mx-auto text-left">
              <div className="text-[#fafafa] font-semibold mb-0.5">Next step: Physical Collection</div>
              <div>
                When you pick up the item in person, head over to <strong>"My Claims"</strong> and click{' '}
                <strong className="text-[#34d399]">"Confirm Received Physically"</strong> to mark the
                circular rehoming complete!
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToMyClaims();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
                <span>View in My Claims</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#27272a] hover:bg-[#18181b] text-[#fafafa] text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Back to Explore Listings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
