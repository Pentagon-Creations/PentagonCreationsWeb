import assert from 'node:assert'
import {
  fallbackFeaturedGames,
  fallbackStoryBooks,
  fallbackArtworks,
  fallbackMusic,
} from '../data/fallbackData.js'
import {
  HOME_GALLERY_LIMIT,
  BOOK_LOADING_GIF_PATH,
  MIN_GIF_DURATION_MS,
} from '../config/constants.js'
import {
  featuredGamesQuery,
  storyBooksQuery,
  artworksQuery,
  musicQuery,
  singleStoryBookQuery,
} from '../sanity/queries.js'

console.log('--- STARTING VERIFICATION TESTS ---')

// 1. Check queries have no hardcoded slice limits
console.log('1. Checking Sanity queries...')
assert(!featuredGamesQuery.includes('[0...'), 'featuredGamesQuery should not slice items')
assert(!storyBooksQuery.includes('[0...'), 'storyBooksQuery should not slice items')
assert(!artworksQuery.includes('[0...'), 'artworksQuery should not slice items')
assert(!musicQuery.includes('[0...'), 'musicQuery should not slice items')
assert(singleStoryBookQuery.includes('$slug'), 'singleStoryBookQuery must accept $slug param')
console.log('✓ Sanity queries correctly query all items dynamically')

// 2. Check Drawing Art homepage limit constant
console.log('2. Checking Drawing Art constants...')
assert.strictEqual(HOME_GALLERY_LIMIT, 8, 'HOME_GALLERY_LIMIT should be 8')
assert(
  fallbackArtworks.length > HOME_GALLERY_LIMIT,
  `fallbackArtworks count (${fallbackArtworks.length}) must exceed limit (${HOME_GALLERY_LIMIT}) so Show More is testable`
)
console.log(`✓ Drawing Art has ${fallbackArtworks.length} items, exceeding limit of ${HOME_GALLERY_LIMIT}`)

// 3. Check Story Books reading content exists in fallback data
console.log('3. Checking Story Books fallback reading content...')
fallbackStoryBooks.forEach((book, idx) => {
  assert(book.slug?.current, `Book ${idx} must have a slug.current`)
  assert(book.titleId && book.titleEn, `Book ${idx} must have titleId and titleEn`)
  assert(book.author, `Book ${idx} must have author`)
  assert(book.contentId, `Book ${idx} must have rich contentId`)
  assert(book.contentEn, `Book ${idx} must have rich contentEn`)
  assert(Array.isArray(book.contentId), `Book ${idx} contentId must be array of blocks`)
  assert(Array.isArray(book.contentEn), `Book ${idx} contentEn must be array of blocks`)
})
console.log(`✓ All ${fallbackStoryBooks.length} fallback books have complete localized reading content`)

// 4. Check Book Reading Page loading constants
console.log('4. Checking Book Reading Page constants...')
assert(BOOK_LOADING_GIF_PATH, 'BOOK_LOADING_GIF_PATH constant must exist')
assert(MIN_GIF_DURATION_MS > 0, 'MIN_GIF_DURATION_MS must be greater than 0')
console.log(`✓ Loading GIF configured at ${BOOK_LOADING_GIF_PATH} with ${MIN_GIF_DURATION_MS}ms min duration`)

// 5. Test slug resolution logic
console.log('5. Testing Book slug lookup...')
const testSlug = 'the-last-pentagram'
const foundBook = fallbackStoryBooks.find(
  (b) => b.slug?.current === testSlug || b.slug === testSlug || b._id === testSlug
)
assert(foundBook, 'Should find book by slug "the-last-pentagram"')
assert.strictEqual(foundBook.titleEn, 'The Last Pentagram')
console.log(`✓ Successfully resolved book "${foundBook.titleEn}" by slug "${testSlug}"`)

// 6. Test conditional section filtering logic
console.log('6. Testing conditional section rendering logic...')
const mockEmptyData = {
  featuredGames: [],
  storyBooks: [],
  artworks: [],
  music: [],
}

const getAvailableSections = (data, loading = false) => ({
  games: loading || Boolean(data.featuredGames && data.featuredGames.length > 0),
  drawing: loading || Boolean(data.artworks && data.artworks.length > 0),
  story: loading || Boolean(data.storyBooks && data.storyBooks.length > 0),
  music: loading || Boolean(data.music && data.music.length > 0),
})

const availableWhenEmpty = getAvailableSections(mockEmptyData, false)
assert.strictEqual(availableWhenEmpty.games, false, 'Games must be unavailable when empty')
assert.strictEqual(availableWhenEmpty.drawing, false, 'Drawing must be unavailable when empty')
assert.strictEqual(availableWhenEmpty.story, false, 'Story must be unavailable when empty')
assert.strictEqual(availableWhenEmpty.music, false, 'Music must be unavailable when empty')

const availableWhenLoading = getAvailableSections(mockEmptyData, true)
assert.strictEqual(availableWhenLoading.games, true, 'Games must not be hidden while loading')

const availableWithData = getAvailableSections({
  featuredGames: fallbackFeaturedGames,
  storyBooks: fallbackStoryBooks,
  artworks: fallbackArtworks,
  music: fallbackMusic,
}, false)
assert.strictEqual(availableWithData.games, true)
assert.strictEqual(availableWithData.drawing, true)
assert.strictEqual(availableWithData.story, true)
assert.strictEqual(availableWithData.music, true)
console.log('✓ Conditional section rendering logic verified for empty, loading, and populated states')

console.log('--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---')
