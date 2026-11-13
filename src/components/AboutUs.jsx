import { useLanguage } from '../context/useLanguage'
import './AboutUs.css'

export default function AboutUs({ siteSettings }) {
  const { lang, getLocalized } = useLanguage()

  const aboutText = siteSettings ? getLocalized(siteSettings, 'about') : null

  // Conditional Rendering: Only render if published about content exists in Sanity
  if (!aboutText) {
    return null
  }

  const heading =
    getLocalized(siteSettings, 'aboutHeading') ||
    (lang === 'id' ? 'Tentang Kami' : 'About Us')

  return (
    <section id="about-us" className="section-about-us" aria-labelledby="about-heading">
      <div className="container">
        <h2 id="about-heading" className="about-title">
          {heading}
        </h2>

        <div className="about-content-wrapper">
          <div className="about-text-body">
            <p>{aboutText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
