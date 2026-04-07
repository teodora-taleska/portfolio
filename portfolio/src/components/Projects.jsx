import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { projects as initialProjects } from "../../public/data/projects.js";

export default function Projects() {
  const ITEMS_PER_PAGE = 3;

  const [projects, setProjects] = useState(() => {
    const stored = localStorage.getItem("projectsState");
    if (stored) return JSON.parse(stored);
    return initialProjects.map((p) => ({
      ...p,
      clicks: 0,
      likes: 0,
      dislikes: 0,
      userReaction: null,
    }));
  });

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const visibleProjects = projects.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("projectsState", JSON.stringify(projects));
  }, [projects]);

  // CLICK TRACKING (per project)
  const handleGithubClick = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, clicks: p.clicks + 1 } : p
      )
    );
  };

  // LIKE / DISLIKE TOGGLE LOGIC
  const handleReaction = (id, type) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        let { likes, dislikes, userReaction } = p;

        // remove existing reaction
        if (userReaction === type) {
          if (type === "like") likes--;
          if (type === "dislike") dislikes--;

          return { ...p, likes, dislikes, userReaction: null };
        }

        // switch reaction
        if (userReaction === "like") likes--;
        if (userReaction === "dislike") dislikes--;

        if (type === "like") likes++;
        if (type === "dislike") dislikes++;

        return { ...p, likes, dislikes, userReaction: type };
      })
    );
  };

  return (
    <section id="projects" className="py-20 px-10 bg-[#121826]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">

        {/* LEFT */}
        <div className="md:w-1/3">
          <h3 className="text-4xl text-[#D4AF37] font-bold mb-4">PROJECTS</h3>
          <p className="text-white/80">
            A selection of projects where I combine data science, machine learning,
            and software engineering to build real-world systems.
          </p>
        </div>

        {/* RIGHT */}
        <div className="md:w-2/3">

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6"
            >
              {visibleProjects.map((p) => (
                <motion.div
                  key={p.id}
                  className="p-6 bg-[#1C2541] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.03, y: -2 }}
                >
                  {/* TITLE + GITHUB */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-[#5BC0BE] flex items-center gap-2">
                      {p.title}

                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGithubClick(p.id);
                          }}
                          className="relative group flex items-center"
                        >
                          <img
                            src="/icons/github_logo.png"
                            alt="GitHub"
                            className="w-4 h-4 opacity-70 group-hover:opacity-100 transition duration-300 filter brightness-0 invert"
                          />

                          <span className="
                            absolute left-1/2 -translate-x-1/2 top-[-28px]
                            text-xs bg-black/80 backdrop-blur px-2 py-1 rounded
                            text-white whitespace-nowrap
                            opacity-0 translate-y-1
                            group-hover:opacity-100 group-hover:translate-y-0
                            transition-all duration-300
                            pointer-events-none
                          ">
                            View on GitHub
                          </span>
                        </a>
                      )}
                    </h4>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-white/70 mt-2">{p.desc}</p>

                  {/* TECH */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {p.tech?.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-[#FFD700] bg-white/10 px-2 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* INTERACTIONS */}
                  <div className="mt-4 flex gap-4 items-center text-white/60">

                    {/* LIKE */}
                    <button
                      onClick={() => handleReaction(p.id, "like")}
                      className={`flex items-center gap-1 transition ${
                        p.userReaction === "like"
                          ? "text-green-400"
                          : "hover:text-green-400"
                      }`}
                    >
                      <ThumbsUp
                        size={16}
                        fill={p.userReaction === "like" ? "currentColor" : "none"}
                      />
                      <span className="text-xs">{p.likes}</span>
                    </button>

                    {/* DISLIKE */}
                    <button
                      onClick={() => handleReaction(p.id, "dislike")}
                      className={`flex items-center gap-1 transition ${
                        p.userReaction === "dislike"
                          ? "text-red-400"
                          : "hover:text-red-400"
                      }`}
                    >
                      <ThumbsDown
                        size={16}
                        fill={p.userReaction === "dislike" ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Clicks shown (optional) */}
                    <span className="ml-auto text-xs opacity-50">
                      clicks: {p.clicks}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* DOTS */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  page === idx
                    ? "bg-[#D4AF37] scale-125"
                    : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}