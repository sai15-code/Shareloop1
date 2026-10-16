import React, { useState } from 'react';
import { USER_PROFILE, NOTIFICATIONS_SAMPLE, MESSAGES_SAMPLE } from '../data/mockData';

interface HeaderProps {
  currentTab: 'explore' | 'my-claims' | 'how-it-works' | 'community-stories';
  setCurrentTab: (tab: 'explore' | 'my-claims' | 'how-it-works' | 'community-stories') => void;
  onPostItemClick: () => void;
  onChangeLocationClick: () => void;
  currentNeighborhood: string;
  radius: number;
  claimsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onPostItemClick,
  onChangeLocationClick,
  currentNeighborhood,
  radius,
  claimsCount = 0
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_SAMPLE);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#09090b]/85 backdrop-blur-xl border-b border-[#27272a]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between gap-6">
        {/* Brand / Logo */}
        <div
          className="flex items-center gap-2 shrink-0 cursor-pointer group"
          onClick={() => setCurrentTab('explore')}
        >
          <div className="w-9 h-9 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#a78bfa] shadow-sm group-hover:border-[#a78bfa]/50 transition-colors">
            <span className="material-symbols-outlined text-2xl">all_inclusive</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] font-semibold text-[#fafafa] tracking-tight leading-none">
              ShareLoop
            </span>
            <span className="text-[11px] font-medium text-[#a1a1aa] mt-0.5">
              Keep Useful Things in Circulation
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6">
          <button
            onClick={() => setCurrentTab('explore')}
            className={`transition-colors text-[14px] font-semibold pb-0.5 cursor-pointer ${
              currentTab === 'explore'
                ? 'text-[#a78bfa] border-b-2 border-[#a78bfa]'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Explore Listings
          </button>

          <button
            onClick={() => setCurrentTab('my-claims')}
            className={`transition-colors text-[14px] font-semibold pb-0.5 cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'my-claims'
                ? 'text-[#a78bfa] border-b-2 border-[#a78bfa]'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <span>My Claims</span>
            {claimsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#7c3aed] text-white text-[10px] font-bold rounded-full">
                {claimsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('how-it-works')}
            className={`transition-colors text-[14px] font-semibold pb-0.5 cursor-pointer ${
              currentTab === 'how-it-works'
                ? 'text-[#a78bfa] border-b-2 border-[#a78bfa]'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            How It Works
          </button>

          <button
            onClick={() => setCurrentTab('community-stories')}
            className={`transition-colors text-[14px] font-semibold pb-0.5 cursor-pointer ${
              currentTab === 'community-stories'
                ? 'text-[#a78bfa] border-b-2 border-[#a78bfa]'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Community Stories
          </button>
        </nav>

        {/* Locality Quick Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#121215] px-4 py-1.5 rounded-full border border-[#27272a]/70">
          <span className="material-symbols-outlined text-[#a78bfa] text-sm">location_on</span>
          <span className="text-[12px] font-semibold text-[#fafafa]">
            {currentNeighborhood === 'all' ? 'All Seattle' : currentNeighborhood} (within {radius} mi)
          </span>
          <button
            onClick={onChangeLocationClick}
            className="text-[12px] text-[#a78bfa] hover:text-[#c4b5fd] transition-colors underline font-medium ml-1 cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onPostItemClick}
            className="inline-flex items-center gap-1.5 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-semibold px-5 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(167,139,250,0.25)] active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg leading-none font-bold">add</span>
            <span>Post an Item</span>
          </button>

          {/* Quick Icons */}
          <div className="flex items-center gap-1 relative">
            {/* Notifications */}
            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-[#a1a1aa] hover:text-[#fafafa] rounded-full hover:bg-[#18181b] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#a78bfa] shadow-[0_0_6px_#a78bfa]"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-[#121215] border border-[#27272a] rounded-2xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-3">
                    <span className="text-[14px] font-semibold text-[#fafafa]">Notifications</span>
                    <button
                      onClick={() =>
                        setNotifications(notifications.map((n) => ({ ...n, unread: false })))
                      }
                      className="text-[11px] text-[#a78bfa] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-left transition-colors ${
                          n.unread
                            ? 'bg-[#18181b] border-[#a78bfa]/30'
                            : 'bg-[#0f0f12] border-[#27272a]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-semibold text-[#fafafa]">{n.title}</span>
                          <span className="text-[10px] text-[#a1a1aa]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="relative">
              <button
                aria-label="Messages"
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowNotifications(false);
                  setShowProfileMenu(false);
                }}
                className="p-2 text-[#a1a1aa] hover:text-[#fafafa] rounded-full hover:bg-[#18181b] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
              </button>

              {showMessages && (
                <div className="absolute right-0 mt-3 w-80 bg-[#121215] border border-[#27272a] rounded-2xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-3">
                    <span className="text-[14px] font-semibold text-[#fafafa]">Direct Messages</span>
                    <span className="text-[11px] text-[#34d399] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span> 2 Active
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {MESSAGES_SAMPLE.map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#a78bfa]/40 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <img
                            src={m.avatar}
                            alt={m.neighborName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-[12px] font-semibold text-[#fafafa] flex-1">
                            {m.neighborName}
                          </span>
                          <span className="text-[10px] text-[#a1a1aa]">{m.time}</span>
                        </div>
                        <div className="text-[11px] text-[#a78bfa] font-medium mb-0.5 truncate">
                          {m.itemTitle}
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] truncate">{m.lastMessage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="relative">
            <div
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowMessages(false);
              }}
              className="flex items-center gap-2 pl-2 border-l border-[#27272a] cursor-pointer group"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#52525b] group-hover:ring-[#a78bfa] transition-all"
                src={USER_PROFILE.avatar}
              />
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="text-[12px] text-[#fafafa] font-semibold leading-tight">
                  {USER_PROFILE.name}
                </span>
                <span className="text-[11px] text-[#a78bfa] leading-none">{USER_PROFILE.role}</span>
              </div>
              <span className="material-symbols-outlined text-[#a1a1aa] text-base group-hover:text-[#fafafa]">
                arrow_drop_down
              </span>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-[#121215] border border-[#27272a] rounded-2xl shadow-2xl p-4 z-50 animate-fade-in text-left">
                <div className="flex items-center gap-3 pb-3 border-b border-[#27272a] mb-3">
                  <img
                    src={USER_PROFILE.avatar}
                    alt={USER_PROFILE.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#a78bfa]"
                  />
                  <div>
                    <h4 className="text-[13px] font-semibold text-[#fafafa]">{USER_PROFILE.name}</h4>
                    <p className="text-[11px] text-[#a78bfa]">{USER_PROFILE.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-[12px]">
                  <button
                    onClick={() => {
                      setCurrentTab('my-claims');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] font-semibold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#a78bfa]">
                        inventory_2
                      </span>
                      <span>My Claims &amp; Passes</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#7c3aed] text-white text-[11px]">
                      {claimsCount}
                    </span>
                  </button>

                  <div className="flex justify-between py-1 text-[#a1a1aa] px-1">
                    <span>Items Rehomed:</span>
                    <span className="text-[#fafafa] font-semibold">{USER_PROFILE.rehomedItems}</span>
                  </div>
                  <div className="flex justify-between py-1 text-[#a1a1aa] px-1">
                    <span>CO2e Prevented:</span>
                    <span className="text-[#34d399] font-semibold">{USER_PROFILE.savedCO2Lbs} lbs</span>
                  </div>
                  <div className="flex justify-between py-1 text-[#a1a1aa] px-1 border-b border-[#27272a] pb-2">
                    <span>Trust Score:</span>
                    <span className="text-[#a78bfa] font-semibold">{USER_PROFILE.trustRating}</span>
                  </div>
                  <button
                    onClick={() => {
                      onPostItemClick();
                      setShowProfileMenu(false);
                    }}
                    className="w-full mt-2 py-2 bg-[#7c3aed] hover:bg-[#8b5cf6] text-white rounded-xl font-semibold text-center transition-colors cursor-pointer"
                  >
                    Post an Item
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            aria-label="Toggle mobile navigation menu"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="xl:hidden p-2 text-[#a1a1aa] hover:text-[#fafafa] rounded-xl hover:bg-[#18181b] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">
              {showMobileMenu ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="xl:hidden bg-[#0c0c0f] border-b border-[#27272a] px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                setCurrentTab('explore');
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                currentTab === 'explore'
                  ? 'bg-[#18181b] text-[#a78bfa] border border-[#a78bfa]/30'
                  : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">explore</span>
                <span>Explore Listings</span>
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('my-claims');
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                currentTab === 'my-claims'
                  ? 'bg-[#18181b] text-[#a78bfa] border border-[#a78bfa]/30'
                  : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">inventory_2</span>
                <span>My Claims &amp; Passes</span>
              </span>
              {claimsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#7c3aed] text-white text-[11px] font-bold">
                  {claimsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentTab('how-it-works');
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                currentTab === 'how-it-works'
                  ? 'bg-[#18181b] text-[#a78bfa] border border-[#a78bfa]/30'
                  : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
              }`}
            >
              <span className="material-symbols-outlined text-base">help</span>
              <span>How It Works</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('community-stories');
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                currentTab === 'community-stories'
                  ? 'bg-[#18181b] text-[#a78bfa] border border-[#a78bfa]/30'
                  : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
              }`}
            >
              <span className="material-symbols-outlined text-base">forum</span>
              <span>Community Stories</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px] text-[#fafafa]">
              <span className="material-symbols-outlined text-[#a78bfa] text-sm">location_on</span>
              <span>{currentNeighborhood} ({radius} mi)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onChangeLocationClick();
                setShowMobileMenu(false);
              }}
              className="text-[12px] text-[#a78bfa] underline font-medium cursor-pointer"
            >
              Change Location
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
