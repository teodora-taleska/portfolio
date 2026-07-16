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

## Environment variables

Required in `.env` (Vite exposes these via `import.meta.env`):
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase project for reactions/clicks
- `VITE_WEB3FORMS_KEY` — Web3Forms access key used in `BlogPost.jsx` for blog feedback submissions

`VITE_WEB3FORMS_KEY` is also used in `ContactForm.jsx` for the main contact form submission.

## Architecture

**SPA with client-side routing** — React 19 + Vite + Tailwind CSS + React Router v7. Anchor-link navigation (`#projects`, `#experience`, etc.) with CSS smooth scrolling handles in-page sections; React Router handles the `/blogs` and `/blogs/:slug` routes.

### Routes

- `/` → `src/pages/Home.jsx` — composes all portfolio sections: Navbar → Hero → Projects → Experience → BlogSection → Certificates → Education → ContactForm → Footer
- `/blogs` → `src/pages/Blogs.jsx` — blog listing (stub, not yet implemented)
- `/blogs/:slug` → `src/pages/BlogPost.jsx` — full blog post page with reactions and a Web3Forms feedback form

### Data

Static data lives in `public/data/` as plain JS modules (imported directly, not fetched):
- `projects.js` — array of projects, each with `id`, `title`, `desc`, `github?`, `youtube?`, `web?`, `tech[]`, and interaction fields (`likes`, `dislikes`, `clicks`, `userReaction`)
- `blogs.js` — array of blog posts with `id`, `title`, `body`, `date`, `keywords[]`, `link`, `image?`

### Persistence

Reactions (likes/dislikes) and click counts are stored in **Supabase** (`reactions` table, keyed by `id`). `src/lib/supabase.js` exposes `getReactions(id)` and `saveReactions(id, type, patch)`. The user's own reaction choice is also mirrored to `localStorage` to avoid double-voting across page loads.

### Key component behaviors

- **Projects.jsx** — Paginated (3 per page), initialises from `projects.js`, syncs counts from Supabase on mount, persists user reactions to localStorage. Touch-swipe enabled.
- **ExperienceSection.jsx + CodeToAppAnimation.jsx** — Scroll-triggered animation using Framer Motion `useScroll`/`useTransform`.
- **EducationSection.jsx** — Opens PDF files from `public/language/` in inline modals.
- **ContactForm.jsx** — Sends email via Web3Forms (`VITE_WEB3FORMS_KEY`), same service as the blog feedback form.
- **NeuralBackground.jsx / CursorLight.jsx / FloatingWords.jsx** — Visual effects in the Hero area; no side effects outside the DOM.

### Styling conventions

Dark theme throughout: `#0B132B` background, `#1C2541` cards, `#D4AF37` gold accent, `#5BC0BE` cyan accent. All styling is Tailwind utility classes; `src/index.css` only contains the Tailwind directives and `scroll-behavior: smooth`.

### Static assets

- `public/certificates/` — certificate images referenced by `Certificates.jsx`
- `public/icons/` — SVG/PNG icons used across components
- `public/language/` — PDF files for education section
- `public/profile.png` — Hero profile photo
