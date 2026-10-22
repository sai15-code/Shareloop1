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

## Run the application locally

1. Start MongoDB. Copy `backend/.env.example` to `backend/.env` and set a
   private `JWT_SECRET` (and `MONGODB_URI` if MongoDB is not local).
2. In `backend`, run `npm install` and `npm run dev` (API at port 5000).
3. Copy `.env.example` to `.env`, then run `npm install` and `npm run dev` from
   the repository root (frontend at port 3000). Set `VITE_API_BASE_URL` if the
   backend runs at a different URL.
4. Run frontend checks with `npm run lint` and `npm run build`; run backend
   tests from `backend` with `npm test` and a dedicated test MongoDB database.

## Week 5: Testing, Debugging, and Optimization

### Test strategy

- Frontend unit/component tests use Vitest, jsdom, and React Testing Library.
  They cover authenticated API requests and API/HTTP error messages, plus
  listing card rendering and its Details and Claim actions.
- Backend integration tests use Node's built-in test runner and the real
  Express app with Mongoose. They cover registration/login and password
  hashing, invalid credentials, JWT-protected routes, listing validation,
  create/read/search/category/pagination, ownership rules, claims and pass
  codes, and persisted community alerts/requests.
- Backend tests connect only to a MongoDB database whose name includes `test`.
  By default each run gets a unique `shareloop_test_<id>` database. They remove
  only records created by that run and never drop a database or touch the
  application's `shareloop` database. If using `TEST_MONGODB_URI`, point it at
  a dedicated test database; the suite rejects names without `test`.

### Commands

Run from the repository root:

```bash
npm ci
npm --prefix backend ci
npm run test                 # frontend tests
npm run test:backend         # backend integration tests
npm run test:all             # both suites
npm run lint                 # TypeScript check
npm run build                # Vite production build
```

MongoDB must be running locally for the backend tests, or set
`TEST_MONGODB_URI` to an isolated test database before running `test:backend`.
The suite fails quickly if the MongoDB server is unavailable.

### Current verification and optimization notes

The current frontend suite has **5 tests** across 2 test files. The backend
integration suite has **14 tests**. On 2026-10-22, both suites passed (19/19),
the TypeScript check passed, and the production build passed. The build emitted
33 modules; its main JavaScript asset measured 345.16 kB (93.65 kB gzip) and
the CSS asset measured 45.69 kB (8.29 kB gzip). The current 12-item listing
dataset is not large enough to support a claim that a new optimization is
needed, and no performance code change was made without evidence of a
bottleneck. Existing filtering is memoized in `src/App.tsx` and listing images
use browser lazy loading.

Vitest prints frontend test failures in the terminal. Node's test runner prints
backend failure names, assertions, and stack traces. Do not commit logs
containing credentials, tokens, or personal data.

## Deployment: Vercel, Render, and MongoDB Atlas

This repository is a monorepo with the Vite frontend at the repository root and
the Express API in `backend/`. Deploy them as separate services. Both package
manifests select Node.js 24.x (the local verified runtime is Node 24.15.0).

### Vercel frontend

Create a Vercel project from this repository with the repository root as its
Root Directory and the Vite framework preset. Use `npm ci` to install and
`npm run build` to build; use `dist` as the output directory. Set this build-time
environment variable in Vercel for Production (and Preview if needed):

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

Vite embeds this public API URL into the frontend bundle. Do not put MongoDB
credentials or `JWT_SECRET` in Vercel. Changing this value requires a new
frontend build/deployment.

### Render API

Create a Render Node web service from the same repository and set its Root
Directory to `backend`. Use `npm ci` for the Build Command and `npm start` for
the Start Command. Set the health check path to `/api/health`. Render provides
`PORT`; the server listens on that value. Configure these service environment
variables in Render:

```text
NODE_ENV=production
MONGODB_URI=<Atlas URI with the shareloop database path>
JWT_SECRET=<at least 32 random bytes; store only in Render's environment>
CLIENT_URL=https://<your-vercel-domain>
```

`CLIENT_URL` accepts exact HTTPS origins separated by commas if you also need
to allow a custom domain or a specific Preview origin. The production server
fails startup if `JWT_SECRET` is weak/missing or `CLIENT_URL` is missing or not
an HTTPS origin. Do not set `PORT` manually unless your hosting provider
requires it.

### Atlas and moving the local database safely

Create an Atlas cluster, a database user with access only to the `shareloop`
database, and an IP access rule that allows the Render service's outbound
addresses. In Atlas, use **Connect > Drivers** to obtain the connection URI;
use the `shareloop` database path and keep the password in Render's secret
environment variable. URL-encode special characters in the database password.

For a small planned cutover, keep the existing local database intact and make a
private BSON backup while writes are paused. From PowerShell, for example:

```powershell
mongodump --uri="mongodb://127.0.0.1:27017/shareloop" --out=".\shareloop-backup"
```

Restore into a newly created, empty Atlas `shareloop` database. Omit the
password option so MongoDB Database Tools can prompt for it; do not place the
Atlas password in a command, script, or committed file:

```powershell
mongorestore --uri="mongodb+srv://<atlas-host>/shareloop" --username="<atlas-database-user>" --authenticationDatabase=admin --nsInclude="shareloop.*" ".\shareloop-backup\shareloop"
```

Do not use `--drop`. Verify user, listing, and claim counts in Atlas against
the source before cutover, and test login/listings against the Atlas-backed API.
Keep the local database and private backup unchanged until the deployed API has
been validated. If Atlas already contains records, stop and plan a merge after
backup rather than blindly restoring over it. Existing user password hashes
and MongoDB IDs are part of the data copy; using a new production JWT secret
will require existing sessions to sign in again, but does not change passwords.

### Cutover order

1. Finish and verify the Atlas restore; update Render `MONGODB_URI` and deploy
   the API.
2. Confirm `https://<your-render-service>.onrender.com/api/health` reports a
   healthy API and connected database, then check `/api/listings?limit=100`.
3. Copy the final Vercel origin to Render `CLIENT_URL` and redeploy the API if
   it changed.
4. Set Vercel `VITE_API_BASE_URL` to the Render API base URL and deploy the
   frontend. Verify registration/login and listing requests in the browser.

The local `.env` files are ignored by Git. Commit only the `.env.example`
templates, which contain placeholders and development defaults, never real
credentials or database dumps.
