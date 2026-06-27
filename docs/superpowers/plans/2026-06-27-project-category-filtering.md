# Project Category Filtering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add category filter tabs to the Projects section so visitors can filter by domain, with projects appearing in all matching categories.

**Architecture:** Add a `categories` array field to each project in the static data file, then add a hardcoded ordered tab list + `activeCategory` state to `Projects.jsx`. Filtering derives a `filteredProjects` array that drives both the card grid and pagination. A placeholder card renders when `Web Services` is selected and no projects match.

**Tech Stack:** React 19, Framer Motion, Tailwind CSS

---

## Files

- Modify: `portfolio/public/data/projects.js` — add `categories` field to each project
- Modify: `portfolio/src/components/Projects.jsx` — add filter state, filtering logic, tab UI, placeholder card

---

### Task 1: Add categories to projects.js

**Files:**
- Modify: `portfolio/public/data/projects.js`

- [ ] **Step 1: Add `categories` field to every project**

Open `portfolio/public/data/projects.js` and add `categories` to each project entry as shown. Projects with no subcategory get `categories: []`.

```js
export const projects = [
  {
    id: "player-ltv-studio",
    title: "Player LTV Studio",
    desc: "Educational full-stack project exploring BG/NBD + Gamma-Gamma LTV models, FastAPI, and Next.js. Built in 3 days with Claude Code to learn ML-in-production, marketing analytics, and end-to-end deployment.",
    github: "https://github.com/teodora-taleska/playerltvstudio",
    web: "https://playerltvstudio.vercel.app/",
    tech: ["Python", "FastAPI", "Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Chart.js", "lifetimes", "pandas"],
    categories: ["ML & AI", "Full-Stack"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "toxic-comment-classification",
    title: "Toxic Comment Classification",
    desc: "Multi-label toxic comment classification using statistical and neural models (BERT).",
    github: "https://github.com/teodora-taleska/kuleuven-archive/blob/main/Computational%20Linguistics/Project/toxic_classification_CL_project/final/Teodora_Taleska_Project.ipynb",
    tech: ["Python", "Scikit-learn", "PyTorch", "Transformers", "HuggingFace Datasets"],
    categories: ["ML & AI", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "ecg-biometric-identification",
    title: "ECG-based Biometric Identification",
    desc: "Unsupervised identification of subjects using single-channel ECG signals, focusing on robust biometric authentication.",
    github: "https://github.com/teodora-taleska/kuleuven-archive/tree/main/Biomedical%20data%20processing/Project/Part%201",
    tech: ["Python", "NumPy", "SciPy", "PyWavelets", "Scikit-learn", "Matplotlib"],
    categories: ["ML & AI", "Biosignals", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "eeg-sleep-staging",
    title: "EEG-based Sleep Staging",
    desc: "Classifying sleep stages from EEG data using feature extraction, filtering, and classical ML models.",
    github: "https://github.com/teodora-taleska/kuleuven-archive/tree/main/Biomedical%20data%20processing/Project/Part%202",
    tech: ["Python", "NumPy", "SciPy", "Scikit-learn", "Matplotlib", "Seaborn"],
    categories: ["ML & AI", "Biosignals", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "paperless-ngx",
    title: "Paperless-ngx Contributions",
    desc: "Open-source group project. My contributions: fixed duplicate detection logic and added unit tests to improve reliability of the document management pipeline.",
    github: "https://github.com/kq5-vcd/paperless-ngx/commit/fb037056ae9d3f4725f247976e5d313a4251fe25",
    tech: ["Python", "Django", "Unit Testing"],
    categories: ["Full-Stack", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "tampered-document-ai",
    title: "Tampered Document Detection (Private)",
    desc: "Group research project. My focus: building a VAE-based model to detect tampered fonts in documents, distinguishing authentic text from digitally altered characters using unsupervised deep learning.",
    github: null,
    tech: ["Python", "PyTorch", "Variational Autoencoder", "Computer Vision"],
    categories: ["ML & AI", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "football-network-analysis",
    title: "Football Player Value Estimation",
    desc: "Group project exploring how graph-based features from passing networks, combined with ML models, can estimate a football player's market value, my contribution focused on network feature engineering and model evaluation.",
    github: "https://github.com/teodora-taleska/network_analysis_project",
    tech: ["Python", "NetworkX", "Pandas", "Scikit-learn", "XGBoost", "Matplotlib", "Seaborn"],
    categories: ["ML & AI", "Data Science", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "ml-mini-projects",
    title: "Machine Learning Mini Projects",
    desc: "Collection of small-scale ML projects covering ANN, GLM, kernel methods, loss estimation, and decision trees.",
    github: "https://github.com/teodora-taleska/machine_learning_mini_projects",
    tech: ["Python", "NumPy", "Scikit-learn", "PyTorch", "Matplotlib", "Seaborn"],
    categories: ["ML & AI", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "fitness-info-system",
    title: "Fitness Information System",
    desc: "Web & mobile app to enhance gym member experience and streamline operations.",
    github: "https://github.com/teodora-taleska/fitness-information-system",
    tech: ["React", "Sass", "Node.js", "Express.js", "MySQL"],
    youtube: "https://www.youtube.com/watch?v=FcJlCWMqp9w",
    categories: ["Full-Stack"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "teodora-space",
    title: "Teodora's Space",
    desc: "A personal experiment in 3D web development, built to learn React Three Fiber and explore how interactive 3D environments can make a portfolio feel more like a space than a page.",
    github: "https://github.com/teodora-taleska/teodora-space",
    tech: ["React", "Three.js", "React Three Fiber", "JavaScript", "CSS"],
    categories: ["Creative Coding"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "task-manager",
    title: "Task Manager",
    desc: "My first Python project, built to learn OOP fundamentals hands-on. A task manager with user authentication and persistent storage, where every design decision was a lesson.",
    github: "https://github.com/teodora-taleska/task-manager",
    youtube: "https://youtu.be/IgUcO-DDYWM",
    tech: ["Python", "OOP", "SQLite"],
    categories: [],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "global-hunger-index",
    title: "Global Hunger Index Data Analysis",
    desc: "Built to learn R and R Markdown, the kind of tool that turns analysis into a living, readable report on the web. Explored global hunger patterns through interactive visualisations and narrative-driven data storytelling.",
    github: "https://github.com/teodora-taleska/global-hunger-index",
    tech: ["R", "Pandas", "Seaborn", "Data Analysis"],
    categories: ["Data Science", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "equalita-care",
    title: "Equalita Care App",
    desc: "Group project developed through a Human-Computer Interaction course, focused on designing technology that addresses real-world sustainability challenges. Built a mobile app tackling gender equality and reproductive health, aligned with UN SDG 5, balancing UX research, ethical design, and social impact.",
    github: "https://github.com/teodora-taleska/hci_project",
    youtube: "https://www.youtube.com/watch?v=JEVIl0_Dbi8",
    tech: ["React Native", "Figma Prototype", "Mobile Development"],
    categories: ["Full-Stack", "Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
  {
    id: "mandelbrot-set",
    title: "Mandelbrot Set Renderer",
    desc: "A hands-on dive into parallel and distributed computing with Java, rendered the Mandelbrot set three ways (sequential, multi-threaded, and distributed via RMI) to understand how concurrency and distribution change performance at scale.",
    github: "https://github.com/teodora-taleska/mandelbrot-set",
    tech: ["Java", "JavaFX", "Multi-threading", "RMI", "Distributed Systems"],
    categories: ["Research"],
    clicks: 0, likes: 0, dislikes: 0, userReaction: null,
  },
];
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev` from `portfolio/` and open the site. The Projects section should look identical to before — no visible change yet, just the data field added.

