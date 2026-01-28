module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Only run PurgeCSS in production to speed up development
    // Note: Tailwind CSS v3+ already purges unused CSS automatically.
    // PurgeCSS here provides additional optimization for custom CSS files.
    ...(process.env.NODE_ENV === 'production' ? {
      '@fullhuman/postcss-purgecss': {
        content: [
          './app/**/*.{js,jsx,ts,tsx,mdx}',
          './components/**/*.{js,jsx,ts,tsx,mdx}',
          './pages/**/*.{js,jsx,ts,tsx,mdx}',
        ],
        // Safelist: Keep these classes even if not found in content
        safelist: {
          // Keep all Tailwind utility classes (Tailwind already purges these, but be safe)
          standard: [
            // Keep all slick-carousel classes (dynamically loaded)
            /^slick-/,
            /^slick$/,
            /\.slick-/,
            // Keep dynamically generated classes
            /^carousel-/,
            /^center-card$/,
            /^samplesSlider$/,
            /^sampleCard$/,
            /^samplesWrap$/,
            /^customerReviewsWrap$/,
            /^customerReviewsCard/,
            /^testimonials$/,
            // Keep animation classes
            /^animate-/,
            // Keep dark mode classes if used
            /^dark:/,
            // Keep Tailwind responsive variants
            /^(sm|md|lg|xl|2xl):/,
            // Keep hover/focus states
            /^(hover|focus|active|disabled):/,
          ],
          // Keep classes with these patterns
          deep: [
            /^slick-/,
            /slick$/,
            // Keep Tailwind classes
            /^[a-z]+:/,
          ],
          // Keep keyframes and important CSS
          greedy: [
            /^@keyframes/,
            /^@media/,
            /^@supports/,
          ],
        },
        // Default extractor for most cases
        defaultExtractor: (content) => {
          // Match class names, IDs, and custom selectors
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
          const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
          return broadMatches.concat(innerMatches);
        },
        // Don't purge CSS variables
        variables: true,
      },
    } : {}),
  },
};
