# Pentagon Creations — Complete React + Sanity Website

A responsive, bilingual portfolio and showcase website for **Pentagon Creations**, an independent creative studio focused on **Game Development**, **Story Writing**, **Drawing Art**, and **Music**.

The architecture combines a fast, modular React (Vite) frontend with Sanity.io as the headless CMS, styled with minimalist editorial typography, dynamic carousels, a flexible art gallery, and a dedicated book-reading experience.

---

## 1. Project Architecture

```
pentagon-web/
├── index.html                   # HTML entry point with metadata
├── package.json                 # Frontend dependencies and scripts
├── vite.config.js               # Vite configuration
├── eslint.config.js             # Modern ESLint configuration
├── .env.example                 # Example Sanity environment variables
├── public/
│   ├── favicon.svg              # Pentagon circular logo icon
│   └── assets/
│       └── book-loading.svg     # Placeholder for reader loading screen (replace with your GIF)
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main application structure, routing & modal state
│   ├── config/
│   │   └── constants.js         # Configurable constants (gallery limit, loading GIF path & duration)
│   ├── context/
│   │   ├── languageContextInstance.js # Language Context singleton
│   │   ├── LanguageContext.jsx        # Bilingual localization provider (ID/EN)
│   │   ├── useLanguage.js             # Reusable translation hook
│   │   ├── routerContextInstance.js   # Router Context singleton
│   │   ├── RouterContext.jsx          # Dual hash/path router compatible with GitHub Pages
│   │   └── useRouter.js               # Client-side navigation hook
│   ├── sanity/
│   │   ├── client.js            # Sanity client & image URL builder
│   │   └── queries.js           # Centralized dynamic GROQ queries
│   ├── data/
│   │   └── fallbackData.js      # Development-only sample dataset with full story chapters
│   ├── hooks/
│   │   └── usePentagonData.js   # Unified content fetching hook
│   ├── components/
│   │   ├── Navbar.jsx           # Brand, ID/EN toggle, accessible drawer menu
│   │   ├── HeaderWhatsOn.jsx    # 3-column "What's on" with scroll-aware active category chips
│   │   ├── OurCreations.jsx     # Four creation pillars with info panels
│   │   ├── FeaturedGames.jsx    # Dynamic horizontal carousel of game cards
│   │   ├── StoryBooks.jsx       # Dynamic horizontal carousel of story book cards
│   │   ├── CarouselTrack.jsx    # Reusable, accessible horizontal carousel with scroll controls
│   │   ├── ArtGallery.jsx       # Flexible masonry layout with configurable homepage limit
│   │   ├── DedicatedGalleryPage.jsx # Dedicated page displaying all artworks
│   │   ├── BookReadingPage.jsx  # Dedicated book reader with paper-yellow design & custom loading screen
│   │   ├── PortableTextRenderer.jsx # Portable Text & rich story text renderer
│   │   ├── MusicSection.jsx     # Dynamic horizontal carousel of album cards
│   │   ├── AboutUs.jsx          # Studio narrative with negative space
│   │   ├── Footer.jsx           # Media, Contact, Game Releases, dynamic copyright
│   │   ├── Lightbox.jsx         # Accessible art viewer with arrow key navigation
│   │   ├── DetailModal.jsx      # Modal for game / story / article details with reading action
│   │   └── FallbackNotice.jsx   # Non-intrusive development sample warning
│   └── styles/
│       └── global.css           # Global typography, color tokens, and reset
└── studio/                      # Sanity Studio CMS
    ├── sanity.config.js         # Desk structure & plugins configuration
    ├── sanity.cli.js            # Sanity CLI settings
    ├── package.json             # Studio dependencies
    └── schemas/                 # Content schemas
        ├── index.js             # Schema exports
        ├── newsBox.js           # Large hero news feature
        ├── releasedContent.js   # Middle stacked release cards
        ├── newsInformation.js   # Right text news headlines
        ├── creationCategory.js  # Four pillars of creation
        ├── game.js              # Featured games
        ├── storyBook.js         # Story books with localized reading content (`contentId`, `contentEn`)
        ├── artwork.js           # Art gallery items & layout hints
        ├── music.js             # Music tracks and album releases
        └── siteSettings.js      # Global branding, About Us & footer links
```

