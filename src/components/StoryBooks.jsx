import { useLanguage } from '../context/useLanguage'
import { urlForImage } from '../sanity/client'
import CarouselTrack from './CarouselTrack'
import './StoryBooks.css'

export default function StoryBooks({ stories = [], onSelectStory }) {
  const { getLocalized, t } = useLanguage()

  const handleStoryClick = (story) => {
    if (onSelectStory) {
      onSelectStory(story)
    } else if (story.destinationUrl && story.destinationUrl !== '#') {
      window.open(story.destinationUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const hasStories = stories && stories.length > 0

  return (
    <section id="story-books" className="section-story-books" aria-labelledby="story-books-heading">
      <div className="container">
        {/* Section Heading */}
        <h2 id="story-books-heading" className="story-books-title">
          {t('story.title')}
        </h2>

        {/* Dynamic Horizontal Carousel */}
        {hasStories ? (
          <CarouselTrack ariaLabel={t('story.title')}>
            {stories.map((story, idx) => {
              const title = getLocalized(story, 'title') || 'Title'
              const premise = getLocalized(story, 'premise') || 'Premise'
              const imageSrc = story.coverImage ? urlForImage(story.coverImage) || story.coverImage : null

              return (
                <div
                  key={story._id || idx}
                  className="story-book-card"
                  onClick={() => handleStoryClick(story)}
                  role="button"
                  tabIndex={0}
                  aria-label={title}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleStoryClick(story)
                    }
                  }}
                >
                  {/* Left: Light Info Panel */}
                  <div className="story-info-side">
                    <h3 className="story-title">{title}</h3>
                    <p className="story-premise">{premise}</p>
                  </div>

                  {/* Right: Dark Cover Image */}
                  <div className="story-cover-side">
                    {imageSrc ? (
                      <img src={imageSrc} alt={title} className="story-cover-img" loading="lazy" />
                    ) : (
                      <div className="story-placeholder-box">
                        <span className="placeholder-tag">COVER</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </CarouselTrack>
        ) : (
          /* Neutral layout placeholders preserving screenshot hierarchy when CMS collection is empty */
          <CarouselTrack ariaLabel={t('story.title')}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="story-book-card placeholder-card" aria-hidden="true">
                <div className="story-info-side">
                  <h3 className="story-title">Title</h3>
                  <p className="story-premise">Premise</p>
                </div>
                <div className="story-cover-side">
                  <div className="story-placeholder-box">
                    <span className="placeholder-tag">COVER</span>
                  </div>
                </div>
              </div>
            ))}
          </CarouselTrack>
        )}
      </div>
    </section>
  )
}
