import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './CarouselTrack.css'

export default function CarouselTrack({
  children,
  className = '',
  ariaLabel = 'Carousel',
  itemWidth = null,
}) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  const checkScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const tolerance = 4
    const overflow = scrollWidth > clientWidth + tolerance

    setHasOverflow(overflow)
    setCanScrollLeft(overflow && scrollLeft > tolerance)
    setCanScrollRight(overflow && scrollLeft < scrollWidth - clientWidth - tolerance)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScrollState()

    const handleScroll = () => {
      checkScrollState()
    }

    el.addEventListener('scroll', handleScroll, { passive: true })

    // ResizeObserver tracks both window resize and child element resizing
    const resizeObserver = new ResizeObserver(() => {
      checkScrollState()
    })
    resizeObserver.observe(el)

    return () => {
      el.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [checkScrollState, children])

  const scrollByDirection = (direction) => {
    const el = scrollRef.current
    if (!el) return

    const scrollAmount = (el.clientWidth * 0.75) * direction
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className={`carousel-track-wrapper ${className}`}>
      {/* Left Navigation Arrow */}
      {hasOverflow && (
        <button
          type="button"
          className={`carousel-nav-btn prev ${!canScrollLeft ? 'is-disabled' : ''}`}
          onClick={() => scrollByDirection(-1)}
          disabled={!canScrollLeft}
          aria-label="Previous items"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Horizontally scrollable container */}
      <div
        ref={scrollRef}
        className={`carousel-scroll-container ${!hasOverflow ? 'no-overflow' : ''}`}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        style={itemWidth ? { '--item-custom-width': itemWidth } : undefined}
      >
        {children}
      </div>

      {/* Right Navigation Arrow */}
      {hasOverflow && (
        <button
          type="button"
          className={`carousel-nav-btn next ${!canScrollRight ? 'is-disabled' : ''}`}
          onClick={() => scrollByDirection(1)}
          disabled={!canScrollRight}
          aria-label="Next items"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  )
}

