import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { useRouter } from '../context/useRouter'
import { urlForImage } from '../sanity/client'
import Lightbox from './Lightbox'
import './DedicatedGalleryPage.css'

export default function DedicatedGalleryPage({ artworks = [] }) {
  const { lang, setLanguage, getLocalized } = useLanguage()
  const { navigate } = useRouter()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = (index) => {
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

  const currentArtwork =
    lightboxIndex !== null && artworks[lightboxIndex] ? artworks[lightboxIndex] : null

  return (
    <div className="dedicated-gallery-page">
      {/* Top Utility Header */}
      <header className="gallery-page-topbar">
        <div className="container gallery-topbar-inner">
          <button
            type="button"
            className="gallery-back-btn"
            onClick={() => navigate('/')}
            aria-label={lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
          >
            <ArrowLeft size={18} />
            <span>{lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}</span>
          </button>

          <div className="gallery-topbar-right">
            {/* Language Capsule: ID | EN */}
            <div className="lang-capsule" role="group" aria-label="Language">
              <button
                type="button"
                className={`lang-btn ${lang === 'id' ? 'is-active' : ''}`}
                onClick={() => setLanguage('id')}
              >
                ID
              </button>
              <span className="lang-divider" aria-hidden="true">
                |
              </span>
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'is-active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Gallery Area */}
      <main className="gallery-page-main">
        <div className="container">
          {/* Page Heading */}
          <div className="gallery-page-header">
            <h1 className="gallery-page-title">
              {lang === 'id' ? 'Galeri Seni Gambar' : 'Drawing Art Gallery'}
            </h1>
            <p className="gallery-page-subtitle">
              {lang === 'id'
                ? 'Arsip lengkap karya seni, ilustrasi konsep, dan studi estetika Pentagon Creations.'
                : 'Complete archive of artwork, concept illustrations, and aesthetic studies from Pentagon Creations.'}
            </p>
            <div className="gallery-page-stats">
              <span className="stats-badge">
                {artworks.length} {lang === 'id' ? 'Karya Seni' : 'Artworks'}
              </span>
            </div>
          </div>

          {/* Full Flexible Multi-Column Layout */}
          {artworks && artworks.length > 0 ? (
            <div className="art-gallery-flexible">
              {artworks.map((art, idx) => {
                const title = getLocalized(art, 'title') || `Artwork ${idx + 1}`
                const artist = art.artist || 'Pentagon Art Studio'
                const imageSrc = art.image ? urlForImage(art.image) || art.image : null

                return (
                  <div
                    key={art._id || idx}
                    className="art-card-flexible"
                    onClick={() => openLightbox(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${title} - ${artist}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openLightbox(idx)
                      }
                    }}
                  >
                    <div className="art-flexible-image-wrap">
                      {imageSrc ? (
                        <img src={imageSrc} alt={title} className="art-flexible-img" loading="lazy" />
                      ) : (
                        <div className="art-flexible-placeholder" />
                      )}
                      <div className="art-hover-overlay">
                        <span className="art-hover-title">{title}</span>
                        {artist && <span className="art-hover-artist">{artist}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="gallery-empty-state" style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>
              <p>{lang === 'id' ? 'Belum ada karya seni yang dipublikasikan.' : 'No artworks published yet.'}</p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox for Full View */}
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
    </div>
  )
}

