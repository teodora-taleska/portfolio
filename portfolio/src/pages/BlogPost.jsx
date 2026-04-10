import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { blogs } from "../../public/data/blogs.js";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(body) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = blogs.find((b) => b.id === slug);
    if (found) setBlog(found);
    else setNotFound(true);
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0B132B] text-white flex flex-col items-center justify-center gap-4">
        <Navbar />
        <p className="text-2xl text-gray-400">Blog post not found.</p>
        <Link to="/blogs" className="text-[#D4AF37] hover:underline">← Back to Blogs</Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0B132B] text-white flex items-center justify-center">
        <Navbar />
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B132B] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition mb-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.keywords.map((kw) => (
              <Link
                key={kw}
                to={`/blogs?keyword=${encodeURIComponent(kw)}`}
                className="px-2.5 py-0.5 rounded-full text-xs border border-[#5BC0BE]/40 text-[#5BC0BE] hover:bg-[#5BC0BE]/10 transition"
              >
                {kw}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-10 pb-8 border-b border-white/10">
            <span>{formatDate(blog.date)}</span>
            <span>·</span>
            <span>{readingTime(blog.body)} min read</span>
          </div>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-gray-300 text-lg leading-relaxed whitespace-pre-line"
        >
          {blog.body}
        </motion.div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline text-sm"
          >
            ← All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
