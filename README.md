# Teodora Taleska's Portfolio

A personal portfolio website showcasing my work in **Data Science, AI, and software engineering**. Built with **React 19**, **Vite**, **TailwindCSS**, and **Framer Motion**.

**Live site:** [teodorataleska.vercel.app](https://teodorataleska.vercel.app)

---

## Sections

- **Hero**: Animated intro with floating keywords and scroll-triggered bio
- **Projects**: Paginated project cards with likes, dislikes, and link tracking (backed by Supabase)
- **Experience**: Work history with a scroll-triggered code-to-app animation
- **Blogs**: Paginated blog previews with reactions; full posts on dedicated pages
- **Certificates**: Coverflow carousel with keyboard, trackpad, and touch swipe support
- **Education**: Timeline with inline PDF viewer for language certificates and thesis
- **Contact**: Email form powered by EmailJS (no backend required)

---

## Tech Stack

| Layer      | Tools                              |
|------------|------------------------------------|
| Frontend   | React 19, Vite, TailwindCSS        |
| Animations | Framer Motion                      |
| Database   | Supabase (reactions & click counts)|
| Email      | EmailJS                            |
| Icons      | Lucide React                       |
| Deployment | Vercel                             |

---

## Local Development

```bash
cd portfolio
npm install
npm run dev       # dev server with HMR
npm run build     # production build → dist/
npm run preview   # preview production build
```

---

## Environment Variables

Create a `.env` file inside the `portfolio/` directory:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_EMAIL_SERVICE_ID=...
VITE_EMAIL_TEMPLATE_ID=...
VITE_AUTO_REPLY_TEMPLATE_ID=...
VITE_EMAIL_PUBLIC_KEY=...
```

---

## Links

- [Live Portfolio](https://teodorataleska.vercel.app)
- [LinkedIn](https://www.linkedin.com/in/teodora-taleska-b5305422b/)
- [GitHub](https://github.com/teodora-taleska/)

---

*Open for learning purposes. All code is free to explore.*
