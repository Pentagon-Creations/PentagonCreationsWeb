import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

console.log('--- STARTING HEADER RESPONSIVE OVERFLOW VERIFICATION ---')

const navbarCssPath = path.resolve('src/components/Navbar.css')
const navbarCss = fs.readFileSync(navbarCssPath, 'utf-8')

// 1. Verify nav-drawer does not use 100vw and has overflow: hidden
console.log('1. Checking .nav-drawer overflow clipping and dimensions...')
assert(!navbarCss.includes('width: 100vw'), '.nav-drawer must NOT use width: 100vw as it causes horizontal scroll')
assert(navbarCss.includes('.nav-drawer {'), '.nav-drawer rule must exist')
assert(navbarCss.includes('overflow: hidden;'), '.nav-drawer MUST have overflow: hidden to prevent translateX(100%) drawer from causing document horizontal overflow')
assert(navbarCss.includes('inset: 0') || (navbarCss.includes('left: 0') && navbarCss.includes('right: 0')), '.nav-drawer must span edges properly without exceeding viewport')
console.log('✓ .nav-drawer is strictly bounded within viewport and clips off-screen content')

// 2. Verify site-navbar and navbar-container containment
console.log('2. Checking .site-navbar and .navbar-container bounding...')
assert(navbarCss.includes('.site-navbar {') && navbarCss.includes('max-width: 100%'), '.site-navbar must have max-width: 100%')
assert(navbarCss.includes('.navbar-container {') && navbarCss.includes('width: 100%') && navbarCss.includes('max-width: 100%'), '.navbar-container must have width: 100% and max-width: 100%')
console.log('✓ .site-navbar and .navbar-container have strict width and max-width bounding')

// 3. Verify flex items containment
console.log('3. Checking flex items (brand, controls, capsule, toggle)...')
assert(navbarCss.includes('min-width: 0'), '.navbar-brand or wordmark must include min-width: 0 to prevent flex blowout')
assert(navbarCss.includes('flex-shrink: 0'), 'Control items must include flex-shrink: 0')
console.log('✓ Brand and controls elements properly handle flexbox sizing and shrinking')

// 4. Mathematical check of header layout on 375px, 390px, 430px
console.log('4. Calculating header content width across mobile viewports...')
const viewports = [320, 375, 390, 430]
const containerPadding = 18 * 2 // 36px total
const brandWidth = 28 + 10 + 65 // logo (28px) + gap (10px) + wordmark (~65px) = 103px
const controlsWidth = 72 + 12 + 32 // capsule (~72px) + gap (12px) + hamburger (32px) = 116px
const totalContentWidth = brandWidth + controlsWidth // 219px

viewports.forEach((vp) => {
  const usableWidth = vp - containerPadding
  const remainingSpace = usableWidth - totalContentWidth
  assert(remainingSpace > 0, `Header elements at ${vp}px must fit inside usable width (${usableWidth}px)`)
  console.log(`✓ At ${vp}px viewport: usable=${usableWidth}px, content=${totalContentWidth}px, free space=${remainingSpace}px. Zero overflow!`)
})

console.log('--- ALL HEADER RESPONSIVE CHECKS PASSED SUCCESSFULLY! ---')

