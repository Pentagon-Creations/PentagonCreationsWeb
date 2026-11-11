import { useState, useEffect, useMemo, useCallback } from 'react'
import { LanguageContext } from './languageContextInstance'

const STORAGE_KEY = 'pentagon_language'

const translations = {
  id: {
    nav: {
      brand: 'PENTAGON CREATIONS',
      menu: 'Menu',
      close: 'Tutup',
      home: 'Beranda',
      whatsOn: "What's On",
      ourCreations: 'Kreasi Kami',
      featuredGames: 'Game Unggulan',
      storyBooks: 'Buku Cerita',
      artGallery: 'Galeri Seni',
      music: 'Musik',
      aboutUs: 'Tentang Kami',
      language: 'Bahasa',
    },
    header: {
      title: "What's on Pentagon Creations",
      filterAll: 'Semua',
      games: 'Games',
      drawingArt: 'Drawing Art',
      storyBook: 'Story Book',
      music: 'Music',
      newsBoxBadge: 'Berita Utama',
      releasedContentBadge: 'Konten Dirilis',
      newsInfoBadge: 'Informasi Terkini',
    },
    creations: {
      title: 'Our Creations',
      subtitle: 'Four Expressions. One Foundation.',
      subtitleId: 'Empat Ekspresi. Satu Fondasi.',
      explore: 'Jelajahi',
    },
    games: {
      title: 'Featured Games',
      badgeDefault: 'BARU',
      statusReleased: 'Tersedia',
      statusDevelopment: 'Dalam Pengembangan',
      statusDemo: 'Demo Tersedia',
      statusTesting: 'Tahap Pengujian',
      viewDetails: 'Lihat Detail',
      openDestination: 'Kunjungi Halaman Game',
    },
    story: {
      title: 'Story Books',
      readSynopsis: 'Baca Sinopsis',
      author: 'Penulis',
      genre: 'Genre',
      openStory: 'Baca Online',
    },
    gallery: {
      title: 'Art Gallery',
      viewFull: 'Perbesar Karya',
      artist: 'Seniman',
      close: 'Tutup Galeri',
      prev: 'Sebelumnya',
      next: 'Selanjutnya',
    },
    music: {
      title: 'Music',
      listen: 'Dengarkan',
      composer: 'Komposer',
    },
    about: {
      title: 'About Us',
      titleLocal: 'Tentang Kami',
    },
    footer: {
      media: 'Media',
      contact: 'Kontak',
      gameReleases: 'Rilis Game',
      copyright: 'Pentagon Creations. Hak Cipta Dilindungi Undang-Undang.',
    },
    common: {
      emptyData: 'Belum ada konten yang tersedia.',
      loading: 'Memuat data...',
      error: 'Terjadi kendala saat memuat data.',
      readMore: 'Selengkapnya',
      externalLink: 'Buka Tautan',
      closeModal: 'Tutup',
    },
    fallback: {
      noticeTitle: 'Mode Data Fallback Pengembangan Aktif',
      noticeBody: 'Data saat ini menggunakan sampel lokal. Hubungkan Sanity.io dengan mengisi VITE_SANITY_PROJECT_ID di berkas .env.local untuk memuat konten CMS langsung.',
      hide: 'Tutup Peringatan',
    },
  },
  en: {
    nav: {
      brand: 'PENTAGON CREATIONS',
      menu: 'Menu',
      close: 'Close',
      home: 'Home',
      whatsOn: "What's On",
      ourCreations: 'Our Creations',
      featuredGames: 'Featured Games',
      storyBooks: 'Story Books',
      artGallery: 'Art Gallery',
      music: 'Music',
      aboutUs: 'About Us',
      language: 'Language',
    },
    header: {
      title: "What's on Pentagon Creations",
      filterAll: 'All',
      games: 'Games',
      drawingArt: 'Drawing Art',
      storyBook: 'Story Book',
      music: 'Music',
      newsBoxBadge: 'Top Feature',
      releasedContentBadge: 'Released Content',
      newsInfoBadge: 'Latest Information',
    },
    creations: {
      title: 'Our Creations',
      subtitle: 'Four Expressions. One Foundation.',
      subtitleId: 'Four Expressions. One Foundation.',
      explore: 'Explore',
    },
    games: {
      title: 'Featured Games',
      badgeDefault: 'NEW',
      statusReleased: 'Available Now',
      statusDevelopment: 'In Development',
      statusDemo: 'Demo Available',
      statusTesting: 'Testing Phase',
      viewDetails: 'View Details',
      openDestination: 'Visit Game Page',
    },
    story: {
      title: 'Story Books',
      readSynopsis: 'Read Synopsis',
      author: 'Author',
      genre: 'Genre',
      openStory: 'Read Online',
    },
    gallery: {
      title: 'Art Gallery',
      viewFull: 'Expand Artwork',
      artist: 'Artist',
      close: 'Close Gallery',
      prev: 'Previous',
      next: 'Next',
    },
    music: {
      title: 'Music',
      listen: 'Listen',
      composer: 'Composer',
    },
    about: {
      title: 'About Us',
      titleLocal: 'About Us',
    },
    footer: {
      media: 'Media',
      contact: 'Contact',
      gameReleases: 'Game Releases',
      copyright: 'Pentagon Creations. All Rights Reserved.',
    },
    common: {
      emptyData: 'No content available at this time.',
      loading: 'Loading content...',
      error: 'Unable to load content right now.',
      readMore: 'Read More',
      externalLink: 'Open Link',
      closeModal: 'Close',
    },
    fallback: {
      noticeTitle: 'Development Fallback Data Active',
      noticeBody: 'Displaying local development sample content. Connect your real Sanity.io project by setting VITE_SANITY_PROJECT_ID in .env.local to load live CMS content.',
      hide: 'Dismiss Notice',
    },
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'id') return saved
    } catch {
      // ignore
    }
    return 'id'
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
      document.documentElement.lang = lang
    } catch {
      // ignore
    }
  }, [lang])

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'))
  }, [])

  const setLanguage = useCallback((newLang) => {
    if (newLang === 'id' || newLang === 'en') {
      setLang(newLang)
    }
  }, [])

  const getLocalized = useCallback(
    (item, baseField, fallbackValue = '') => {
      if (!item) return fallbackValue

      const primarySuffix = lang === 'id' ? 'Id' : 'En'
      const secondarySuffix = lang === 'id' ? 'En' : 'Id'

      const primaryKey = `${baseField}${primarySuffix}`
      const secondaryKey = `${baseField}${secondarySuffix}`

      if (item[primaryKey] !== undefined && item[primaryKey] !== null && item[primaryKey] !== '') {
        return item[primaryKey]
      }
      if (item[secondaryKey] !== undefined && item[secondaryKey] !== null && item[secondaryKey] !== '') {
        return item[secondaryKey]
      }
      if (item[baseField] !== undefined && item[baseField] !== null && item[baseField] !== '') {
        return item[baseField]
      }
      return fallbackValue
    },
    [lang]
  )

  const t = useCallback(
    (path, fallback = '') => {
      const keys = path.split('.')
      let current = translations[lang]
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key]
        } else {
          let fallbackBranch = translations.id
          for (const fbKey of keys) {
            if (fallbackBranch && fbKey in fallbackBranch) {
              fallbackBranch = fallbackBranch[fbKey]
            } else {
              return fallback || path
            }
          }
          return fallbackBranch || fallback || path
        }
      }
      return current || fallback || path
    },
    [lang]
  )

  const value = useMemo(
    () => ({
      lang,
      setLanguage,
      toggleLanguage,
      getLocalized,
      t,
    }),
    [lang, setLanguage, toggleLanguage, getLocalized, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
