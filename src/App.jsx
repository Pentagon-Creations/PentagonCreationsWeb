import { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { RouterProvider } from './context/RouterContext'
import { useRouter } from './context/useRouter'
import { usePentagonData } from './hooks/usePentagonData'
import Navbar from './components/Navbar'
import HeaderWhatsOn from './components/HeaderWhatsOn'
import OurCreations from './components/OurCreations'
import FeaturedGames from './components/FeaturedGames'
import StoryBooks from './components/StoryBooks'
import ArtGallery from './components/ArtGallery'
import MusicSection from './components/MusicSection'
import AboutUs from './components/AboutUs'
import Footer from './components/Footer'
import Lightbox from './components/Lightbox'
import DetailModal from './components/DetailModal'
import FallbackNotice from './components/FallbackNotice'
import DedicatedGalleryPage from './components/DedicatedGalleryPage'
import BookReadingPage from './components/BookReadingPage'
import { AlertCircle, RefreshCw } from 'lucide-react'
import './styles/global.css'

function PentagonApp() {
  const {
    loading,
    error,
    isUsingFallback,
    newsBox,
    releasedContent,
    newsInformation,
    creationCategories,
    featuredGames,
    storyBooks,
    artworks,
    music,
    siteSettings,
    refetch,
  } = usePentagonData()

  const { route } = useRouter()

  // Lightbox state for Art Gallery on homepage
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Detail Modal state for Games / Stories / Content
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalType, setModalType] = useState('item')

  const openLightbox = (art, index) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextLightbox = () => {
    if (lightboxIndex !== null && lightboxIndex < artworks.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  const prevLightbox = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  const openDetail = (item, type = 'item') => {
    setSelectedItem(item)
    setModalType(type)
  }

  const closeDetail = () => {
    setSelectedItem(null)
  }

  const currentArtwork =
    lightboxIndex !== null && artworks && artworks[lightboxIndex]
      ? artworks[lightboxIndex]
      : null

  // Available sections are always enabled so section navigation and anchors remain functional
  const availableSections = {
    games: true,
    drawing: true,
    story: true,
    music: true,
  }

  // 1. ROUTE: Dedicated Book-Reading Page
  if (route.name === 'book') {
    return (
      <BookReadingPage
        key={route.slug}
        slug={route.slug}
        allStories={storyBooks}
      />
    )
  }

  // 2. ROUTE: Dedicated Drawing Art Gallery Page
  if (route.name === 'gallery') {
    return <DedicatedGalleryPage artworks={artworks} />
  }

  // 3. ROUTE: Homepage
  return (
    <div id="top" className="site-wrapper">
      {/* Top subtle loading indicator */}
      {loading && <div className="top-loading-bar" aria-hidden="true" />}

      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Development Fallback Alert */}
      {isUsingFallback && <FallbackNotice />}

      {/* Main Navbar connected to Sanity Site Settings */}
      <Navbar availableSections={availableSections} siteSettings={siteSettings} />

      {/* Main Content Area */}
      <main id="main-content">
        {/* Connection Error Banner if Sanity project is misconfigured or network fails */}
        {error && (
          <div className="container" style={{ paddingTop: '20px' }}>
            <div
              style={{
                backgroundColor: '#7f1d1d',
                color: '#fecaca',
                padding: '16px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
              role="alert"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                <span>
                  <strong>Error loading live content:</strong> {error}
                </span>
              </div>
              <button
                type="button"
                onClick={refetch}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#991b1b',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '2px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* 1. Header: What's on Pentagon Creations */}
        <HeaderWhatsOn
          newsBox={newsBox}
          releasedContent={releasedContent}
          newsInformation={newsInformation}
          onSelectArticle={(article) => openDetail(article, 'news')}
        />

        {/* 2. Our Creations */}
        <OurCreations
          categories={creationCategories}
          onSelectCategory={(cat) => openDetail(cat, 'category')}
        />

        {/* 3. Featured Games */}
        <FeaturedGames
          games={featuredGames}
          onSelectGame={(game) => openDetail(game, 'game')}
        />

        {/* 4. Story Books */}
        <StoryBooks
          stories={storyBooks}
          onSelectStory={(story) => openDetail(story, 'story')}
        />

        {/* 5. Art Gallery / Drawing Art */}
        <ArtGallery
          artworks={artworks}
          onOpenLightbox={openLightbox}
        />

        {/* 6. Music */}
        <MusicSection
          music={music}
          onSelectTrack={(track) => openDetail(track, 'music')}
        />

        {/* 7. About Us */}
        <AboutUs siteSettings={siteSettings} />
      </main>

      {/* Footer */}
      <Footer siteSettings={siteSettings} />

      {/* Accessible Lightbox Modal on Homepage */}
      {currentArtwork && (
        <Lightbox
          artwork={currentArtwork}
          onClose={closeLightbox}
          onNext={nextLightbox}
          onPrev={prevLightbox}
          hasNext={lightboxIndex < artworks.length - 1}
          hasPrev={lightboxIndex > 0}
        />
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          type={modalType}
          onClose={closeDetail}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider>
        <PentagonApp />
      </RouterProvider>
    </LanguageProvider>
  )
}
