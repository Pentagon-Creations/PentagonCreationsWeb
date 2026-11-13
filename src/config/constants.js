// =========================================================================
// PENTAGON CREATIONS - APPLICATION CONSTANTS & CONFIGURATION
// =========================================================================

/**
 * Maximum number of artwork items displayed on the homepage Drawing Art section.
 * When the available artworks exceed this limit, a "Show More" button is rendered,
 * directing the user to the dedicated gallery page containing all artworks.
 */
export const HOME_GALLERY_LIMIT = 8

/**
 * Path to the logo GIF displayed on loading screens.
 */
export const BOOK_LOADING_GIF_PATH = `${import.meta.env.BASE_URL}assets/pentashuriken-logo-anim.gif`

/**
 * Minimum display duration (in milliseconds) for the book loading screen animation.
 * The reading page will only be revealed after BOTH this duration has elapsed AND
 * the book data fetching has completed.
 */
export const MIN_GIF_DURATION_MS = 1800

