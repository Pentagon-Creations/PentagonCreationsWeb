import { useLanguage } from '../context/useLanguage'
import { urlForImage } from '../sanity/client'
import CarouselTrack from './CarouselTrack'
import './FeaturedGames.css'

export default function FeaturedGames({ games = [], onSelectGame }) {
  const { lang, getLocalized, t } = useLanguage()

  // Conditional Rendering: Only render if published games exist in Sanity
  if (!games || games.length === 0) {
    return null
  }

  const handleGameClick = (game) => {
    if (onSelectGame) {
      onSelectGame(game)
    } else if (game.destinationUrl) {
      window.open(game.destinationUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="featured-games" className="section-featured-games" aria-labelledby="games-heading">
      <div className="container">
        {/* Section Heading */}
        <h2 id="games-heading" className="featured-games-title">
          {t('games.title')}
        </h2>

        {/* Dynamic Horizontal Carousel */}
        <CarouselTrack ariaLabel={t('games.title')}>
          {games.map((game, idx) => {
            const title = getLocalized(game, 'title') || 'Title'
            const badge =
              getLocalized(game, 'badgeText') ||
              (lang === 'id' ? t('games.badgeDefault', 'BARU') : 'NEW')
            const imageSrc = game.coverImage ? urlForImage(game.coverImage) || game.coverImage : null

            return (
              <div
                key={game._id || idx}
                className="featured-game-card"
                onClick={() => handleGameClick(game)}
                role="button"
                tabIndex={0}
                aria-label={title}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleGameClick(game)
                  }
                }}
              >
                {/* Red Overlapping Badge */}
                {badge && <span className="game-badge">{badge}</span>}

                {/* Portrait Cover Area */}
                <div className="game-cover-area">
                  {imageSrc ? (
                    <img src={imageSrc} alt={title} className="game-cover-img" loading="lazy" />
                  ) : (
                    <div className="game-placeholder-box">
                      <span className="placeholder-tag">COVER IMAGE</span>
                    </div>
                  )}
                </div>

                {/* Game Title at Bottom */}
                <div className="game-title-bar">
                  <h3 className="game-title">{title}</h3>
                </div>
              </div>
            )
          })}
        </CarouselTrack>
      </div>
    </section>
  )
}
