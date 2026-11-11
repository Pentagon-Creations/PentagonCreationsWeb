import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { useRouter } from '../context/useRouter'
import { sanityClient, isSanityConfigured } from '../sanity/client'
import { singleStoryBookQuery } from '../sanity/queries'
import { fallbackStoryBooks } from '../data/fallbackData'
import PortableTextRenderer from './PortableTextRenderer'
import './BookReadingPage.css'

import { BOOK_LOADING_GIF_PATH, MIN_GIF_DURATION_MS } from '../config/constants'
export { BOOK_LOADING_GIF_PATH, MIN_GIF_DURATION_MS }

export default function BookReadingPage({ slug, allStories = [] }) {
  const { lang, setLanguage, getLocalized, t } = useLanguage()
  const { navigate } = useRouter()

  const [book, setBook] = useState(null)
  const [dataReady, setDataReady] = useState(false)
  const [timerElapsed, setTimerElapsed] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    let isMounted = true

    // 1. Condition 1: Minimum GIF loading animation duration timer
    const timer = setTimeout(() => {
      if (isMounted) {
        setTimerElapsed(true)
      }
    }, MIN_GIF_DURATION_MS)

    // 2. Condition 2: Data fetching from Sanity or fallback dataset
    async function loadBookData() {
      if (!slug) {
        if (isMounted) {
          setDataReady(true)
        }
        return
      }

      // Check live Sanity CMS if configured
      if (isSanityConfigured() && sanityClient) {
        try {
          const result = await sanityClient.fetch(singleStoryBookQuery, { slug })
          if (isMounted) {
            if (result) {
              setBook(result)
            } else {
              // Try passed stories array if available
              const localMatch = allStories.find(
                (b) => b.slug?.current === slug || b.slug === slug || b._id === slug
              )
              setBook(localMatch || null)
            }
            setDataReady(true)
          }
          return
        } catch (err) {
          console.warn('Failed to fetch book from Sanity:', err)
          if (isMounted) {
            setFetchError(err.message || 'Error fetching book')
            setDataReady(true)
          }
          return
        }
      }

      // Fallback local resolution
      const sourceList = allStories.length > 0 ? allStories : fallbackStoryBooks
      const found = sourceList.find(
        (b) => b.slug?.current === slug || b.slug === slug || b._id === slug
      )

      if (isMounted) {
        setBook(found || null)
        setDataReady(true)
      }
    }

    loadBookData()

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [slug, allStories])

  // Both conditions must be satisfied before revealing the reading content:
  // 1. Intended animation duration elapsed
  // 2. Data fetching completed
  const isFullyLoaded = timerElapsed && dataReady

  // Render Custom Loading Screen
  if (!isFullyLoaded) {
    return (
      <div className="book-reader-loading-screen" role="status" aria-live="polite">
        <div className="book-loading-container">
          {!imgFailed ? (
            <img
              src={BOOK_LOADING_GIF_PATH}
              alt="Loading Book Animation"
              className="book-loading-gif"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="book-loading-fallback-icon">
              <BookOpen size={48} className="pulse-icon" />
            </div>
          )}
          <p className="book-loading-label">
            {lang === 'id' ? 'Membuka Halaman Buku...' : 'Opening Book Pages...'}
          </p>
        </div>
      </div>
    )
  }

  // Not Found State
  if (!book) {
    return (
      <div className="book-reader-not-found-screen">
        <div className="container not-found-content">
          <AlertCircle size={40} className="not-found-icon" />
          <h1 className="not-found-title">
            {lang === 'id' ? 'Buku Tidak Ditemukan' : 'Book Not Found'}
          </h1>
          <p className="not-found-desc">
            {fetchError
              ? `${lang === 'id' ? 'Terjadi kesalahan sistem' : 'A system error occurred'}: ${fetchError}`
              : lang === 'id'
              ? 'Buku atau bab yang Anda tuju tidak tersedia atau telah dipindahkan.'
              : 'The requested book or chapter is not available or has been moved.'}
          </p>
          <button
            type="button"
            className="reader-back-btn primary"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            <span>{lang === 'id' ? 'Kembali ke Beranda' : 'Return to Home'}</span>
          </button>
        </div>
      </div>
    )
  }

  // Resolved Book Content
  const title = getLocalized(book, 'title') || 'Book Title'
  const author = book.author || 'Pentagon Literary Circle'
  const genre = book.genre || null
  const content =
    getLocalized(book, 'content') ||
    getLocalized(book, 'description') ||
    getLocalized(book, 'premise')

  return (
    <div className="book-reading-page">
      {/* Top Reading Navigation Bar */}
      <header className="book-reader-topbar">
        <div className="container reader-topbar-inner">
          <button
            type="button"
            className="reader-back-btn"
            onClick={() => navigate('/')}
            aria-label={lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
          >
            <ArrowLeft size={18} />
            <span>{lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}</span>
          </button>

          <div className="reader-topbar-right">
            {/* Language Capsule */}
            <div className="lang-capsule reader-lang" role="group" aria-label={t('nav.language')}>
              <button
                type="button"
                className={`lang-btn ${lang === 'id' ? 'is-active' : ''}`}
                onClick={() => setLanguage('id')}
              >
                ID
              </button>
              <span className="lang-divider" aria-hidden="true">
                |
              </span>
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'is-active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Reading Parchment Container */}
      <main className="book-reader-main">
        <article className="book-reader-parchment">
          {/* Header Area */}
          <header className="book-reader-header">
            {genre && <span className="book-reader-genre-tag">{genre}</span>}
            <h1 className="book-reader-title">{title}</h1>
            <p className="book-reader-author">
              {lang === 'id' ? 'Karya' : 'By'} <strong>{author}</strong>
            </p>
          </header>

          <div className="book-reader-divider" aria-hidden="true" />

          {/* Book Reading Text Body */}
          <section className="book-reader-content">
            <PortableTextRenderer content={content} className="book-story-text" />
          </section>

          {/* End of Chapter Ornament */}
          <footer className="book-reader-footer">
            <div className="book-reader-ornament" aria-hidden="true">
              ♦ ♦ ♦
            </div>
            <p className="book-reader-end-note">
              {lang === 'id'
                ? 'Akhir dari pratinjau buku ini.'
                : 'End of this book reading preview.'}
            </p>
            <div className="book-reader-bottom-actions">
              <button
                type="button"
                className="reader-back-btn secondary"
                onClick={() => navigate('/')}
              >
                <ArrowLeft size={16} />
                <span>{lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}</span>
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  )
}
