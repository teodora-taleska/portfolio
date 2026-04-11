import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from "lucide-react";
import { projects as initialProjects } from "../../public/data/projects.js";
import { getReactions, saveReactions } from "../lib/supabase.js";

function localKey(id) { return `project_reaction_${id}`; }
function getUserReaction(id) { return localStorage.getItem(localKey(id)); }
function setUserReaction(id, val) {
  if (val) localStorage.setItem(localKey(id), val);
  else localStorage.removeItem(localKey(id));
}

export default function Projects() {
  const ITEMS_PER_PAGE = 3;

  const [projects, setProjects] = useState(
    initialProjects.map((p) => ({
      ...p,
      clicks: 0,
      likes: 0,
      dislikes: 0,
      userReaction: getUserReaction(p.id),
    }))
  );

  const [page, setPage] = useState(0);
  const direction = useRef(1); // 1 = forward, -1 = backward
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const visibleProjects = projects.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const goTo = (next) => {
    direction.current = next > page ? 1 : -1;
    setPage(next);
  };

  // Touch swipe
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) goTo(Math.max(0, page - 1));
    else if (dx < -50) goTo(Math.min(totalPages - 1, page + 1));
    touchStartX.current = null;
  };

  // Load counts from Supabase on mount
  useEffect(() => {
    initialProjects.forEach(async (p) => {
      const data = await getReactions(p.id);
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== p.id) return proj;
          const userReaction = getUserReaction(p.id);
          return {
            ...proj,
            likes: Math.max(data.likes, userReaction === "like" ? 1 : 0),
            dislikes: Math.max(data.dislikes, userReaction === "dislike" ? 1 : 0),
            clicks: data.clicks,
          };
        })
      );
    });
  }, []);

  const handleLinkClick = async (id) => {
    setProjects((prev) =>
      prev.map((p) => p.id === id ? { ...p, clicks: p.clicks + 1 } : p)
    );
    const current = projects.find((p) => p.id === id);
    await saveReactions(id, "project", { clicks: (current?.clicks ?? 0) + 1 });
  };

  const handleReaction = async (id, type) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        let { likes, dislikes, userReaction } = p;

        if (userReaction === type) {
          likes = type === "like" ? Math.max(0, likes - 1) : likes;
          dislikes = type === "dislike" ? Math.max(0, dislikes - 1) : dislikes;
          setUserReaction(id, null);
          saveReactions(id, "project", { likes, dislikes });
          return { ...p, likes, dislikes, userReaction: null };
        }
        if (userReaction === "like") likes = Math.max(0, likes - 1);
        if (userReaction === "dislike") dislikes = Math.max(0, dislikes - 1);
        if (type === "like") likes++;
        if (type === "dislike") dislikes++;
        setUserReaction(id, type);
        saveReactions(id, "project", { likes, dislikes });
        return { ...p, likes, dislikes, userReaction: type };
      })
    );
  };

  return (
    <section id="projects" className="py-20 px-5 md:px-10 bg-[#121826]">
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
              initial={{ x: direction.current * 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction.current * -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {visibleProjects.map((p) => (
                <motion.div
                  key={p.id}
                  className="p-6 bg-[#1C2541] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.03, y: -2 }}
                >
                  {/* TITLE + LINKS */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-[#5BC0BE] flex items-center gap-3">
                      {p.title}

                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); handleLinkClick(p.id); }}
                          className="relative group flex items-center"
                        >
                          <img
                            src="/icons/github_logo.png"
                            alt="GitHub"
                            className="w-4 h-4 opacity-70 group-hover:opacity-100 transition duration-300 filter brightness-0 invert"
                          />
                          <span className="absolute left-1/2 -translate-x-1/2 top-[-28px] text-xs bg-black/80 px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition">
                            GitHub
                          </span>
                        </a>
                      )}

                      {p.youtube && (
                        <a
                          href={p.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); handleLinkClick(p.id); }}
                          className="relative group flex items-center"
                        >
                          <img
                            src="/icons/youtube.png"
                            alt="YouTube"
                            className="w-4 h-4 opacity-70 group-hover:opacity-100 transition duration-300 filter brightness-0 invert"
                          />
                          <span className="absolute left-1/2 -translate-x-1/2 top-[-28px] text-xs bg-black/80 px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition">
                            Demo
                          </span>
                        </a>
                      )}

                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); handleLinkClick(p.id); }}
                          className="relative group flex items-center"
                        >
                          <img
                            src="/icons/link.png"
                            alt="Live"
                            className="w-4 h-4 opacity-70 group-hover:opacity-100 transition duration-300 filter brightness-0 invert"
                          />
                          <span className="absolute left-1/2 -translate-x-1/2 top-[-28px] text-xs bg-black/80 px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition">
                            Live
                          </span>
                        </a>
                      )}
                    </h4>
                  </div>

                  <p className="text-white/70 mt-2">{p.desc}</p>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    {p.tech?.map((t, idx) => (
                      <span key={idx} className="text-xs text-[#FFD700] bg-white/10 px-2 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-4 items-center text-white/60">
                    <button
                      onClick={() => handleReaction(p.id, "like")}
                      className={`flex items-center gap-1 transition ${p.userReaction === "like" ? "text-green-400" : "hover:text-green-400"}`}
                    >
                      <ThumbsUp size={16} fill={p.userReaction === "like" ? "currentColor" : "none"} />
                      <span className="text-xs">{p.likes}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(p.id, "dislike")}
                      className={`flex items-center gap-1 transition ${p.userReaction === "dislike" ? "text-red-400" : "hover:text-red-400"}`}
                    >
                      <ThumbsDown size={16} fill={p.userReaction === "dislike" ? "currentColor" : "none"} />
                    </button>

                    <span className="ml-auto text-xs opacity-50">clicks: {p.clicks}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* PAGINATION */}
          <div className="flex items-center justify-center mt-6 gap-4">
            <button
              onClick={() => goTo(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-20 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`rounded-full transition-all ${
                    page === idx
                      ? "w-6 h-3 bg-[#D4AF37]"
                      : "w-3 h-3 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-20 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <p className="text-center text-white/30 text-xs mt-2">
            {page + 1} / {totalPages}
          </p>
        </div>
      </div>
    </section>
  );
}
