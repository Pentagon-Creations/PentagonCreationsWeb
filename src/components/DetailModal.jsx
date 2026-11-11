import { useEffect } from 'react'
import { X, ExternalLink, BookOpen } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { useRouter } from '../context/useRouter'
import { urlForImage } from '../sanity/client'
import './DetailModal.css'

export default function DetailModal({ item, type = 'item', onClose }) {
  const { lang, getLocalized, t } = useLanguage()
  const { navigate } = useRouter()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!item) return null

  const title = getLocalized(item, 'title') || item.title || 'Details'
  const description =
    getLocalized(item, 'description') ||
    getLocalized(item, 'premise') ||
    getLocalized(item, 'summary') ||
    item.description ||
    item.premise ||
    item.summary
  const cover = item.coverImage ? urlForImage(item.coverImage) || item.coverImage : null
  const badge = getLocalized(item, 'badgeText')
  const status = item.releaseStatus
  const destination = item.destinationUrl || item.streamingUrl

  // Check if item is a Story Book eligible for dedicated reader
  const isStoryBook =
    type === 'story' ||
    Boolean(item.premiseId || item.premiseEn || item.premise || (item.author && item.slug))

  const bookSlug = item.slug?.current || item.slug || item._id

  const handleReadClick = () => {
    onClose()
    if (bookSlug) {
      navigate(`/books/${encodeURIComponent(bookSlug)}`)
    }
  }

  return (
    <div
      className="detail-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label={t('common.closeModal')}
        >
          <X size={20} />
        </button>

        {cover && (
          <div className="modal-cover-wrapper">
            <img src={cover} alt={title} className="modal-cover-img" />
            {badge && <span className="modal-badge">{badge}</span>}
          </div>
        )}

        <div className="modal-body">
          <h2 className="modal-title">{title}</h2>

          <div className="modal-tags">
            {item.author && (
              <span className="modal-tag">
                {t('story.author')}: {item.author}
              </span>
            )}
            {item.genre && (
              <span className="modal-tag">
                {t('story.genre')}: {item.genre}
              </span>
            )}
            {item.artist && <span className="modal-tag">{item.artist}</span>}
            {status && (
              <span className="modal-tag status-tag">
                {status === 'released'
                  ? t('games.statusReleased')
                  : status === 'in_development'
                  ? t('games.statusDevelopment')
                  : status === 'demo'
                  ? t('games.statusDemo')
                  : status}
              </span>
            )}
          </div>

          {description && <p className="modal-desc">{description}</p>}

          <div className="modal-actions">
            {/* Dedicated Reading Button for Story Books */}
            {isStoryBook && bookSlug && (
              <button
                type="button"
                className="modal-action-btn read-btn"
                onClick={handleReadClick}
              >
                <BookOpen size={16} />
                <span>{lang === 'id' ? 'Baca Buku Ini' : 'Read This Book'}</span>
              </button>
            )}

            {/* External Destination Link if provided */}
            {destination && destination !== '#' && (
              <a
                href={destination}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-btn primary"
              >
                <span>{t('common.externalLink')}</span>
                <ExternalLink size={14} />
              </a>
            )}

            <button
              type="button"
              className="modal-action-btn secondary"
              onClick={onClose}
            >
              {t('common.closeModal')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
