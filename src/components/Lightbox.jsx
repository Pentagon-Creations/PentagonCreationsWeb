import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { urlForImage } from '../sanity/client'
import './Lightbox.css'

export default function Lightbox({
  artwork,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) {
  const { getLocalized, t } = useLanguage()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' && onNext && hasNext) {
        onNext()
      } else if (e.key === 'ArrowLeft' && onPrev && hasPrev) {
        onPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, onNext, onPrev, hasNext, hasPrev])

  if (!artwork) return null

  const title = getLocalized(artwork, 'title') || 'Artwork'
  const desc = getLocalized(artwork, 'description')
  const artist = artwork.artist || 'Pentagon Art Studio'
  const imageSrc = artwork.image ? urlForImage(artwork.image) || artwork.image : null

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="lightbox-close-btn"
          onClick={onClose}
          aria-label={t('gallery.close')}
        >
          <X size={24} />
        </button>

        {/* Previous Button */}
        {hasPrev && (
          <button
            type="button"
            className="lightbox-nav-btn prev"
            onClick={onPrev}
            aria-label={t('gallery.prev')}
          >
            <ChevronLeft size={30} />
          </button>
        )}

        {/* Next Button */}
        {hasNext && (
          <button
            type="button"
            className="lightbox-nav-btn next"
            onClick={onNext}
            aria-label={t('gallery.next')}
          >
            <ChevronRight size={30} />
          </button>
        )}

        {/* Content Box */}
        <div className="lightbox-content">
          <div className="lightbox-image-box">
            {imageSrc ? (
              <img src={imageSrc} alt={title} className="lightbox-img" />
            ) : (
              <div className="lightbox-placeholder" />
            )}
          </div>

          <div className="lightbox-meta">
            <h3 className="lightbox-title">{title}</h3>
            {artist && <p className="lightbox-artist">{t('gallery.artist')}: {artist}</p>}
            {desc && <p className="lightbox-desc">{desc}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
