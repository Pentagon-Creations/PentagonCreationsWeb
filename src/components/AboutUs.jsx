import { useLanguage } from '../context/useLanguage'
import './AboutUs.css'

export default function AboutUs({ siteSettings }) {
  const { lang, getLocalized, t } = useLanguage()

  const heading =
    (siteSettings && getLocalized(siteSettings, 'aboutHeading')) ||
    (lang === 'id' ? 'Tentang Kami' : 'About Us')

  const aboutText = siteSettings ? getLocalized(siteSettings, 'about') : null

  return (
    <section id="about-us" className="section-about-us" aria-labelledby="about-heading">
      <div className="container">
        <h2 id="about-heading" className="about-title">
          {heading}
        </h2>

        <div className="about-content-wrapper">
          {aboutText ? (
            <div className="about-text-body">
              <p>{aboutText}</p>
            </div>
          ) : (
            <div className="about-empty-state">
              <p>{t('common.emptyData')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
