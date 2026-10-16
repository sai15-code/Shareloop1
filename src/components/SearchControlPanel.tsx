import React from 'react';
import { NEIGHBORHOOD_OPTIONS } from '../data/mockData';
import { CustomSelect, Option } from './CustomSelect';

interface SearchControlPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  neighborhood: string;
  setNeighborhood: (hood: string) => void;
  radius: number;
  setRadius: (radius: number) => void;
  sortBy: 'recent' | 'nearest' | 'condition' | 'reputable';
  setSortBy: (sort: 'recent' | 'nearest' | 'condition' | 'reputable') => void;
}

const SORT_OPTIONS: Option<'recent' | 'nearest' | 'condition' | 'reputable'>[] = [
  { id: 'recent', label: 'Recently Posted' },
  { id: 'nearest', label: 'Distance: Nearest' },
  { id: 'condition', label: 'Condition: Best first' },
  { id: 'reputable', label: 'Top Givers First' }
];

export const SearchControlPanel: React.FC<SearchControlPanelProps> = ({
  searchQuery,
  setSearchQuery,
  neighborhood,
  setNeighborhood,
  radius,
  setRadius,
  sortBy,
  setSortBy
}) => {
  return (
    <section className="w-full bg-[#121215] p-4 md:p-6 rounded-2xl border border-[#27272a]/80 shadow-[0_4px_24px_rgba(0,0,0,0.4)] mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Keyword Search */}
        <div className="lg:col-span-5 relative">
          <label className="sr-only" htmlFor="item-search">
            Search local items
          </label>
          <div className="flex items-center bg-[#18181b] rounded-xl px-4 py-2 border border-[#27272a]/80 focus-within:border-[#a78bfa] focus-within:ring-1 focus-within:ring-[#a78bfa]/40 transition-all">
            <span className="material-symbols-outlined text-[#a78bfa] mr-2 text-xl select-none">search</span>
            <input
              className="w-full bg-transparent border-none outline-none text-[14px] text-[#fafafa] placeholder:text-[#a1a1aa]/50"
              id="item-search"
              placeholder="Search chairs, monitors, winter jackets, kitchenware..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                className="text-[#a1a1aa] hover:text-[#fafafa] p-1 rounded-full transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Custom Locality Dropdown */}
        <div className="lg:col-span-3">
          <CustomSelect
            value={neighborhood}
            onChange={(val) => setNeighborhood(val)}
            options={NEIGHBORHOOD_OPTIONS}
            icon="location_on"
            ariaLabel="Select Neighborhood"
          />
        </div>

        {/* Radius Slider */}
        <div className="lg:col-span-2 flex flex-col justify-center px-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-semibold text-[#a1a1aa]">Radius</span>
            <span className="text-[11px] text-[#a78bfa] font-semibold" id="radius-val">
              {radius} miles
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              aria-label="Filter radius in miles"
              className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#a78bfa]"
              id="radius-slider"
              max={25}
              min={1}
              type="range"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Custom Sort Select */}
        <div className="lg:col-span-2">
          <CustomSelect
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            options={SORT_OPTIONS}
            icon="swap_vert"
            ariaLabel="Sort listings"
          />
        </div>
      </div>
    </section>
  );
};
