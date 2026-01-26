module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Only run PurgeCSS in production to speed up development
    // Note: Tailwind CSS v3+ already purges unused CSS automatically.
    // PurgeCSS here provides additional optimization for custom CSS files.
    // Using styles.pure.css as reference for what CSS is actually used.
    ...(process.env.NODE_ENV === 'production' ? {
      '@fullhuman/postcss-purgecss': {
        content: [
          './app/**/*.{js,jsx,ts,tsx,mdx}',
          './components/**/*.{js,jsx,ts,tsx,mdx}',
          './pages/**/*.{js,jsx,ts,tsx,mdx}',
          './src/**/*.{js,jsx,ts,tsx,mdx}',
        ],
        // Safelist: Keep these classes even if not found in content
        // Based on styles.pure.css reference - these are the classes actually used
        safelist: {
          // Keep only essential slick-carousel classes (dynamically loaded components)
          standard: [
            /^slick-(list|dots|slider|prev|next|active)$/,
            // Keep only actually used custom classes
            /^carousel-card$/,
            /^center-card$/,
            // Keep custom utility classes from globals.css that are actually used
            /^no-scrollbar$/,
            /^formtwo$/,
            /^cus-(img|div)$/,
          ],
          // Keep classes with these patterns
          deep: [
            /^slick-/,
            /slick$/,
            // Keep Tailwind utility patterns
            /^[a-z]+:/,
            // Keep arbitrary value classes
            /\[.*?\]/,
          ],
          // Keep keyframes, media queries, and other at-rules
          greedy: [
            /^@keyframes/,
            /^@media/,
            /^@supports/,
            /^@font-face/,
            /^@layer/,
          ],
        },
        // Enhanced extractor to match Tailwind's class detection
        defaultExtractor: (content) => {
          // Extract class names from className attributes (JSX/TSX)
          const classNameMatches = content.match(/className=["'`]([^"'`]+)["'`]/g) || [];
          const classNameExtracted = classNameMatches
            .map(match => {
              const classes = match.replace(/className=["'`]|["'`]/g, '');
              return classes.split(/\s+/);
            })
            .flat();
          
          // Extract classes from template literals with className
          const templateMatches = content.match(/className=\{`([^`]+)`\}/g) || [];
          const templateExtracted = templateMatches
            .map(match => {
              const classes = match.replace(/className=\{`|`\}/g, '');
              return classes.split(/\s+/);
            })
            .flat();
          
          // Extract classes from class attributes (HTML)
          const classMatches = content.match(/class=["']([^"']+)["']/g) || [];
          const classExtracted = classMatches
            .map(match => {
              const classes = match.replace(/class=["']|["']/g, '');
              return classes.split(/\s+/);
            })
            .flat();
          
          // Extract Tailwind-like utility classes (including variants)
          const utilityClasses = content.match(/\b([a-z]+(?:-[a-z0-9]+)*(?::[a-z-]+)?)\b/g) || [];
          
          // Combine all extracted classes and remove duplicates
          const allClasses = [
            ...classNameExtracted,
            ...templateExtracted,
            ...classExtracted,
            ...utilityClasses,
          ];
          
          // Return unique classes
          return [...new Set(allClasses)].filter(Boolean);
        },
        // Don't purge CSS variables, keyframes, or font-face
        variables: true,
        keyframes: true,
        fontFace: true,
      },
    } : {}),
  },
};
