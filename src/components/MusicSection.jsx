import { useLanguage } from '../context/useLanguage'
import { urlForImage } from '../sanity/client'
import CarouselTrack from './CarouselTrack'
import './MusicSection.css'

export default function MusicSection({ music = [], onSelectTrack }) {
  const { getLocalized, t } = useLanguage()

  // Conditional Rendering: Only render if published music items exist in Sanity
  if (!music || music.length === 0) {
    return null
  }

  const handleTrackClick = (track) => {
    if (onSelectTrack) {
      onSelectTrack(track)
    } else if (track.streamingUrl) {
      window.open(track.streamingUrl, '_blank', 'noopener,noreferrer')
    } else if (track.destinationUrl) {
      window.open(track.destinationUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="music" className="section-music" aria-labelledby="music-heading">
      <div className="container">
        {/* Section Heading */}
        <h2 id="music-heading" className="music-title">
          {t('music.title')}
        </h2>

        {/* Dynamic Horizontal Carousel */}
        <CarouselTrack ariaLabel={t('music.title')}>
          {music.map((track, idx) => {
            const title = getLocalized(track, 'title') || 'Title'
            const artist = track.artist || 'Pentagon Creations'
            const imageSrc = track.coverImage ? urlForImage(track.coverImage) || track.coverImage : null

            return (
              <div
                key={track._id || idx}
                className="music-card"
                onClick={() => handleTrackClick(track)}
                role="button"
                tabIndex={0}
                aria-label={`${title} - ${artist}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleTrackClick(track)
                  }
                }}
              >
                {/* Square Album Cover */}
                <div className="music-cover-box">
                  {imageSrc ? (
                    <img src={imageSrc} alt={title} className="music-cover-img" loading="lazy" />
                  ) : (
                    <div className="music-placeholder-box" />
                  )}
                </div>

                {/* Title Beneath Image */}
                <div className="music-meta-box">
                  <h3 className="music-track-title">{title}</h3>
                </div>
              </div>
            )
          })}
        </CarouselTrack>
      </div>
    </section>
  )
}
