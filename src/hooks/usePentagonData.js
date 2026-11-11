import { useState, useEffect, useCallback } from 'react'
import { sanityClient, isSanityConfigured } from '../sanity/client'
import { allPentagonDataQuery } from '../sanity/queries'
import {
  fallbackNewsBox,
  fallbackReleasedContent,
  fallbackNewsInformation,
  fallbackCreationCategories,
  fallbackFeaturedGames,
  fallbackStoryBooks,
  fallbackArtworks,
  fallbackMusic,
  fallbackSiteSettings,
} from '../data/fallbackData'

const configured = isSanityConfigured() && Boolean(sanityClient)

const initialDataset = configured
  ? {
      newsBox: [],
      releasedContent: [],
      newsInformation: [],
      creationCategories: [],
      featuredGames: [],
      storyBooks: [],
      artworks: [],
      music: [],
      siteSettings: null,
    }
  : {
      newsBox: fallbackNewsBox,
      releasedContent: fallbackReleasedContent,
      newsInformation: fallbackNewsInformation,
      creationCategories: fallbackCreationCategories,
      featuredGames: fallbackFeaturedGames,
      storyBooks: fallbackStoryBooks,
      artworks: fallbackArtworks,
      music: fallbackMusic,
      siteSettings: fallbackSiteSettings,
    }

export function usePentagonData() {
  const [loading, setLoading] = useState(configured)
  const [error, setError] = useState(null)
  const [isUsingFallback, setIsUsingFallback] = useState(!configured)
  const [data, setData] = useState(initialDataset)

  // Explicit user-triggered refetch callback (safe for event handlers)
  const refetch = useCallback(async () => {
    if (!configured) return

    setLoading(true)
    setError(null)

    try {
      const result = await sanityClient.fetch(allPentagonDataQuery)
      setData({
        newsBox: Array.isArray(result?.newsBox) ? result.newsBox : [],
        releasedContent: Array.isArray(result?.releasedContent) ? result.releasedContent : [],
        newsInformation: Array.isArray(result?.newsInformation) ? result.newsInformation : [],
        creationCategories: Array.isArray(result?.creationCategories) ? result.creationCategories : [],
        featuredGames: Array.isArray(result?.featuredGames) ? result.featuredGames : [],
        storyBooks: Array.isArray(result?.storyBooks) ? result.storyBooks : [],
        artworks: Array.isArray(result?.artworks) ? result.artworks : [],
        music: Array.isArray(result?.music) ? result.music : [],
        siteSettings: result?.siteSettings || null,
      })
      setIsUsingFallback(false)
    } catch (err) {
      console.error('Error fetching live content from Sanity.io:', err)
      setError(err?.message || 'Failed to fetch content from Sanity')
      setIsUsingFallback(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch on mount (asynchronous promise avoids synchronous setState in effect body)
  useEffect(() => {
    if (!configured) return

    let active = true

    sanityClient
      .fetch(allPentagonDataQuery)
      .then((result) => {
        if (!active) return
        setData({
          newsBox: Array.isArray(result?.newsBox) ? result.newsBox : [],
          releasedContent: Array.isArray(result?.releasedContent) ? result.releasedContent : [],
          newsInformation: Array.isArray(result?.newsInformation) ? result.newsInformation : [],
          creationCategories: Array.isArray(result?.creationCategories) ? result.creationCategories : [],
          featuredGames: Array.isArray(result?.featuredGames) ? result.featuredGames : [],
          storyBooks: Array.isArray(result?.storyBooks) ? result.storyBooks : [],
          artworks: Array.isArray(result?.artworks) ? result.artworks : [],
          music: Array.isArray(result?.music) ? result.music : [],
          siteSettings: result?.siteSettings || null,
        })
        setLoading(false)
        setIsUsingFallback(false)
      })
      .catch((err) => {
        if (!active) return
        console.error('Error fetching live content from Sanity.io:', err)
        setError(err?.message || 'Failed to fetch content from Sanity')
        setLoading(false)
        setIsUsingFallback(false)
      })

    return () => {
      active = false
    }
  }, [])

  return {
    ...data,
    loading,
    error,
    isUsingFallback,
    refetch,
  }
}

