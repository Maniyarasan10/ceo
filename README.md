# Creative Developer Portfolio

React + Vite + GSAP (ScrollTrigger) + Lenis + Three.js. No Tailwind: plain CSS with variables.

## Run
    npm install
    npm run dev          # local dev
    npm run build        # production build -> dist/
    npm run build:single # one self-contained HTML file -> dist-single/index.html

## Make it yours (all content lives in src/data)
- profile.js     name, initials, role, company, email, social links, nav items
- projects.js    the four case studies (copy, stack, role, focus, hidden-layer text) + product images
- skills.js, experience.js, services.js
- Product images: src/assets/products/ (imported in projects.js, converted to webp)

## Where things are
- animations/    heroAnimations, scrollAnimations, cursorAnimations, pageTransitions
- hooks/         useLenis, useMediaQuery, useReducedMotion, useReveal
- components/    one folder per section, each with its own CSS
- Accent colour: --accent in src/styles/variables.css
