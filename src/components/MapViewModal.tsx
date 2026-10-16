import React, { useState } from 'react';
import { ItemListing } from '../types';

interface MapViewModalProps {
  items: ItemListing[];
  radius: number;
  onClose: () => void;
  onSelectItem: (item: ItemListing) => void;
}

export const MapViewModal: React.FC<MapViewModalProps> = ({
  items,
  radius,
  onClose,
  onSelectItem
}) => {
  const [selectedPin, setSelectedPin] = useState<ItemListing | null>(items[0] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#121215] border border-[#27272a] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#18181b]/70">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a78bfa] text-xl">map</span>
            <div>
              <h3 className="text-[17px] font-semibold text-[#fafafa]">
                Seattle Circular Pin Map
              </h3>
              <p className="text-[11px] text-[#a1a1aa]">
                {items.length} circular items ready for pickup within {radius} miles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Map Canvas */}
        <div className="relative flex-1 bg-[#0c0c0f] overflow-hidden flex items-center justify-center">
          {/* Subtle stylized vector map grid & water bodies for Seattle */}
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Elliott Bay / Puget Sound Stylized Shape */}
            <path
              d="M 0,0 L 250,0 C 240,150 200,280 220,380 C 240,480 320,520 280,700 L 0,700 Z"
              fill="#18181b"
              opacity="0.8"
            />
            {/* Lake Washington shape */}
            <path
              d="M 850,50 C 780,200 810,400 790,650 L 900,650 L 900,50 Z"
              fill="#18181b"
              opacity="0.6"
            />
            {/* Lake Union center */}
            <ellipse cx="480" cy="280" rx="90" ry="45" fill="#18181b" opacity="0.9" />
          </svg>

          {/* Neighborhood Labels */}
          <div className="absolute top-[20%] left-[24%] text-[11px] font-semibold text-[#52525b] uppercase tracking-wider select-none pointer-events-none">
            Ballard
          </div>
          <div className="absolute top-[28%] left-[36%] text-[11px] font-semibold text-[#52525b] uppercase tracking-wider select-none pointer-events-none">
            Fremont
          </div>
          <div className="absolute top-[24%] left-[50%] text-[11px] font-semibold text-[#52525b] uppercase tracking-wider select-none pointer-events-none">
            Wallingford
          </div>
          <div className="absolute top-[38%] left-[40%] text-[11px] font-semibold text-[#52525b] uppercase tracking-wider select-none pointer-events-none">
            Queen Anne
          </div>
          <div className="absolute top-[46%] left-[54%] text-[11px] font-semibold text-[#52525b] uppercase tracking-wider select-none pointer-events-none">
            Capitol Hill
          </div>
          <div className="absolute top-[54%] left-[46%] text-[11px] font-semibold text-[#52525b] uppercase tracking-wider select-none pointer-events-none">
            Downtown
          </div>
          <div className="absolute top-[68%] left-[58%] text-[11px] font-semibold text-[#52525b] uppercase tracking-wider select-none pointer-events-none">
            Beacon Hill
          </div>

          {/* Radius circle around Seattle Central */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/5 pointer-events-none"
            style={{ width: `${Math.min(radius * 36, 680)}px`, height: `${Math.min(radius * 36, 680)}px` }}
          ></div>

          {/* Interactive Pins */}
          {items.map((item, index) => {
            const coords = item.mapCoords || { x: 30 + (index * 8) % 50, y: 25 + (index * 11) % 55 };
            const isSelected = selectedPin?.id === item.id;
            return (
              <div
                key={item.id}
                style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                onClick={() => setSelectedPin(item)}
              >
                <div
                  className={`relative flex items-center justify-center p-2 rounded-full shadow-lg transition-transform ${
                    isSelected
                      ? 'bg-[#a78bfa] text-[#09090b] scale-125 ring-4 ring-[#a78bfa]/30'
                      : 'bg-[#18181b] border border-[#a78bfa]/60 text-[#a78bfa] hover:scale-110'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm font-bold">location_on</span>
                  {/* Ripple pulse on selected */}
                  {isSelected && (
                    <span className="absolute inset-0 rounded-full bg-[#a78bfa] animate-ping opacity-40"></span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Selected Pin Mini-Popup Card */}
          {selectedPin && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-[#121215]/95 backdrop-blur-xl border border-[#27272a] rounded-2xl p-4 shadow-2xl z-30 animate-fade-in text-left">
              <div className="flex gap-3">
                <img
                  src={selectedPin.image}
                  alt={selectedPin.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-[#a78bfa] font-semibold mb-0.5">
                    <span>{selectedPin.neighborhood}</span>
                    <span>{selectedPin.distance} mi</span>
                  </div>
                  <h4 className="text-[13px] font-semibold text-[#fafafa] truncate">
                    {selectedPin.title}
                  </h4>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5 line-clamp-1">
                    {selectedPin.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#27272a] flex items-center justify-between">
                <span className="text-[11px] text-[#34d399] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                  {selectedPin.handoverProtocol}
                </span>
                <button
                  onClick={() => {
                    onSelectItem(selectedPin);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
