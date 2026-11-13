import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../context/useLanguage'
import { urlForImage } from '../sanity/client'
import './HeaderWhatsOn.css'

export default function HeaderWhatsOn({
  newsBox = [],
  releasedContent = [],
  newsInformation = [],
  availableSections = {},
}) {
  const { lang, getLocalized, t } = useLanguage()
  const [activeChip, setActiveChip] = useState(null)

  // Category navigation buttons reflect only currently available / rendered sections
  const chips = useMemo(() => {
    const list = []
    if (availableSections.games) {
      list.push({ id: 'games', label: t('header.games'), href: '#featured-games' })
    }
    if (availableSections.drawing) {
      list.push({ id: 'drawing', label: t('header.drawingArt'), href: '#art-gallery' })
    }
    if (availableSections.story) {
      list.push({ id: 'story', label: t('header.storyBook'), href: '#story-books' })
    }
    if (availableSections.music) {
      list.push({ id: 'music', label: t('header.music'), href: '#music' })
    }
    return list
  }, [availableSections, t])

  // Scroll-aware IntersectionObserver for active navigation state
  useEffect(() => {
    if (chips.length === 0) return

    const sectionElements = chips
      .map((c) => ({ id: c.id, el: document.querySelector(c.href) }))
      .filter((item) => Boolean(item.el))

    if (sectionElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          const targetId = visibleEntries[0].target.id
          const matched = chips.find((c) => c.href === `#${targetId}`)
          if (matched) {
            setActiveChip(matched.id)
          }
        } else {
          const scrollPos = window.scrollY
          const navOffset = 70
          const firstElTop = sectionElements[0].el.offsetTop - navOffset
          const lastItem = sectionElements[sectionElements.length - 1]
          const lastElBottom = lastItem.el.offsetTop + lastItem.el.offsetHeight

          if (scrollPos < firstElTop || scrollPos > lastElBottom) {
            setActiveChip(null)
          }
        }
      },
      {
        root: null,
        rootMargin: '-70px 0px -50% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    )

    sectionElements.forEach((item) => observer.observe(item.el))

    const handleScrollFailsafe = () => {
      const scrollPos = window.scrollY
      const firstEl = sectionElements[0]?.el
      if (firstEl && scrollPos < firstEl.offsetTop - 120) {
        setActiveChip(null)
      }
    }

    window.addEventListener('scroll', handleScrollFailsafe, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScrollFailsafe)
    }
  }, [chips])

  const handleChipClick = (e, chip) => {
    e.preventDefault()
    const target = document.querySelector(chip.href)
    if (!target) return

    setActiveChip(chip.id)

    const navHeight = 64
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight
    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    })
  }

  // Primary news box item (top featured)
  const primaryNews = newsBox && newsBox.length > 0 ? newsBox[0] : null

  // Released content items (middle column - up to 3 cards)
  const releasedItems = releasedContent ? releasedContent.slice(0, 3) : []

  // News information items (right column - concise text list)
  const infoItems = newsInformation ? newsInformation.slice(0, 6) : []

  return (
    <section id="whats-on" className="section-whats-on" aria-labelledby="whats-on-heading">
      <div className="container">
        {/* Section Heading */}
        <h2 id="whats-on-heading" className="whats-on-title">
          {t('header.title')}
        </h2>

        {/* Category Navigation Chips - only rendered when destination sections exist */}
        {chips.length > 0 && (
          <div className="category-chips-bar" role="toolbar" aria-label="Category navigation">
            {chips.map((chip) => (
              <a
                key={chip.id}
                href={chip.href}
                className={`category-chip ${activeChip === chip.id ? 'is-selected' : ''}`}
                onClick={(e) => handleChipClick(e, chip)}
              >
                {chip.label}
              </a>
            ))}
          </div>
        )}

        {/* Three Column Grid - adapts dynamically if middle column has no released content */}
        <div className={`whats-on-grid ${releasedItems.length === 0 ? 'no-released' : ''}`}>
          {/* Column A: Large News Box (Static Informational Content) */}
          {primaryNews && (
            <div className="whats-on-col col-news-box">
              <div className="news-box-card">
                <div className="news-box-image-wrap">
                  {primaryNews.coverImage ? (
                    <img
                      src={urlForImage(primaryNews.coverImage) || primaryNews.coverImage}
                      alt={getLocalized(primaryNews, 'title') || 'News Box'}
                      className="news-box-img"
                      loading="eager"
                    />
                  ) : (
                    <div className="news-box-placeholder" />
                  )}
                  <div className="news-box-gradient-overlay" />
                  <div className="news-box-text-overlay">
                    <h3 className="news-box-headline">
                      {getLocalized(primaryNews, 'title') || 'News Box'}
                    </h3>
                    {getLocalized(primaryNews, 'description') && (
                      <p className="news-box-desc">
                        {getLocalized(primaryNews, 'description')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Column B: Released Content (Static Cards with Bottom-Left Title) */}
          {releasedItems.length > 0 && (
            <div className="whats-on-col col-released">
              {releasedItems.map((item, idx) => (
                <div key={item._id || idx} className="released-content-card">
                  <div className="released-image-wrap">
                    {item.coverImage ? (
                      <img
                        src={urlForImage(item.coverImage) || item.coverImage}
                        alt={getLocalized(item, 'title') || 'Released Content'}
                        className="released-img"
                        loading="eager"
                      />
                    ) : (
                      <div className="released-placeholder" />
                    )}
                    <div className="released-gradient-overlay" />
                    <div className="released-text-overlay">
                      <h4 className="released-card-title">
                        {getLocalized(item, 'title') || 'Released Content'}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Column C: News / Information Text List (Static Informational Content) */}
          {infoItems.length > 0 && (
            <div className="whats-on-col col-information">
              <div className="info-list" role="feed" aria-label="News and Information">
                {infoItems.map((info, idx) => (
                  <article key={info._id || idx} className="info-item">
                    <h4 className="info-item-headline">
                      {getLocalized(info, 'title') || 'News / Information about Pentagon Creations'}
                    </h4>
                    {info.publishedAt && (
                      <time className="info-item-date" dateTime={info.publishedAt}>
                        {new Date(info.publishedAt).toLocaleDateString(
                          lang === 'id' ? 'id-ID' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </time>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subtle section divider */}
        <div className="whats-on-bottom-line" />
      </div>
    </section>
  )
}
