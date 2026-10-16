import React from 'react';
import { CategoryType, ConditionType, HandoverType } from '../types';
import { CATEGORY_COUNTS } from '../data/mockData';

interface SidebarFiltersProps {
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  selectedConditions: ConditionType[];
  toggleCondition: (cond: ConditionType) => void;
  selectedProtocols: HandoverType[];
  toggleProtocol: (proto: HandoverType) => void;
  availability: 'all' | 'available' | 'pending';
  setAvailability: (avail: 'all' | 'available' | 'pending') => void;
  onResetFilters: () => void;
  radius: number;
}

const CONDITIONS: { label: ConditionType; desc: string }[] = [
  { label: 'Brand New (In Box)', desc: 'Unopened or sealed' },
  { label: 'Like New (Flawless)', desc: 'No visible marks or flaws' },
  { label: 'Gently Used', desc: 'Minor, normal cosmetic wear' },
  { label: 'Functional / Needs TLC', desc: 'Works well, perfect for upcyclers' }
];

const PROTOCOLS: { label: HandoverType; icon: string }[] = [
  { label: 'Porch Pickup', icon: 'deck' },
  { label: 'Public Meetup', icon: 'groups' },
  { label: 'Curbside Alert', icon: 'signpost' }
];

const CATEGORIES: CategoryType[] = [
  'All Categories',
  'Books & Media',
  'Electronics',
  'Furniture',
  'Clothing & Shoes',
  'Kitchen & Dining',
  'Tools & Hardware'
];

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedConditions,
  toggleCondition,
  selectedProtocols,
  toggleProtocol,
  availability,
  setAvailability,
  onResetFilters,
  radius
}) => {
  return (
    <aside className="w-full space-y-4">
      {/* Category Filter Box */}
      <div className="bg-[#121215] p-4 rounded-2xl border border-[#27272a]/80 shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#27272a]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-lg">category</span>
            <h2 className="text-[17px] font-semibold text-[#fafafa]">Categories</h2>
          </div>
          <span className="text-[11px] font-medium text-[#a1a1aa]">142 items</span>
        </div>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = CATEGORY_COUNTS[cat] || 0;
            return (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#7c3aed]/20 text-[#ede9fe] text-[13px] font-semibold border border-[#a78bfa]/30'
                      : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa] text-[13px] font-normal'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] shadow-[0_0_5px_#a78bfa]"></span>
                    )}
                    {cat}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'text-[#a78bfa] font-bold bg-[#1e1e22] border border-[#a78bfa]/20'
                        : 'text-[#71717a]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Condition Filter Box */}
      <div className="bg-[#121215] p-4 rounded-2xl border border-[#27272a]/80 shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-[#27272a]">
          <span className="material-symbols-outlined text-[#a78bfa] text-lg">verified</span>
          <h2 className="text-[17px] font-semibold text-[#fafafa]">Item Condition</h2>
        </div>
        <div className="space-y-2.5">
          {CONDITIONS.map((cond) => {
            const isChecked = selectedConditions.includes(cond.label);
            return (
              <label
                key={cond.label}
                className="flex items-start gap-2.5 cursor-pointer select-none group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCondition(cond.label)}
                  className="mt-0.5 w-4 h-4 rounded bg-[#1e1e22] border-[#52525b] text-[#7c3aed] accent-[#a78bfa] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span
                    className={`text-[13px] ${
                      isChecked ? 'text-[#a78bfa] font-semibold' : 'text-[#fafafa]'
                    }`}
                  >
                    {cond.label}
                  </span>
                  <span className="text-[11px] text-[#a1a1aa] leading-tight">{cond.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Handover Protocol Box */}
      <div className="bg-[#121215] p-4 rounded-2xl border border-[#27272a]/80 shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-[#27272a]">
          <span className="material-symbols-outlined text-[#a78bfa] text-lg">front_hand</span>
          <h2 className="text-[17px] font-semibold text-[#fafafa]">Handover Protocol</h2>
        </div>
        <div className="space-y-1.5">
          {PROTOCOLS.map((proto) => {
            const isChecked = selectedProtocols.includes(proto.label);
            return (
              <label
                key={proto.label}
                className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-colors ${
                  isChecked ? 'bg-[#18181b]' : 'hover:bg-[#18181b]/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleProtocol(proto.label)}
                    className="w-4 h-4 rounded bg-[#1e1e22] border-[#52525b] text-[#7c3aed] accent-[#a78bfa] cursor-pointer"
                  />
                  <span className={`text-[13px] ${isChecked ? 'text-[#fafafa] font-semibold' : 'text-[#fafafa]'}`}>
                    {proto.label}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#a1a1aa] text-base">{proto.icon}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="bg-[#121215] p-4 rounded-2xl border border-[#27272a]/80 shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-[#27272a]">
          <span className="material-symbols-outlined text-[#a78bfa] text-lg">schedule</span>
          <h2 className="text-[17px] font-semibold text-[#fafafa]">Availability</h2>
        </div>
        <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-[#27272a]/60">
          <button
            type="button"
            onClick={() => setAvailability('available')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer text-center ${
              availability === 'available'
                ? 'bg-[#1e1e22] text-[#a78bfa] shadow-sm border border-[#a78bfa]/20'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Available Now
          </button>
          <button
            type="button"
            onClick={() => setAvailability('pending')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer text-center ${
              availability === 'pending'
                ? 'bg-[#1e1e22] text-[#a78bfa] shadow-sm border border-[#a78bfa]/20'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Pending Claims
          </button>
        </div>

        {/* Reset Filter Button */}
        <div className="mt-4 pt-1">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] border border-[#27272a] transition-colors text-[13px] font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            Reset all filters
          </button>
        </div>
      </div>

      {/* Eco Impact Micro-Card */}
      <div className="bg-gradient-to-br from-[#18181b] to-[#121215] text-[#fafafa] p-4 rounded-2xl border border-[#27272a] shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#a78bfa]/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[#a78bfa] text-lg">nature</span>
          <span className="text-[12px] uppercase tracking-wider text-[#a78bfa] font-semibold">
            Local Loop Stats
          </span>
        </div>
        <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
          Items in your {radius}-mile radius have eliminated approx.{' '}
          <strong className="text-[#fafafa] font-semibold">1,420 lbs of CO2e</strong> this month through zero-transit rehoming.
        </p>
      </div>
    </aside>
  );
};
