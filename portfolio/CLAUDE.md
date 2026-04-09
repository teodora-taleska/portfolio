# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint (flat config, React hooks plugin)
```

No test suite is configured.

## Architecture

**Single Page Application** — React 19 + Vite + Tailwind CSS. No routing library; navigation uses anchor links (`#projects`, `#experience`, etc.) with CSS smooth scrolling.

### Page structure

`src/pages/Home.jsx` is the entire app. It composes sections in order: Navbar → Hero → Projects → Experience → BlogSection → Certificates → Education → ContactForm → Footer.

`src/pages/Blogs.jsx` is a stub (not yet implemented).

### Data

Static data lives in `public/data/` as plain JS modules:
- `projects.js` — array of 13 projects, each with `id`, `title`, `desc`, `github`, `youtube?`, `tech[]`, and mutable interaction fields (`likes`, `dislikes`, `clicks`, `userReaction`)
- `blogs.js` — array of 8 blog posts with `id`, `title`, `body`, `date`, `keywords[]`, `link`

These files are served as static assets (not bundled), so they're fetched at runtime. Project interaction state (likes/dislikes/reactions) is persisted to `localStorage`.

### Key component behaviors

- **Projects.jsx** — Paginated (3 per page), loads data from `public/data/projects.js` via fetch, persists reactions to localStorage.
- **ExperienceSection.jsx + CodeToAppAnimation.jsx** — Scroll-triggered animation using Framer Motion `useScroll`/`useTransform`.
- **EducationSection.jsx** — Opens PDF files from `public/language/` in inline modals.
- **ContactForm.jsx** — Sends email via EmailJS; credentials are in the component (public keys only).
- **NeuralBackground.jsx / CursorLight.jsx / FloatingWords.jsx** — Visual effects in the Hero area; no side effects outside the DOM.

### Styling conventions

Dark theme throughout: `#0B132B` background, `#1C2541` cards, `#D4AF37` gold accent, `#5BC0BE` cyan accent. All styling is Tailwind utility classes; `src/index.css` only contains the Tailwind directives and `scroll-behavior: smooth`.

### Static assets

- `public/certificates/` — certificate images referenced by `Certificates.jsx`
- `public/icons/` — SVG/PNG icons used across components
- `public/language/` — PDF files for education section
- `public/profile.png` — Hero profile photo
