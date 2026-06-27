# Section Animations & Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add consistent scroll-reveal entrance animations, animated gold heading accents, and drifting background circle outlines to all post-hero sections.

**Architecture:** A shared `ScrollReveal` wrapper (Framer Motion `whileInView`) is imported by each section component. A `GoldAccent` bar is added inline below each heading. `BackgroundCircles` adds 4 drifting circle outlines as a second background layer alongside the existing `FloatingBlobs`. No new dependencies — Framer Motion is already installed.

**Tech Stack:** React 19, Framer Motion, Tailwind CSS, CSS keyframes

---

## Files

| File | Action |
|---|---|
| `portfolio/src/components/ScrollReveal.jsx` | Create |
| `portfolio/src/components/BackgroundCircles.jsx` | Create |
| `portfolio/src/index.css` | Add `.bg-circle` styles + keyframes |
| `portfolio/src/pages/Home.jsx` | Add `<BackgroundCircles />` inside relative wrapper |
| `portfolio/src/components/Projects.jsx` | ScrollReveal on left column + GoldAccent |
| `portfolio/src/components/ExperienceSection.jsx` | ScrollReveal + GoldAccent + card hover glow |
| `portfolio/src/components/BlogSection.jsx` | ScrollReveal on left column + GoldAccent |
| `portfolio/src/components/Certificates.jsx` | ScrollReveal on heading + GoldAccent |
| `portfolio/src/components/EducationSection.jsx` | ScrollReveal on heading + GoldAccent |
| `portfolio/src/components/ContactForm.jsx` | Fix form to whileInView + GoldAccent on heading |
| `portfolio/src/components/Footer.jsx` | ScrollReveal fade-in |

---

### Task 1: Create ScrollReveal component

**Files:**
- Create: `portfolio/src/components/ScrollReveal.jsx`

- [ ] **Step 1: Create the file**

```jsx
import { motion } from "framer-motion";

const variants = {
  up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
};

export default function ScrollReveal({ children, delay = 0, direction = "up", className = "" }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      variants={variants[direction]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify the file exists and has no syntax errors**

Run: `npm run build` from `portfolio/`
Expected: build completes with no errors (chunk size warning is pre-existing, ignore it)

- [ ] **Step 3: Commit**

```bash
git add portfolio/src/components/ScrollReveal.jsx
git commit -m "feat: add ScrollReveal component for scroll-triggered animations"
```

---

### Task 2: Create BackgroundCircles component, add CSS, wire into Home.jsx

**Files:**
- Create: `portfolio/src/components/BackgroundCircles.jsx`
- Modify: `portfolio/src/index.css`
- Modify: `portfolio/src/pages/Home.jsx`

- [ ] **Step 1: Create BackgroundCircles.jsx**

```jsx
export default function BackgroundCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="bg-circle circle-1" />
      <div className="bg-circle circle-2" />
      <div className="bg-circle circle-3" />
      <div className="bg-circle circle-4" />
    </div>
  );
}
```

- [ ] **Step 2: Add CSS to index.css**

In `portfolio/src/index.css`, after the existing `/* ── Champagne floating blobs ── */` block and before `/* ── Icon helper ── */`, add:

```css
/* ── Background drifting circles ───────────────────────────── */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(247, 231, 206, 0.06);
  pointer-events: none;
}
.circle-1 { width: 700px; height: 700px; top: 3%;  left: -20%; animation: circle-drift-1 25s ease-in-out infinite; }
.circle-2 { width: 500px; height: 500px; top: 30%; right: -15%; animation: circle-drift-2 32s ease-in-out infinite; }
.circle-3 { width: 600px; height: 600px; top: 58%; left: 10%;  animation: circle-drift-3 20s ease-in-out infinite; }
.circle-4 { width: 400px; height: 400px; top: 78%; right: 5%;  animation: circle-drift-4 28s ease-in-out infinite; }
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

- [ ] **Step 3: Add BackgroundCircles to Home.jsx**

In `portfolio/src/pages/Home.jsx`, add the import at the top:

```jsx
import BackgroundCircles from "../components/BackgroundCircles.jsx";
```

Then inside the `<div className="relative">` wrapper (which already contains `<FloatingBlobs />`), add `<BackgroundCircles />` right after `<FloatingBlobs />`:

