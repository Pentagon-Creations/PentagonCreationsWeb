import { useLanguage } from '../context/useLanguage'
import './Footer.css'

export default function Footer({ siteSettings }) {
  const { getLocalized, t } = useLanguage()
  const currentYear = new Date().getFullYear()

  // Dynamic link groups from Sanity siteSettings or defaults
  const mediaLinks =
    siteSettings?.mediaLinks && siteSettings.mediaLinks.length > 0
      ? siteSettings.mediaLinks
      : [
          { labelId: 'Press Kit', labelEn: 'Press Kit', url: '#' },
          { labelId: 'Aset Brand', labelEn: 'Brand Assets', url: '#' },
          { labelId: 'Galeri Trailer', labelEn: 'Trailer Gallery', url: '#' },
        ]

  const contactLinks =
    siteSettings?.contactLinks && siteSettings.contactLinks.length > 0
      ? siteSettings.contactLinks
      : [
          { labelId: 'Pertanyaan Umum', labelEn: 'General Inquiry', url: 'mailto:contact@pentagoncreations.com' },
          { labelId: 'Kolaborasi Studio', labelEn: 'Studio Collaborations', url: 'mailto:collab@pentagoncreations.com' },
          { labelId: 'Karier', labelEn: 'Careers', url: '#' },
        ]

  const gameReleaseLinks =
    siteSettings?.gameReleaseLinks && siteSettings.gameReleaseLinks.length > 0
      ? siteSettings.gameReleaseLinks
      : [
          { labelId: 'Catatan Rilis Patch', labelEn: 'Latest Patch Notes', url: '#' },
          { labelId: 'Halaman Steam', labelEn: 'Steam Storefront', url: 'https://store.steampowered.com' },
          { labelId: 'Discord Komunitas', labelEn: 'Community Discord', url: 'https://discord.com' },
        ]

  const renderLink = (item, idx) => {
    const label = getLocalized(item, 'label') || item.labelEn || item.labelId || 'Link'
    const isExternal = item.url && !item.url.startsWith('#') && !item.url.startsWith('/')

    return (
      <li key={idx}>
        <a
          href={item.url || '#'}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="footer-link"
        >
          {label}
        </a>
      </li>
    )
  }

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-container">
        {/* Three Columns matching screenshot: Media, Contact, Game Releases */}
        <div className="footer-columns">
          {/* Column 1: Media */}
          <div className="footer-col">
            <h3 className="footer-col-title">{t('footer.media')}</h3>
            <ul className="footer-links-list">
              {mediaLinks.map((item, idx) => renderLink(item, idx))}
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div className="footer-col">
            <h3 className="footer-col-title">{t('footer.contact')}</h3>
            <ul className="footer-links-list">
              {contactLinks.map((item, idx) => renderLink(item, idx))}
            </ul>
          </div>

          {/* Column 3: Game Releases */}
          <div className="footer-col">
            <h3 className="footer-col-title">{t('footer.gameReleases')}</h3>
            <ul className="footer-links-list">
              {gameReleaseLinks.map((item, idx) => renderLink(item, idx))}
            </ul>
          </div>
        </div>

        {/* Dynamic Copyright Notice */}
        <div className="footer-bottom">
          <p className="copyright-text">
            {currentYear} ©. {siteSettings?.brandName ? `${siteSettings.brandName} Creations` : 'Pentagon Creations'}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

