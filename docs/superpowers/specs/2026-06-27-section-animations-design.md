# Section Animations & Visual Polish — Design Spec
**Date:** 2026-06-27

## Overview

Add consistent scroll-reveal entrance animations, animated gold heading accents, and drifting background circle outlines to all post-hero sections. Goal: make the page feel intentional, alive, and polished without being distracting.

## Components

### 1. ScrollReveal (`src/components/ScrollReveal.jsx`)

A reusable Framer Motion wrapper that triggers a fade + slide animation when its children enter the viewport.

**Props:**
- `children` — content to animate
- `delay` — number in seconds, default `0` (used for staggering)
- `direction` — `'up'` | `'left'` | `'right'`, default `'up'`
- `className` — passed through to the wrapper `<motion.div>`

**Behavior:**
- Initial: `opacity: 0`, offset 40px in the chosen direction
- Animate: `opacity: 1`, offset back to 0
- Trigger: `whileInView`, `viewport={{ once: true, margin: "-60px" }}`
- Transition: `duration: 0.6`, `ease: "easeOut"`

### 2. GoldAccent (inline, not a separate component)

Each section heading gets a short animated gold underline bar rendered as a `<motion.div>` immediately below the `<h3>` / `<h2>` title:

```jsx
<motion.div
  initial={{ scaleX: 0 }}
  whileInView={{ scaleX: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
  style={{ originX: 0 }}
  className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-4"
/>
```

### 3. BackgroundCircles (`src/components/BackgroundCircles.jsx`)

Drifting large circle outlines rendered as an absolutely-positioned overlay inside the same `<div className="relative">` wrapper in `Home.jsx` that contains `FloatingBlobs`.

**Circles:**
- 4 circles total
- Shapes: `border-radius: 50%`, `border: 1px solid rgba(247,231,206,0.06)`, no fill
- Sizes: 700px, 500px, 600px, 400px
- Positions: spread across the page so they overlap different sections
- Animation: slow drift with subtle scale breathing, CSS keyframes, each at different speed (25s, 32s, 20s, 28s)
- `pointer-events: none`, `z-index: 0`
- Hidden in light mode (`[data-theme="light"] .bg-circle { display: none }`)

## Per-Section Changes

### Projects (`src/components/Projects.jsx`)
- Wrap left column (heading + description `<div className="md:w-1/3">`) in `<ScrollReveal direction="left">`
- Add GoldAccent below `<h3>PROJECTS</h3>`

### Experience (`src/components/ExperienceSection.jsx`)
- Wrap heading in `<ScrollReveal>`
- Add GoldAccent below `<h3>EXPERIENCE</h3>`
- Wrap each experience card `<div>` in `<ScrollReveal delay={i * 0.15}>`
- Add hover glow to experience cards: `whileHover={{ scale: 1.02, y: -2 }}` + `transition-shadow` class + `hover:shadow-2xl` (to match Projects/Blog cards)

### BlogSection (`src/components/BlogSection.jsx`)
- Wrap left column (heading + description `<div className="md:w-1/3">`) in `<ScrollReveal direction="left">`
- Add GoldAccent below `<h3>BLOGS</h3>`

### Certificates (`src/components/Certificates.jsx`)
- Wrap `<h2>CERTIFICATES</h2>` and GoldAccent in `<ScrollReveal>`

### Education (`src/components/EducationSection.jsx`)
- Wrap `<h3>EDUCATION</h3>` and GoldAccent in `<ScrollReveal>`
- Cards already use `whileInView` individually — leave those unchanged

### ContactForm (`src/components/ContactForm.jsx`)
- Wrap the entire form container in `<ScrollReveal>`
- Add section heading (e.g. `<h3>GET IN TOUCH</h3>`) with GoldAccent if one doesn't already exist

### Footer (`src/components/Footer.jsx`)
- Wrap entire footer content in `<ScrollReveal>` with `delay: 0.1`

## Background Circles CSS (`src/index.css`)

```css
.bg-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(247, 231, 206, 0.06);
  pointer-events: none;
}
.circle-1 { width: 700px; height: 700px; top: 3%; left: -20%; animation: circle-drift-1 25s ease-in-out infinite; }
.circle-2 { width: 500px; height: 500px; top: 30%; right: -15%; animation: circle-drift-2 32s ease-in-out infinite; }
.circle-3 { width: 600px; height: 600px; top: 58%; left: 10%; animation: circle-drift-3 20s ease-in-out infinite; }
.circle-4 { width: 400px; height: 400px; top: 78%; right: 5%; animation: circle-drift-4 28s ease-in-out infinite; }

@keyframes circle-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(50px, -40px) scale(1.05); }
  66%       { transform: translate(-30px, 60px) scale(0.97); }
}
@keyframes circle-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(-60px, 40px) scale(0.95); }
  66%       { transform: translate(40px, -50px) scale(1.04); }
}
@keyframes circle-drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(40px, -30px) scale(1.06); }
}
@keyframes circle-drift-4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(-40px, -30px) scale(1.03); }
  66%       { transform: translate(30px, 40px) scale(0.96); }
}
[data-theme="light"] .bg-circle { display: none; }
```

## Files to Change

| File | Change |
|---|---|
| `src/components/ScrollReveal.jsx` | Create |
| `src/components/BackgroundCircles.jsx` | Create |
| `src/index.css` | Add `.bg-circle` + keyframes |
| `src/pages/Home.jsx` | Add `<BackgroundCircles />` inside the relative wrapper |
| `src/components/Projects.jsx` | ScrollReveal on left column, GoldAccent |
| `src/components/ExperienceSection.jsx` | ScrollReveal, GoldAccent, card hover glow |
| `src/components/BlogSection.jsx` | ScrollReveal on left column, GoldAccent |
| `src/components/Certificates.jsx` | ScrollReveal on heading, GoldAccent |
| `src/components/EducationSection.jsx` | ScrollReveal on heading, GoldAccent |
| `src/components/ContactForm.jsx` | ScrollReveal on form, GoldAccent on heading |
| `src/components/Footer.jsx` | ScrollReveal fade-in |
