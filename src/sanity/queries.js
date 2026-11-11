export const newsBoxQuery = `*[_type == "newsBox" && published != false] | order(order asc, publishedAt desc)[0...5]`

export const releasedContentQuery = `*[_type == "releasedContent" && published != false] | order(order asc, _createdAt desc)[0...6]`

export const newsInformationQuery = `*[_type == "newsInformation" && published != false] | order(order asc, publishedAt desc)[0...10]`

export const creationCategoriesQuery = `*[_type == "creationCategory" && published != false] | order(order asc)[0...4]`

// Dynamic queries fetch all published entries so carousels and galleries adapt naturally
export const featuredGamesQuery = `*[_type == "game" && published != false && featured != false] | order(order asc)`

export const storyBooksQuery = `*[_type == "storyBook" && published != false] | order(order asc)`

export const artworksQuery = `*[_type == "artwork" && published != false] | order(order asc)`

export const musicQuery = `*[_type == "music" && published != false] | order(order asc)`

export const siteSettingsQuery = `*[_type == "siteSettings"][0]`

// Query for fetching a single story book by slug or ID
export const singleStoryBookQuery = `*[_type == "storyBook" && (slug.current == $slug || _id == $slug) && published != false][0]`

// Single combined query for optimized initial page data fetching
export const allPentagonDataQuery = `{
  "newsBox": ${newsBoxQuery},
  "releasedContent": ${releasedContentQuery},
  "newsInformation": ${newsInformationQuery},
  "creationCategories": ${creationCategoriesQuery},
  "featuredGames": ${featuredGamesQuery},
  "storyBooks": ${storyBooksQuery},
  "artworks": ${artworksQuery},
  "music": ${musicQuery},
  "siteSettings": ${siteSettingsQuery}
}`
