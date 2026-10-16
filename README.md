# ShareLoop — Local Reuse Matching Platform

**ShareLoop** is a developer-grade, high-contrast dark web application designed to foster resilient neighborhood circularity by keeping useful goods in local circulation and out of incinerators and landfills.

---

## Key Features & Architecture

### 1. Interconnected Pages & Views
The application contains four fully interconnected, accessible views:

1. **Explore Listings (`explore`)**:
   - Hyperlocal catalog of verified circular items (furniture, electronics, apparel, kitchenware, tools, books).
   - Real-time radius slider (1–25 miles) around Seattle neighborhoods (Capitol Hill, Fremont, Ballard, Beacon Hill, Queen Anne, Downtown, Wallingford).
   - Custom Obsidian dark dropdowns (`CustomSelect`) with click-outside listeners and keyboard navigation.
   - Interactive **Seattle Circular Pin Map (`MapViewModal`)** with SVG district boundaries, pulsing pins, and instant preview cards.
   - **Active Filter Badges** with one-click **"Clear All"** restoration of the catalog.
   - **"Can't find what you're looking for?" Banner**: Supports setting neighborhood search alerts and broadcasting community "Looking For" requests.

2. **My Claims & Passes (`my-claims`)**:
   - Dedicated management view for claimed circular goods.
   - Displays unique **PIN-PASS** verification codes and scheduled contactless porch pickup windows.
   - Safe porch coordinates and gate access codes.
   - **"Confirm Received Physically"**: Marks the handover complete, logs **+35 lbs of CO2e prevented**, awards the verified rehoming badge, and updates local loop statistics.
   - Option to release the claim back to neighborhood circulation if pickup plans change.

3. **How It Works (`how-it-works`)**:
   - Visual breakdown of the 4 circular pillars:
     1. *Snap & Post in Seconds*
     2. *Hyperlocal 5-Mile Matching*
     3. *Safe Porch Pickup Coordination*
     4. *Track Neighborhood Circularity Score*
   - Clear guidelines on zero-commerce, verified neighbor identity, and contactless porch protocols.

4. **Community Stories (`community-stories`)**:
   - Real neighborhood case studies (studio furniture rehoming in Fremont, tool-sharing in Ballard, monitor recycling in Capitol Hill).
   - Eco-impact breakdown and neighbor leaderboards.

---

### 2. Interactive Modals & Handover Protocols
- **Post an Item Modal (`PostItemModal`)**:
  - Direct image file upload from computer/device (with drag-and-drop zone and instant preview).
  - High-resolution category presets and URL input fallbacks.
  - Category, condition, and protocol selectors using custom dropdowns.
  - Adding an item immediately prepends it to the live feed and updates stats.
- **Item Details Modal (`ItemDetailsModal`)**:
  - Full photo inspection, dimensions, estimated weight, safe pickup protocol guide, and direct message sender.
- **Claim Modal (`ClaimModal`)**:
  - Pickup window selector, personal note to donor, neighbor circularity pledge, and instant PIN-PASS generation with direct buttons to *View in My Claims* or *Back to Explore*.

---

### 3. Design System & Obsidian High-Contrast Dark Theme
- **Background**: Near-black true dark (`#09090b`).
- **Surfaces**: Zinc-based increments (`#121215`, `#18181b`, `#1e1e22`, `#27272a`).
- **Primary Accent**: Soft violet (`#a78bfa`) for interactive elements, links, and focus rings.
- **Success / Positive**: Emerald (`#34d399`) for successful handovers and eco-milestones.
- **Typography**: Clean Geist / Inter sans-serif stack with tight letter-spacing on headings.
- **Responsive Navigation**: Full desktop action bar, collapsible mobile navigation drawer, and mobile filter toggle.

---

## Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (version 9 or higher)

### Step-by-Step Instructions

1. **Clone or Download the Repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. **Typecheck & Lint**:
   ```bash
   npm run lint
   ```

6. **Build for Production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be created in the `dist` directory.

---

## Project Structure

```
├── index.html                     # HTML5 entrypoint with Google Fonts & Material Symbols
├── metadata.json                  # Application metadata and capabilities
├── package.json                   # Project scripts and dependencies
├── tsconfig.json                  # TypeScript compiler configuration
├── vite.config.ts                 # Vite bundler configuration with Tailwind 4
├── src/
│   ├── main.tsx                   # React root entry point
│   ├── App.tsx                    # Top-level state management, routing, & modals
│   ├── index.css                  # Global Tailwind CSS and Obsidian theme tokens
│   ├── types.ts                   # TypeScript interfaces (ItemListing, Claim, Filters, Donor)
│   ├── components/
│   │   ├── Header.tsx             # Responsive header, brand logo, mobile nav, notifications
│   │   ├── SearchControlPanel.tsx # Search input, locality, radius slider, sort selector
│   │   ├── SidebarFilters.tsx     # Categories, condition, protocol, availability filters
│   │   ├── ItemCard.tsx           # Product card with badges, hover states, claim trigger
│   │   ├── ItemDetailsModal.tsx   # Detailed item specifications and question form
│   │   ├── ClaimModal.tsx         # Reservation flow, window picker, PIN generation
│   │   ├── MyClaimsView.tsx       # Claimed items, pickup passes, & physical confirm action
│   │   ├── PostItemModal.tsx      # Rehoming listing form with file upload & drag-and-drop
│   │   ├── MapViewModal.tsx       # Interactive vector map with pulsing Seattle pins
│   │   ├── HowItWorksView.tsx     # The 4 circular pillars of ShareLoop
│   │   ├── CommunityStoriesView.tsx# Neighbor narratives and diversion statistics
│   │   ├── AlertAndRequestModals.tsx# Search alert and "Looking For" broadcast forms
│   │   ├── CustomSelect.tsx       # Accessible Obsidian dark custom dropdown component
│   │   └── Footer.tsx             # Impact metrics, hub links, & Local Loop Digest signup
│   └── data/
│       └── mockData.ts            # High-resolution verified product items, donors, & messages
└── README.md                      # Documentation and local setup instructions
```

---

## License
Apache-2.0