- [ ] **Step 3: Commit**

```bash
git add portfolio/public/data/projects.js
git commit -m "feat: add categories field to projects data"
```

---

### Task 2: Add filter state and filtering logic to Projects.jsx

**Files:**
- Modify: `portfolio/src/components/Projects.jsx`

- [ ] **Step 1: Add the CATEGORIES constant and activeCategory state**

At the top of the `Projects` component, directly after the `ITEMS_PER_PAGE` constant, add:

```jsx
const CATEGORIES = [
  "All", "ML & AI", "Biosignals", "Full-Stack",
  "Data Science", "Research", "Creative Coding", "Web Services",
];

const [activeCategory, setActiveCategory] = useState("All");
```

- [ ] **Step 2: Replace the totalPages and visibleProjects derivations**

Find these two lines (currently around line 29–30):
```jsx
const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
const visibleProjects = projects.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
```

Replace them with:
```jsx
const filteredProjects = activeCategory === "All"
  ? projects
  : projects.filter((p) => p.categories?.includes(activeCategory));

const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
const visibleProjects = filteredProjects.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
```

- [ ] **Step 3: Add the category change handler**

After the `goTo` function, add:

```jsx
const handleCategoryChange = (cat) => {
  setActiveCategory(cat);
  setPage(0);
};
```

