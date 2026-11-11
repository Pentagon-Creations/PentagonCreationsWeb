import { useLanguage } from '../context/useLanguage'
import { urlForImage } from '../sanity/client'
import './OurCreations.css'

export default function OurCreations({ categories = [], onSelectCategory }) {
  const { lang, getLocalized, t } = useLanguage()

  // Default fallback pillars if categories empty
  const defaultPillars = [
    {
      titleId: 'Game Development',
      titleEn: 'Game Development',
      descriptionId: 'Pengembangan pengalaman interaktif dan mekanik game inovatif.',
      descriptionEn: 'Interactive game development with immersive systems and mechanics.',
      destinationUrl: '#featured-games',
    },
    {
      titleId: 'Story Writing',
      titleEn: 'Story Writing',
      descriptionId: 'Penulisan narasi fiksi, semesta cerita, dan eksplorasi karakter.',
      descriptionEn: 'Fiction worldbuilding, rich narratives, and multifaceted lore.',
      destinationUrl: '#story-books',
    },
    {
      titleId: 'Drawing Art',
      titleEn: 'Drawing Art',
      descriptionId: 'Seni konsep visual, rancangan estetika, dan ilustrasi digital.',
      descriptionEn: 'Concept design, expressive character art, and digital illustration.',
      destinationUrl: '#art-gallery',
    },
    {
      titleId: 'Music',
      titleEn: 'Music',
      descriptionId: 'Komposisi soundtrack sinematik, aransemen audio, dan tata suara.',
      descriptionEn: 'Original soundtrack composition, ambient scoring, and soundscapes.',
      destinationUrl: '#music',
    },
  ]

  const itemsToRender = categories && categories.length > 0 ? categories : defaultPillars

  const handleCardClick = (cat) => {
    if (cat.destinationUrl) {
      if (cat.destinationUrl.startsWith('#')) {
        const el = document.querySelector(cat.destinationUrl)
        if (el) {
          const navHeight = 64
          const targetTop = el.getBoundingClientRect().top + window.pageYOffset - navHeight
          window.scrollTo({ top: targetTop, behavior: 'smooth' })
        } else if (onSelectCategory) {
          onSelectCategory(cat)
        }
      } else {
        window.open(cat.destinationUrl, '_blank', 'noopener,noreferrer')
      }
    } else if (onSelectCategory) {
      onSelectCategory(cat)
    }
  }

  return (
    <section id="our-creations" className="section-our-creations" aria-labelledby="creations-heading">
      <div className="container">
        {/* Section Header */}
        <div className="creations-header">
          <h2 id="creations-heading" className="creations-title">
            {t('creations.title')}
          </h2>
          <p className="creations-subtitle">
            <em>
              {lang === 'id'
                ? t('creations.subtitleId', 'Empat Ekspresi. Satu Fondasi.')
                : t('creations.subtitle', 'Four Expressions. One Foundation.')}
            </em>
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="creations-grid">
          {itemsToRender.slice(0, 4).map((cat, idx) => {
            const title = getLocalized(cat, 'title') || cat.titleEn
            const desc = getLocalized(cat, 'description') || cat.descriptionEn
            const imageSrc = cat.coverImage ? urlForImage(cat.coverImage) || cat.coverImage : null

            return (
              <div
                key={cat._id || idx}
                className="creation-card"
                onClick={() => handleCardClick(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick(cat)
                  }
                }}
              >
                {/* Upper Image Box */}
                <div className="creation-image-box">
                  {imageSrc ? (
                    <img src={imageSrc} alt={title} className="creation-img" loading="lazy" />
                  ) : (
                    <div className="creation-placeholder-img" />
                  )}
                </div>

                {/* Lower Black Info Panel */}
                <div className="creation-info-panel">
                  <h3 className="creation-card-title">{title}</h3>
                  <p className="creation-card-desc">{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