---

## 2. Dynamic Features & Configuration

### A. Navigation Buttons Under "What's on Pentagon Creations"
- Category navigation buttons (*Games, Drawing Art, Story Book, Music*) automatically highlight based on the section currently in view using an `IntersectionObserver` configured with a `-70px` sticky navbar offset.
- Scrolling away from all category sections clears the highlight so buttons never stay stuck.
- If a section contains no items, its corresponding chip is automatically hidden to prevent dead navigation.

### B. Dynamic Horizontal Carousels
- **Featured Games**, **Story Books**, and **Music** now use a responsive horizontal carousel track.
- Card counts are purely data-driven: if 2 items exist, 2 cards are shown; if many items exist, users can scroll horizontally or use the left/right arrow controls.
- Touch swiping is natively supported with CSS scroll-snapping.
- Navigation buttons and scroll indicators are automatically hidden when all cards fit within the viewport.

### C. Drawing Art Gallery & Dedicated Page
- Does **not** use a horizontal carousel; instead, it renders a flexible, responsive multi-column layout that gracefully adapts to portrait, landscape, and square artworks.
- Homepage display limit is defined in `src/config/constants.js`:
  ```javascript
  export const HOME_GALLERY_LIMIT = 8
  ```
- A **"Show More"** button appears only when the total available artworks exceed this limit.
- Clicking "Show More" navigates to the dedicated gallery page (`#/gallery`) displaying the complete collection.

### D. Dedicated Book-Reading Page & Custom Loading Screen
- Reusable, shared reading page for all books accessible via `#/books/:slug` (compatible with GitHub Pages, Vite, and static hosting).
- Paper-yellow reader design (`#faf4e6`) with comfortable typography, chapter headers, author line, and back-navigation control.
- **Custom Loading Screen with User-Provided GIF**:
  - The loading screen coordinates two conditions:
    1. Minimum animation display duration (default: `1800ms`).
    2. Book data fetch completion.
  - The reading page is revealed only after **both** conditions are satisfied.
  - **To replace the loading GIF with your own:**
    1. Place your GIF in `public/assets/` (e.g., `public/assets/my-logo.gif`).
    2. Open `src/config/constants.js` and update:
       ```javascript
       export const BOOK_LOADING_GIF_PATH = '/assets/my-logo.gif'
       export const MIN_GIF_DURATION_MS = 2000 // duration of your GIF's animation loop
       ```

### E. Conditional Section Rendering
- Sections for **Featured Games**, **Story Books**, **Art Gallery**, and **Music** are completely hidden when their dataset contains no items.
- Empty section headings, blank placeholders, and redundant vertical gaps are suppressed.
- Loading states and fetch errors are handled separately to avoid premature hiding while data is being retrieved.

---

## 3. Quick Start (Frontend)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to create `.env.local`:
```bash
cp .env.example .env.local
```

If you do not have a live Sanity project configured, the website automatically loads the rich local development fallback dataset.

### Step 3: Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Step 4: Run Production Build
```bash
npm run build
npm run preview
```

---

## 4. Connecting Sanity.io CMS

1. Create a project on [Sanity.io](https://www.sanity.io/manage) or run:
   ```bash
   npx sanity@latest init
   ```
2. Update `.env.local`:
   ```ini
   VITE_SANITY_PROJECT_ID=your_actual_project_id
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-03-01
   VITE_SANITY_USE_CDN=true
   ```
3. Add `http://localhost:5173` to **API → CORS Origins** in your Sanity management console.
4. Launch Sanity Studio:
   ```bash
   cd studio
   npm install
   npm run dev
   ```
