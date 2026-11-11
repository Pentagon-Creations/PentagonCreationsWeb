import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import './FallbackNotice.css'

export default function FallbackNotice() {
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(false)

  // Allow silencing via env var if requested
  const showBanner = import.meta.env.VITE_SHOW_FALLBACK_BANNER !== 'false'

  if (dismissed || !showBanner) return null

  return (
    <aside className="fallback-notice-bar" role="status" aria-live="polite">
      <div className="container fallback-notice-content">
        <div className="fallback-notice-main">
          <Info size={16} className="fallback-icon" />
          <div className="fallback-text">
            <strong>{t('fallback.noticeTitle')}:</strong> {t('fallback.noticeBody')}
          </div>
        </div>
        <button
          type="button"
          className="fallback-dismiss-btn"
          onClick={() => setDismissed(true)}
          aria-label={t('fallback.hide')}
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  )
}