- [ ] **Step 4: Verify no console errors**

Check the browser — projects should still display normally under "All". No errors in the console.

---

### Task 3: Add filter tab UI and Web Services placeholder

**Files:**
- Modify: `portfolio/src/components/Projects.jsx`

- [ ] **Step 1: Add the tab row above the project cards**

Inside the RIGHT column div (`<div className="md:w-2/3">`), before the `<AnimatePresence>` block, insert:

```jsx
{/* CATEGORY TABS */}
<div className="flex flex-wrap gap-2 mb-6">
  {CATEGORIES.map((cat) => (
    <button
      key={cat}
      onClick={() => handleCategoryChange(cat)}
      className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
        activeCategory === cat
          ? "border-[#D4AF37] text-[#D4AF37]"
          : "border-th-fg/20 text-th-fg/50 hover:text-th-fg hover:border-th-fg/40"
      }`}
    >
      {cat}
    </button>
  ))}
</div>
```

- [ ] **Step 2: Wrap the card grid and pagination in a conditional**

Wrap the existing `<AnimatePresence>` block and the pagination `<div>` + page counter `<p>` in a conditional so the placeholder shows instead when Web Services is selected with no projects:

```jsx
{activeCategory === "Web Services" && filteredProjects.length === 0 ? (
  <div className="p-6 bg-th-card rounded-xl shadow-lg card-bordered flex items-center justify-center py-16">
    <p className="text-th-fg/50 italic text-sm">
      Coming soon, client projects launching soon.
    </p>
  </div>
) : (
  <>
    <AnimatePresence mode="wait" custom={direction}>
      {/* existing card grid — no changes inside */}
    </AnimatePresence>

    {/* existing PAGINATION block — no changes */}

    <p className="text-center text-th-fg/30 text-xs mt-2">
      {page + 1} / {totalPages}
    </p>
  </>
)}
```

- [ ] **Step 3: Verify all categories in the browser**

Run `npm run dev`. Check each tab:
- `All` → 14 cards, paginated
- `ML & AI` → 7 cards (Player LTV, Toxic, ECG, EEG, Tampered, Football, ML Mini)
- `Biosignals` → 2 cards (ECG, EEG)
- `Full-Stack` → 4 cards (Player LTV, Paperless-ngx, Fitness, Equalita Care)
- `Data Science` → 2 cards (Football, Global Hunger)
- `Research` → 9 cards
- `Creative Coding` → 1 card (Teodora's Space)
- `Web Services` → placeholder card

Also verify: Task Manager appears only under `All`, not any subcategory.

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/components/Projects.jsx
git commit -m "feat: add category filter tabs to Projects section"
```
