import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { blogs as blogData } from "../../public/data/blogs.js"; // import your blogs

function getReadingTime(text) {
  const words = text.split(" ").length;
  return Math.ceil(words / 200);
}

export default function BlogSection() {
  const ITEMS_PER_PAGE = 3;

  const [blogState, setBlogState] = useState(() => {
    const stored = localStorage.getItem("blogsState");
    if (stored) return JSON.parse(stored);
    return blogData.map((b) => ({
      ...b,
      clicks: 0,
      likes: 0,
      dislikes: 0,
      userReaction: null,
      readTime: getReadingTime(b.body),
    }));
  });

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(blogState.length / ITEMS_PER_PAGE);
  const visibleBlogs = blogState.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  // Persist state
  useEffect(() => {
    localStorage.setItem("blogsState", JSON.stringify(blogState));
  }, [blogState]);

  const handleClick = (id) => {
    setBlogState((prev) =>
      prev.map((b) => (b.id === id ? { ...b, clicks: b.clicks + 1 } : b))
    );
  };

  const handleReaction = (id, type) => {
    setBlogState((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;

        let { likes, dislikes, userReaction } = b;
        if (userReaction === type) {
          if (type === "like") likes--;
          if (type === "dislike") dislikes--;
          return { ...b, likes, dislikes, userReaction: null };
        }
        if (userReaction === "like") likes--;
        if (userReaction === "dislike") dislikes--;

        if (type === "like") likes++;
        if (type === "dislike") dislikes++;

        return { ...b, likes, dislikes, userReaction: type };
      })
    );
  };

  return (
    <section id="blogs" className="py-20 px-10 bg-[#121826]">
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

          {/* DOTS */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  page === idx ? "bg-[#D4AF37] scale-125" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}