import { useLanguage } from '../context/useLanguage'
import { useRouter } from '../context/useRouter'
import { urlForImage } from '../sanity/client'
import { ArrowRight } from 'lucide-react'
import './ArtGallery.css'

import { HOME_GALLERY_LIMIT } from '../config/constants'
export { HOME_GALLERY_LIMIT }

export default function ArtGallery({ artworks = [], onOpenLightbox }) {
  const { getLocalized, t, lang } = useLanguage()
  const { navigate } = useRouter()

  const hasArtworks = artworks && artworks.length > 0
  const displayedArtworks = hasArtworks ? artworks.slice(0, HOME_GALLERY_LIMIT) : []
  const hasMore = artworks && artworks.length > HOME_GALLERY_LIMIT

  const handleArtClick = (art, globalIdx) => {
    if (onOpenLightbox) {
      onOpenLightbox(art, globalIdx)
    }
  }

  return (
    <section id="art-gallery" className="section-art-gallery" aria-labelledby="gallery-heading">
      <div className="container">
        {/* Section Heading */}
        <div className="art-gallery-header-row">
          <h2 id="gallery-heading" className="art-gallery-title">
            {t('gallery.title')}
          </h2>
        </div>

        {/* Flexible Masonry Grid adapting naturally to artwork counts and aspect ratios */}
        {hasArtworks ? (
          <div className="art-gallery-flexible">
            {displayedArtworks.map((art, idx) => {
              const title = getLocalized(art, 'title') || `Artwork ${idx + 1}`
              const artist = art.artist || 'Pentagon Art Studio'
              const imageSrc = art.image ? urlForImage(art.image) || art.image : null

              return (
                <div
                  key={art._id || idx}
                  className="art-card-flexible"
                  onClick={() => handleArtClick(art, idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${title} - ${artist}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleArtClick(art, idx)
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
          /* Neutral layout placeholders preserving screenshot hierarchy when CMS collection is empty */
          <div className="art-gallery-flexible">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="art-card-flexible placeholder-card" aria-hidden="true">
                <div className="art-flexible-image-wrap">
                  <div className="art-flexible-placeholder" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More Button (Visible only when artworks exceed the homepage limit) */}
        {hasMore && (
          <div className="gallery-show-more-wrap">
            <button
              type="button"
              className="gallery-show-more-btn"
              onClick={() => navigate('/gallery')}
            >
              <span>{lang === 'id' ? 'Lihat Semua Karya' : 'Show More Artworks'}</span>
              <span className="gallery-count-pill">{artworks.length}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