```jsx
<div className="relative">
  <FloatingBlobs />
  <BackgroundCircles />
  <Projects />
  <ExperienceSection />
  {/*<LanguagesSection/>*/}
  <BlogSection blogs={blogs} />
  <Certificates />
  <EducationSection />
  <ContactForm />
  <Footer />
</div>
```

- [ ] **Step 4: Verify in browser**

Run `npm run dev` from `portfolio/`. Scroll below the hero — you should see faint large circle outlines slowly drifting in the background behind the sections. They should be very subtle (barely visible).

- [ ] **Step 5: Commit**

```bash
git add portfolio/src/components/BackgroundCircles.jsx portfolio/src/index.css portfolio/src/pages/Home.jsx
git commit -m "feat: add drifting background circle outlines to post-hero sections"
```

---

### Task 3: Animate Projects left column

**Files:**
- Modify: `portfolio/src/components/Projects.jsx`

- [ ] **Step 1: Add ScrollReveal import**

At the top of `portfolio/src/components/Projects.jsx`, add:

```jsx
import ScrollReveal from "./ScrollReveal.jsx";
```

- [ ] **Step 2: Replace the left column div with ScrollReveal + GoldAccent**

Find the left column block (currently `<div className="md:w-1/3">`):

```jsx
{/* LEFT */}
<div className="md:w-1/3">
  <h3 className="text-4xl text-[#D4AF37] font-bold mb-4">PROJECTS</h3>
  <p className="text-th-fg/80">
    A selection of projects where I combine data science, machine learning,
    and software engineering to build real-world systems.
  </p>
</div>
```

Replace with:

```jsx
{/* LEFT */}
<ScrollReveal direction="left" className="md:w-1/3">
  <h3 className="text-4xl text-[#D4AF37] font-bold mb-2">PROJECTS</h3>
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    style={{ originX: 0 }}
    className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-4"
  />
  <p className="text-th-fg/80">
    A selection of projects where I combine data science, machine learning,
    and software engineering to build real-world systems.
  </p>
</ScrollReveal>
```

Note: `motion` is already imported in this file — no need to add it.

- [ ] **Step 3: Verify in browser**

Reload the page. Scroll to the Projects section — the heading and description should slide in from the left. A short gold bar should animate left-to-right under "PROJECTS".

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/components/Projects.jsx
git commit -m "feat: add scroll-reveal and gold accent to Projects section"
```

---

### Task 4: Animate ExperienceSection

**Files:**
- Modify: `portfolio/src/components/ExperienceSection.jsx`

- [ ] **Step 1: Add imports**

At the top of `portfolio/src/components/ExperienceSection.jsx`, replace the existing import line:

```jsx
import { useRef } from "react";
import CodeToAppAnimation from "./CodeToAppAnimation.jsx";
```

With:

```jsx
import { useRef } from "react";
import { motion } from "framer-motion";
import CodeToAppAnimation from "./CodeToAppAnimation.jsx";
import ScrollReveal from "./ScrollReveal.jsx";
```

- [ ] **Step 2: Replace heading with ScrollReveal + GoldAccent**

Find:

```jsx
<div className="flex-1">
  <h3 className="text-4xl font-bold mb-10 text-[#D4AF37]">EXPERIENCE</h3>
  <div className="space-y-6">
```

Replace with:

```jsx
<div className="flex-1">
  <ScrollReveal direction="left">
    <h3 className="text-4xl font-bold mb-2 text-[#D4AF37]">EXPERIENCE</h3>
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      style={{ originX: 0 }}
      className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-10"
    />
  </ScrollReveal>
  <div className="space-y-6">
