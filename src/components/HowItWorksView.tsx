import React from 'react';

interface HowItWorksViewProps {
  onBackToExplore: () => void;
  onPostItemClick: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onBackToExplore, onPostItemClick }) => {
  const steps = [
    {
      num: '01',
      title: 'Snap & Post in Seconds',
      description: 'Take a clear photo of an item you no longer need. Add condition notes and choose your preferred handover protocol (Porch Pickup, Public Meetup, or Curbside).',
      icon: 'add_a_photo'
    },
    {
      num: '02',
      title: 'Hyperlocal 5-Mile Matching',
      description: 'Items are surfaced to verified neighbors within walking or short-biking distance. No cross-city transit or packaging waste.',
      icon: 'radar'
    },
    {
      num: '03',
      title: 'Safe Porch Pickup Coordination',
      description: 'Claimants reserve a verified pickup window. Street addresses and gate codes are securely revealed only after mutual confirmation.',
      icon: 'deck'
    },
    {
      num: '04',
      title: 'Track Neighborhood Circularity',
      description: 'Every rehomed good logs carbon and landfill offset metrics directly into your neighborhood hub scorecard.',
      icon: 'compost'
    }
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 animate-fade-in text-left">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToExplore}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#a78bfa] hover:text-[#c4b5fd] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Explore Listings</span>
        </button>
        <button
          onClick={onPostItemClick}
          className="inline-flex items-center gap-1.5 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-semibold px-4 py-2 rounded-full transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base font-bold">add</span>
          <span>Post an Item Now</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#18181b] via-[#121215] to-[#18181b] p-8 md:p-12 rounded-3xl border border-[#27272a] mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#a78bfa]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#a78bfa]/10 border border-[#a78bfa]/30 rounded-full text-[#a78bfa] text-[12px] font-semibold mb-4">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>Zero-Waste Local Movement</span>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#fafafa] tracking-tight leading-tight mb-4">
            How ShareLoop Circulates Goods in Your Neighborhood
          </h1>
          <p className="text-[15px] text-[#a1a1aa] leading-relaxed">
            We connect thoughtful givers and eager receivers within tight neighborhood circles. Everything on ShareLoop is 100% free, respectful, and designed to keep quality household items out of incinerators.
          </p>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {steps.map((s) => (
          <div
            key={s.num}
            className="bg-[#121215] p-6 rounded-2xl border border-[#27272a] relative hover:border-[#a78bfa]/50 transition-colors"
          >
            <span className="text-[28px] font-bold text-[#27272a] block mb-2">{s.num}</span>
            <div className="w-10 h-10 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#a78bfa] mb-4">
              <span className="material-symbols-outlined text-xl">{s.icon}</span>
            </div>
            <h3 className="text-[16px] font-semibold text-[#fafafa] mb-2">{s.title}</h3>
            <p className="text-[13px] text-[#a1a1aa] leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Safety & Protocol Banner */}
      <div className="bg-[#121215] border border-[#27272a] p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#a78bfa] font-semibold text-[14px] mb-2">
            <span className="material-symbols-outlined">deck</span>
            <span>Safe Porch Pickup</span>
          </div>
          <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
            Givers specify a designated porch spot. Claimants collect without knocking or scheduling stress, guided by private access notes.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-[#34d399] font-semibold text-[14px] mb-2">
            <span className="material-symbols-outlined">shield_person</span>
            <span>Verified Neighbor Identity</span>
          </div>
          <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
            All users authenticate with neighborhood residency checks. Flake-free ratings ensure mutual reliability.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-[#a78bfa] font-semibold text-[14px] mb-2">
            <span className="material-symbols-outlined">savings</span>
            <span>Always $0 — Zero Commerce</span>
          </div>
          <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
            No sales, no haggling, no trading fees. Pure community abundance, fostering mutual trust across the street.
          </p>
        </div>
      </div>
    </div>
  );
};
