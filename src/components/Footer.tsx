import React from 'react';

interface FooterProps {
  onSelectHub?: (hub: string) => void;
  onOpenGuidelines?: () => void;
  availableItemsCount: number;
}

export const Footer: React.FC<FooterProps> = ({ onSelectHub, onOpenGuidelines, availableItemsCount }) => {

  return (
    <footer className="w-full bg-[#0c0c0f] border-t border-[#27272a]/80 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
          {/* Col 1: ShareLoop Impact */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#a78bfa] text-2xl">eco</span>
              <span className="text-[17px] text-[#fafafa] font-semibold">ShareLoop Impact</span>
            </div>
            <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
              Connecting neighborhoods to keep useful goods circulating locally and away from incinerators.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 bg-[#121215] px-4 py-2 rounded-xl border border-[#27272a]/60">
              <span className="material-symbols-outlined text-[#a78bfa]">recycling</span>
              <div className="flex flex-col">
                <span className="text-[17px] text-[#fafafa] font-semibold leading-tight">{availableItemsCount}</span>
                <span className="text-[11px] text-[#a1a1aa]">Available items now</span>
              </div>
            </div>
          </div>

          {/* Col 2: Neighborhood Hubs */}
          <div className="flex flex-col gap-2">
            <span className="text-[17px] text-[#fafafa] font-semibold">Neighborhood Hubs</span>
            <ul className="flex flex-col gap-1 text-[13px] text-[#a1a1aa]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectHub && onSelectHub('capitol-hill')}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Seattle Central &amp; Capitol Hill
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectHub && onSelectHub('fremont')}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Fremont Commons
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectHub && onSelectHub('beacon-hill')}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Beacon Hill &amp; South
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectHub && onSelectHub('queen-anne')}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Queen Anne Uplands
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Guidelines */}
          <div className="flex flex-col gap-2">
            <span className="text-[17px] text-[#fafafa] font-semibold">Trust &amp; Guidelines</span>
            <ul className="flex flex-col gap-1 text-[13px] text-[#a1a1aa]">
              <li>
                <button
                  type="button"
                  onClick={onOpenGuidelines}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Verified Neighbor Standards
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGuidelines}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Safe Porch Pickup Protocols
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGuidelines}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Accepted Reuse Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGuidelines}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Dispute Resolution &amp; Ethics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Local Loop Digest */}
          <div className="flex flex-col gap-2">
            <span className="text-[17px] text-[#fafafa] font-semibold">Local Loop Digest</span>
            <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
              Weekly roundup of available items and circular initiatives in your immediate zip code.
            </p>
            <p className="text-[12px] text-[#a1a1aa]">Email digest signup is not connected yet.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#27272a]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#a1a1aa] text-[12px]">
          <span>© 2025 ShareLoop Platform PBC. Fostering resilient neighborhood circularity.</span>
          <div className="flex items-center gap-6">
            <button type="button" onClick={onOpenGuidelines} className="hover:text-[#fafafa] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button type="button" onClick={onOpenGuidelines} className="hover:text-[#fafafa] transition-colors cursor-pointer">
              Terms of Service
            </button>
            <button type="button" onClick={onOpenGuidelines} className="hover:text-[#fafafa] transition-colors cursor-pointer">
              Community Pledge
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
