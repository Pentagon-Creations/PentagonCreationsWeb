import { useState, useEffect, useCallback, useMemo } from 'react'
import { RouterContext } from './routerContextInstance'

function parseCurrentRoute() {
  const hash = window.location.hash || ''
  const pathname = window.location.pathname || ''

  // 1. Check Hash first (guarantees 100% compatibility with GitHub Pages, static hosting, and refresh)
  if (hash.startsWith('#/books/') || hash.startsWith('#books/')) {
    const slug = hash.replace(/^#\/?books\//, '').split('?')[0].split('#')[0]
    if (slug) return { name: 'book', slug: decodeURIComponent(slug) }
  }

  if (hash === '#/gallery' || hash === '#gallery') {
    return { name: 'gallery' }
  }

  // 2. Check Pathname
  const bookMatch = pathname.match(/\/books\/([^/?#]+)/)
  if (bookMatch && bookMatch[1]) {
    return { name: 'book', slug: decodeURIComponent(bookMatch[1]) }
  }

  if (pathname.endsWith('/gallery') || pathname.endsWith('/gallery/')) {
    return { name: 'gallery' }
  }

  return { name: 'home' }
}

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(parseCurrentRoute)

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(parseCurrentRoute())
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('hashchange', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('hashchange', handleRouteChange)
    }
  }, [])

  const navigate = useCallback((to) => {
    if (!to || to === '/' || to === '#top') {
      window.location.hash = ''
      setRoute({ name: 'home' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (to === '/gallery' || to === '#/gallery') {
      window.location.hash = '#/gallery'
      setRoute({ name: 'gallery' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (to.startsWith('/books/') || to.startsWith('#/books/')) {
      const slug = to.replace(/^\/?(#\/)?books\//, '')
      window.location.hash = `#/books/${encodeURIComponent(slug)}`
      setRoute({ name: 'book', slug })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Anchor hash navigation on homepage
    if (to.startsWith('#')) {
      const current = parseCurrentRoute()
      if (current.name !== 'home') {
        window.location.hash = to
        setRoute({ name: 'home' })
        setTimeout(() => {
          const el = document.querySelector(to)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 80)
      } else {
        const el = document.querySelector(to)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    // Default external or generic fallback
    if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:')) {
      window.open(to, '_blank', 'noopener,noreferrer')
      return
    }

    window.location.href = to
  }, [])

  const navigateBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate('/')
    }
  }, [navigate])

  const value = useMemo(
    () => ({
      route,
      navigate,
      navigateBack,
    }),
    [route, navigate, navigateBack]
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

