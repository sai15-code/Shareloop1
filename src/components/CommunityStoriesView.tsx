import React from 'react';

interface CommunityStoriesViewProps {
  onBackToExplore: () => void;
  onPostItemClick: () => void;
}

const STORIES = [
  {
    id: 'story-1',
    author: 'David & Sarah',
    neighborhood: 'Fremont',
    tag: 'Furniture Rehoming',
    title: 'From an empty studio to a furnished home without spending a dollar',
    content: 'When I relocated to Seattle for work, buying new flat-pack furniture felt wasteful and expensive. Through ShareLoop Fremont, I furnished my entire living area with handcrafted birch tables, mid-century lamps, and an ergonomic chair. Now I am circulating books and kitchen goods back!',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    itemsSaved: 8,
    co2eSaved: '185 lbs'
  },
  {
    id: 'story-2',
    author: 'Clara & The Community Tool Library',
    neighborhood: 'Ballard',
    tag: 'Tools & Makers',
    title: 'How our cul-de-sac shares circular drills and woodworking gear',
    content: 'Instead of 12 households each owning a cordless drill that sits in a closet 360 days a year, we keep a community tool rotation on ShareLoop. When someone is refinishing cedar planters or hanging shelves, porch pickup takes under 3 minutes.',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    itemsSaved: 23,
    co2eSaved: '410 lbs'
  },
  {
    id: 'story-3',
    author: 'Marcus Lin',
    neighborhood: 'Capitol Hill',
    tag: 'Tech Equipment',
    title: 'Passing forward calibrated 4K monitors to local students',
    content: 'Upgrading my remote workstation usually meant old displays gathering dust in a closet or ending up as hazardous electronic waste. Giving my UltraSharp monitor to an art student two streets away brought real joy.',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
    itemsSaved: 9,
    co2eSaved: '160 lbs'
  }
];

export const CommunityStoriesView: React.FC<CommunityStoriesViewProps> = ({ onBackToExplore, onPostItemClick }) => {
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
          <span>Share a Story / Item</span>
        </button>
      </div>

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#a78bfa]/10 border border-[#a78bfa]/30 rounded-full text-[#a78bfa] text-[12px] font-semibold mb-3">
          <span className="material-symbols-outlined text-sm">favorite</span>
          <span>Neighborhood Stories</span>
        </div>
        <h1 className="text-[32px] md:text-[38px] font-bold text-[#fafafa] tracking-tight">
          Circularity in Action Across Seattle
        </h1>
        <p className="text-[15px] text-[#a1a1aa] max-w-2xl mt-2 leading-relaxed">
          Every item rehomed on ShareLoop has a human story: reduced landfill waste, stronger local bonds, and neighborly generosity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORIES.map((story) => (
          <article
            key={story.id}
            className="bg-[#121215] rounded-2xl border border-[#27272a] overflow-hidden hover:border-[#a78bfa]/50 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#09090b]">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#09090b]/80 backdrop-blur-md text-[#a78bfa] border border-[#27272a] text-[11px] font-semibold rounded-full">
                  {story.neighborhood} • {story.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-[16px] font-semibold text-[#fafafa] mb-2 leading-snug">
                  {story.title}
                </h3>
                <p className="text-[13px] text-[#a1a1aa] leading-relaxed mb-4">
                  "{story.content}"
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-[#27272a]/70 mt-auto flex items-center justify-between text-[11px] text-[#a1a1aa]">
              <span className="text-[#fafafa] font-semibold">{story.author}</span>
              <span className="text-[#34d399] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">compost</span>
                {story.co2eSaved} saved
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