```

- [ ] **Step 3: Add scroll-reveal and hover glow to experience cards**

Find the experience card `<div>`:

```jsx
{experiences.map((exp, i) => (
  <div key={i} className="bg-th-card p-6 rounded-xl shadow-lg card-bordered">
    <h4 className="text-xl font-semibold">{exp.role}</h4>
```

Replace with:

```jsx
{experiences.map((exp, i) => (
  <ScrollReveal key={i} delay={i * 0.15}>
    <motion.div
      className="bg-th-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 card-bordered"
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <h4 className="text-xl font-semibold">{exp.role}</h4>
```

And close both the `</motion.div>` and `</ScrollReveal>` at the end of the card (where `</div>` currently closes the card):

```jsx
    </motion.div>
  </ScrollReveal>
))}
```

- [ ] **Step 4: Verify in browser**

Scroll to the Experience section. The "EXPERIENCE" heading should slide in from the left with a gold accent bar. The experience card should fade up and have a hover scale effect matching the Projects cards.

- [ ] **Step 5: Commit**

```bash
git add portfolio/src/components/ExperienceSection.jsx
git commit -m "feat: add scroll-reveal, gold accent and hover glow to Experience section"
```

---

### Task 5: Animate BlogSection left column

**Files:**
- Modify: `portfolio/src/components/BlogSection.jsx`

- [ ] **Step 1: Add ScrollReveal import**

At the top of `portfolio/src/components/BlogSection.jsx`, add:

```jsx
import ScrollReveal from "./ScrollReveal.jsx";
```

- [ ] **Step 2: Replace the left column div with ScrollReveal + GoldAccent**

Find:

```jsx
{/* LEFT */}
<div className="md:w-1/3">
  <h3 className="text-4xl text-[#FFD166] font-bold mb-4">BLOGS</h3>
  <p className="text-th-fg/80">
    Thoughts on AI, data systems, and software. From concepts I'm exploring to honest opinions shaped by real experience building things.
  </p>
</div>
```

Replace with:

```jsx
{/* LEFT */}
<ScrollReveal direction="left" className="md:w-1/3">
  <h3 className="text-4xl text-[#FFD166] font-bold mb-2">BLOGS</h3>
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    style={{ originX: 0 }}
    className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-4"
  />
  <p className="text-th-fg/80">
    Thoughts on AI, data systems, and software. From concepts I'm exploring to honest opinions shaped by real experience building things.
  </p>
</ScrollReveal>
```

Note: `motion` is already imported in this file.

- [ ] **Step 3: Verify in browser**

Scroll to the Blogs section. The "BLOGS" heading and description should slide in from the left with a gold accent bar.

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/components/BlogSection.jsx
git commit -m "feat: add scroll-reveal and gold accent to BlogSection"
```

---

### Task 6: Animate Certificates heading

**Files:**
- Modify: `portfolio/src/components/Certificates.jsx`

- [ ] **Step 1: Add ScrollReveal import**

At the top of `portfolio/src/components/Certificates.jsx`, add:

```jsx
import ScrollReveal from "./ScrollReveal.jsx";
```

- [ ] **Step 2: Wrap the heading in ScrollReveal + GoldAccent**

Find:

```jsx
<h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-4">
  CERTIFICATES
</h2>
```

Replace with:

```jsx
<ScrollReveal className="flex flex-col items-center">
  <h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-2">
    CERTIFICATES
  </h2>
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    style={{ originX: 0.5 }}
    className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-4"
  />
</ScrollReveal>
```

Note: `motion` is already imported in this file.

- [ ] **Step 3: Verify in browser**

Scroll to Certificates. The heading should fade up and the gold bar should animate from center outward.

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/components/Certificates.jsx
git commit -m "feat: add scroll-reveal and gold accent to Certificates section"
```

---

### Task 7: Animate Education heading

**Files:**
- Modify: `portfolio/src/components/EducationSection.jsx`

- [ ] **Step 1: Add ScrollReveal import**

At the top of `portfolio/src/components/EducationSection.jsx`, add:

```jsx
import ScrollReveal from "./ScrollReveal.jsx";
```

- [ ] **Step 2: Replace the heading with ScrollReveal + GoldAccent**

Find:

```jsx
<h3 className="text-4xl font-bold mb-16 text-center text-[#D4AF37]">EDUCATION</h3>
```

Replace with:

```jsx
<ScrollReveal className="flex flex-col items-center">
  <h3 className="text-4xl font-bold mb-2 text-center text-[#D4AF37]">EDUCATION</h3>
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    style={{ originX: 0.5 }}
    className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-14"
  />
</ScrollReveal>
```

Note: `motion` is already imported in this file. The `mb-14` on the GoldAccent replaces the original `mb-16` on the heading to preserve the same visual spacing.

- [ ] **Step 3: Verify in browser**

Scroll to Education. The heading fades up, the gold bar animates from center. The individual education cards still animate independently (unchanged).

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/components/EducationSection.jsx
git commit -m "feat: add scroll-reveal and gold accent to Education section"
```

---

### Task 8: Fix ContactForm animation and add GoldAccent

**Files:**
- Modify: `portfolio/src/components/ContactForm.jsx`

- [ ] **Step 1: Add ScrollReveal import**

At the top of `portfolio/src/components/ContactForm.jsx`, add:

```jsx
import ScrollReveal from "./ScrollReveal.jsx";
```

- [ ] **Step 2: Wrap heading + subtitle in ScrollReveal + GoldAccent**

Find:

```jsx
<h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-6">
  CONTACT
</h2>
<p className="text-center text-th-body mb-10">
  Share your ideas, feedback, or collaboration proposals. I'll get back to you!
</p>
```

Replace with:

```jsx
<ScrollReveal className="flex flex-col items-center">
  <h2 className="text-4xl text-[#D4AF37] font-bold text-center mb-2">
    CONTACT
  </h2>
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    style={{ originX: 0.5 }}
    className="h-[2px] w-12 bg-[#D4AF37] mt-2 mb-6"
  />
  <p className="text-center text-th-body mb-10">
    Share your ideas, feedback, or collaboration proposals. I'll get back to you!
  </p>
</ScrollReveal>
```

- [ ] **Step 3: Fix the form animation to fire on scroll not on load**

Find the `<motion.form>` props:

```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

Replace with:

```jsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5, delay: 0.1 }}
```

- [ ] **Step 4: Verify in browser**

Scroll to Contact. The heading fades up with gold accent. The form fades up shortly after when it enters the viewport (not on page load).

- [ ] **Step 5: Commit**

```bash
git add portfolio/src/components/ContactForm.jsx
git commit -m "feat: add scroll-reveal, gold accent and fix form animation in Contact section"
```

---

### Task 9: Animate Footer

**Files:**
- Modify: `portfolio/src/components/Footer.jsx`

- [ ] **Step 1: Add ScrollReveal import**

At the top of `portfolio/src/components/Footer.jsx`, add:

```jsx
import ScrollReveal from "../components/ScrollReveal.jsx";
```

Wait — Footer is at `src/components/Footer.jsx`, so the import path is:

```jsx
import ScrollReveal from "./ScrollReveal.jsx";
```

- [ ] **Step 2: Wrap footer content in ScrollReveal**

Find the inner content of the `<footer>`:

```jsx
<footer className="bg-th-bg text-th-fg py-10 px-6 text-center">
  <div className="flex justify-center gap-6 mb-4">
    ...
  </div>
  <p className="text-th-body text-sm">
    © {new Date().getFullYear()} Teodora Taleska. All rights reserved.
  </p>
</footer>
```

The full updated footer — keep all SVG icon content exactly as-is, just wrap the inner content:

```jsx
<footer className="bg-th-bg text-th-fg py-10 px-6 text-center">
  <ScrollReveal delay={0.1}>
    <div className="flex justify-center gap-6 mb-4">
      {/* LinkedIn */}
      <a href="https://www.linkedin.com/in/teodora-taleska-b5305422b/" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5V24H0V8zm7.5 0h4.8v2.1h.1c.7-1.3 2.4-2.6 4.9-2.6 5.2 0 6.2 3.4 6.2 7.8V24h-5v-7c0-1.7 0-3.9-2.4-3.9-2.4 0-2.7 1.8-2.7 3.8V24h-5V8z"/>
        </svg>
      </a>
      {/* GitHub */}
      <a href="https://github.com/teodora-taleska" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.74-1.34-1.74-1.09-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
      {/* Blog */}
      <a href="/blogs" className="hover:text-[#D4AF37] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 4v16h18V4H3zm16 14H5V6h14v12zm-7-2h5v-2h-5v2zm0-4h5v-2h-5v2zm-7 4h5v-2H5v2zm0-4h5v-2H5v2z"/>
        </svg>
      </a>
    </div>
    <p className="text-th-body text-sm">
      © {new Date().getFullYear()} Teodora Taleska. All rights reserved.
    </p>
  </ScrollReveal>
</footer>
```

- [ ] **Step 3: Verify in browser**

Scroll to the bottom. The footer icons and copyright text should gently fade up into view.

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/components/Footer.jsx
git commit -m "feat: add scroll-reveal fade-in to Footer"
```
