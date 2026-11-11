import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { useRouter } from '../context/useRouter'
import { urlForImage } from '../sanity/client'
import './Navbar.css'

export default function Navbar({
  availableSections = { games: true, drawing: true, story: true, music: true },
  siteSettings = null,
}) {
  const { lang, setLanguage, t } = useLanguage()
  const { navigate } = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  const brandName = siteSettings?.brandName?.trim() || 'PENTAGON CREATIONS'
  const brandWords = brandName.split(/\s+/)
  const logoUrl = siteSettings?.logo ? urlForImage(siteSettings.logo) : null

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLinks = [
    { label: t('nav.whatsOn'), href: '#whats-on' },
    { label: t('nav.ourCreations'), href: '#our-creations' },
    ...(availableSections.games ? [{ label: t('nav.featuredGames'), href: '#featured-games' }] : []),
    ...(availableSections.story ? [{ label: t('nav.storyBooks'), href: '#story-books' }] : []),
    ...(availableSections.drawing ? [{ label: t('nav.artGallery'), href: '#art-gallery' }] : []),
    ...(availableSections.music ? [{ label: t('nav.music'), href: '#music' }] : []),
    { label: t('nav.aboutUs'), href: '#about-us' },
  ]

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    navigate(href)
  }

  const handleBrandClick = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <header className="site-navbar" role="banner">
      <div className="container navbar-container">
        {/* Brand Left */}
        <a
          href="#top"
          className="navbar-brand"
          aria-label={`${brandName} Home`}
          onClick={handleBrandClick}
        >
          <div className="brand-logo-mark" aria-hidden="true">
            {logoUrl && !logoFailed ? (
              <img
                src={logoUrl}
                alt=""
                className="brand-logo-img"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="brand-circle"></span>
            )}
          </div>
          <span className="brand-wordmark">
            {brandWords[0]}
            <br />
            {brandWords.length > 1 ? brandWords.slice(1).join(' ') : 'CREATIONS'}
          </span>
        </a>

        {/* Controls Right */}
        <div className="navbar-controls">
          {/* Language Switcher Capsule: ID | EN */}
          <div className="lang-capsule" role="group" aria-label={t('nav.language')}>
            <button
              type="button"
              className={`lang-btn ${lang === 'id' ? 'is-active' : ''}`}
              onClick={() => setLanguage('id')}
              aria-pressed={lang === 'id'}
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
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            className="navbar-toggle-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? t('nav.close') : t('nav.menu')}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation Overlay / Drawer */}
      <div
        id="primary-navigation"
        className={`nav-drawer ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer-backdrop" onClick={() => setMenuOpen(false)} />
        <nav className="nav-drawer-content" aria-label="Primary Navigation">
          <div className="nav-drawer-header">
            <span className="drawer-title">{t('nav.menu')}</span>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label={t('nav.close')}
            >
              <X size={24} />
            </button>
          </div>
          <ul className="nav-links-list">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
