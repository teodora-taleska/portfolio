import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { blogs as allBlogs } from "../../public/data/blogs.js";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function readingTime(body) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function Blogs() {
  const [blogs] = useState(allBlogs);
  const [search, setSearch] = useState("");
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [sort, setSort] = useState("newest");

  const allKeywords = useMemo(
    () => [...new Set(blogs.flatMap((b) => b.keywords))].sort(),
    [blogs]
  );

  const filtered = useMemo(() => {
    let result = [...blogs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (activeKeyword) {
      result = result.filter((b) => b.keywords.includes(activeKeyword));
    }

    result.sort((a, b) =>
      sort === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

    return result;
  }, [blogs, search, activeKeyword, sort]);

  return (
    <div className="min-h-screen bg-[#0B132B] text-white">
      <Navbar />

      {/* Hero banner */}
      <div className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C2541] to-[#0B132B] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 50% 40%, #D4AF37 0%, transparent 60%)" }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-5xl md:text-6xl font-bold text-[#D4AF37] mb-4"
        >
          Blogs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative text-gray-400 max-w-xl mx-auto text-lg"
        >
          Thoughts on AI, data, and software — written from experience.
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24">

        {/* Search + Sort row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by title or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1C2541]/60 border border-[#D4AF37]/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#1C2541]/60 border border-[#D4AF37]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#1C2541]">
                {o.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Keyword pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <button
            onClick={() => setActiveKeyword(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              activeKeyword === null
                ? "bg-[#D4AF37] text-[#0B132B] border-[#D4AF37]"
                : "border-[#D4AF37]/30 text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            }`}
          >
            All
          </button>
          {allKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setActiveKeyword(activeKeyword === kw ? null : kw)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeKeyword === kw
                  ? "bg-[#5BC0BE] text-[#0B132B] border-[#5BC0BE]"
                  : "border-[#5BC0BE]/30 text-gray-400 hover:border-[#5BC0BE] hover:text-[#5BC0BE]"
              }`}
            >
              {kw}
            </button>
          ))}
        </motion.div>

        {/* Blog cards */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 py-20"
            >
              No blogs match your search.
            </motion.p>
          ) : (
            filtered.map((blog, i) => (
              <motion.div
                key={blog.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blogs/${blog.id}`} className="block group mb-5">
                  <div className="bg-[#1C2541]/50 border border-[#D4AF37]/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 hover:bg-[#1C2541]/80 transition-all duration-300 flex flex-col sm:flex-row">

                    {/* Cover image */}
                    {blog.image && (
                      <div className="sm:w-48 sm:shrink-0 h-40 sm:h-auto overflow-hidden bg-[#0B132B]/40">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Text */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h2 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                            {blog.title}
                          </h2>
                          <span className="shrink-0 text-xs text-gray-500 mt-1">
                            {formatDate(blog.date)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {blog.body}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-4 flex-wrap">
                        {blog.keywords.map((kw) => (
                          <span
                            key={kw}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveKeyword(activeKeyword === kw ? null : kw);
                            }}
                            className={`px-2.5 py-0.5 rounded-full text-xs border cursor-pointer transition-colors ${
                              activeKeyword === kw
                                ? "bg-[#5BC0BE] text-[#0B132B] border-[#5BC0BE]"
                                : "border-[#5BC0BE]/30 text-[#5BC0BE] hover:border-[#5BC0BE]"
                            }`}
                          >
                            {kw}
                          </span>
                        ))}
                        <span className="ml-auto text-xs text-gray-500">
                          {readingTime(blog.body)} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
