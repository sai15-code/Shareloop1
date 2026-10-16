import React, { useState } from 'react';

interface FooterProps {
  onSelectHub?: (hub: string) => void;
  onOpenGuidelines?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectHub, onOpenGuidelines }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2500);
  };

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
                <span className="text-[17px] text-[#fafafa] font-semibold leading-tight">4,820</span>
                <span className="text-[11px] text-[#a1a1aa]">Items saved from landfills</span>
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
                  onClick={() => onSelectHub && onSelectHub('ballard')}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Ballard &amp; Fremont Commons
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectHub && onSelectHub('beacon-hill')}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  West Seattle Community Circle
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectHub && onSelectHub('all')}
                  className="hover:text-[#a78bfa] transition-colors text-left cursor-pointer"
                >
                  Columbia City Exchange
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
            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 mt-1">
              <input
                className="h-11 flex-1 rounded-xl bg-[#121215] px-4 text-[#fafafa] placeholder:text-[#a1a1aa]/50 outline-none border border-[#27272a] focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/40 transition-all text-[13px]"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                className="h-11 px-4 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] font-semibold rounded-xl text-[13px] transition-colors shrink-0 shadow-[0_0_12px_rgba(167,139,250,0.2)] cursor-pointer"
                type="submit"
              >
                Join
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-[#34d399] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-xs">check</span>
                Subscribed to weekly neighborhood digest!
              </p>
            )}
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
