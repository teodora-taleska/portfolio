import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from "lucide-react";
import { blogs as blogData } from "../../public/data/blogs.js";
import { getReactions, saveReactions } from "../lib/supabase.js";

function getReadingTime(text) {
  const words = text.split(" ").length;
  return Math.ceil(words / 200);
}
function localKey(id) { return `blog_reaction_${id}`; }
function getUserReaction(id) { return localStorage.getItem(localKey(id)); }
function setUserReaction(id, val) {
  if (val) localStorage.setItem(localKey(id), val);
  else localStorage.removeItem(localKey(id));
}

export default function BlogSection() {
  const ITEMS_PER_PAGE = 3;

  const [blogState, setBlogState] = useState(
    blogData.map((b) => ({
      ...b,
      clicks: 0,
      likes: 0,
      dislikes: 0,
      userReaction: getUserReaction(b.id),
      readTime: getReadingTime(b.body),
    }))
  );

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(blogState.length / ITEMS_PER_PAGE);
  const visibleBlogs = blogState.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  // Touch swipe
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) setPage((p) => Math.max(0, p - 1));
    else if (dx < -50) setPage((p) => Math.min(totalPages - 1, p + 1));
    touchStartX.current = null;
  };

  // Load counts from Supabase on mount
  useEffect(() => {
    blogData.forEach(async (b) => {
      const data = await getReactions(b.id);
      setBlogState((prev) =>
        prev.map((blog) => {
          if (blog.id !== b.id) return blog;
          const userReaction = getUserReaction(b.id);
          return {
            ...blog,
            likes: Math.max(data.likes, userReaction === "like" ? 1 : 0),
            dislikes: Math.max(data.dislikes, userReaction === "dislike" ? 1 : 0),
          };
        })
      );
    });
  }, []);

  const handleClick = async (id) => {
    setBlogState((prev) =>
      prev.map((b) => b.id === id ? { ...b, clicks: b.clicks + 1 } : b)
    );
    const current = blogState.find((b) => b.id === id);
    await saveReactions(id, "blog", { clicks: (current?.clicks ?? 0) + 1 });
  };

  const handleReaction = (id, type) => {
    setBlogState((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        let { likes, dislikes, userReaction } = b;

        if (userReaction === type) {
          likes = type === "like" ? Math.max(0, likes - 1) : likes;
          dislikes = type === "dislike" ? Math.max(0, dislikes - 1) : dislikes;
          setUserReaction(id, null);
          saveReactions(id, "blog", { likes, dislikes });
          return { ...b, likes, dislikes, userReaction: null };
        }
        if (userReaction === "like") likes = Math.max(0, likes - 1);
        if (userReaction === "dislike") dislikes = Math.max(0, dislikes - 1);
        if (type === "like") likes++;
        if (type === "dislike") dislikes++;
        setUserReaction(id, type);
        saveReactions(id, "blog", { likes, dislikes });
        return { ...b, likes, dislikes, userReaction: type };
      })
    );
  };

  // Note: BlogSection calls saveReactions directly inside the map (not a state updater pattern)
  // so it's fine here — no StrictMode double-call issue

  return (
    <section id="blogs" className="py-20 px-5 md:px-10 bg-[#121826]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">

        {/* LEFT */}
        <div className="md:w-1/3">
          <h3 className="text-4xl text-[#FFD166] font-bold mb-4">BLOGS</h3>
          <p className="text-white/80">
            Short reads on AI, data systems, and concepts I explore while learning and building.
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
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {visibleBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  className="group p-6 bg-[#1C2541] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.03, y: -2 }}
                >
                  {/* CLICKABLE AREA */}
                  <a
                    href={blog.link}
                    onClick={() => handleClick(blog.id)}
                    className="block"
                    target="_blank" // open in new tab
                    rel="noopener noreferrer"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-semibold text-[#FFD166] group-hover:underline">
                        {blog.title}
                      </h4>

                      {blog.link && (
                        <img
                          src="/icons/link.png"
                          className="w-4 h-4 filter brightness-0 invert opacity-70 group-hover:opacity-100"
                        />
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mt-1">
                      {blog.date} • {blog.readTime} min read
                    </p>

                    <p className="text-white/70 mt-2">{blog.body.slice(0, 120)}...</p>
                  </a>

                  {/* TAGS */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {blog.keywords.map((k, i) => (
                      <span
                        key={i}
                        className="text-xs text-[#FFD166] bg-white/10 px-2 py-1 rounded-full"
                      >
                        {k}
                      </span>
                    ))}
                  </div>

                  {/* INTERACTIONS */}
                  <div className="mt-4 flex gap-4 items-center text-white/60">
                    <button
                      onClick={() => handleReaction(blog.id, "like")}
                      className={`flex items-center gap-1 transition ${
                        blog.userReaction === "like"
                          ? "text-green-400"
                          : "hover:text-green-400"
                      }`}
                    >
                      <ThumbsUp
                        size={16}
                        fill={blog.userReaction === "like" ? "currentColor" : "none"}
                      />
                      <span className="text-xs">{blog.likes}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(blog.id, "dislike")}
                      className={`flex items-center gap-1 transition ${
                        blog.userReaction === "dislike"
                          ? "text-red-400"
                          : "hover:text-red-400"
                      }`}
                    >
                      <ThumbsDown
                        size={16}
                        fill={blog.userReaction === "dislike" ? "currentColor" : "none"}
                      />
                    </button>

                    <span className="ml-auto text-xs opacity-50">
                      clicks: {blog.clicks}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* PAGINATION */}
          <div className="flex items-center justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#FFD166] hover:text-[#FFD166] disabled:opacity-20 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={`rounded-full transition-all ${
                    page === idx
                      ? "w-6 h-3 bg-[#FFD166]"
                      : "w-3 h-3 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-[#FFD166] hover:text-[#FFD166] disabled:opacity-20 disabled:cursor-not-allowed transition"
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