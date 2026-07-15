import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Navbar from "../components/Navbar";
import { blogs } from "../../public/data/blogs.js";
import { getReactions, saveReactions } from "../lib/supabase.js";

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

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

function localKey(id) { return `blog_reaction_${id}`; }
function getUserReaction(id) { return localStorage.getItem(localKey(id)); }
function setUserReaction(id, val) {
  if (val) localStorage.setItem(localKey(id), val);
  else localStorage.removeItem(localKey(id));
}

const emptyFeedback = { name: "", email: "", comment: "" };

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [reaction, setReaction] = useState({ likes: 0, dislikes: 0, userReaction: getUserReaction(slug) });
  const [feedback, setFeedback] = useState(emptyFeedback);
  const [feedbackErrors, setFeedbackErrors] = useState({});
  const [feedbackStatus, setFeedbackStatus] = useState(null);

  useEffect(() => {
    const found = blogs.find((b) => b.id === slug);
    if (found) {
      setBlog(found);
      getReactions(slug).then((data) => {
        const userReaction = getUserReaction(slug);
        setReaction({
          likes: Math.max(data.likes, userReaction === "like" ? 1 : 0),
          dislikes: Math.max(data.dislikes, userReaction === "dislike" ? 1 : 0),
          userReaction,
        });
      });
    } else {
      setNotFound(true);
    }
  }, [slug]);

  const handleReaction = (type) => {
    setReaction((prev) => {
      let { likes, dislikes, userReaction } = prev;
      if (userReaction === type) {
        likes = type === "like" ? Math.max(0, likes - 1) : likes;
        dislikes = type === "dislike" ? Math.max(0, dislikes - 1) : dislikes;
        setUserReaction(slug, null);
        return { likes, dislikes, userReaction: null };
      }
      if (userReaction === "like") likes = Math.max(0, likes - 1);
      if (userReaction === "dislike") dislikes = Math.max(0, dislikes - 1);
      if (type === "like") likes++;
      if (type === "dislike") dislikes++;
      setUserReaction(slug, type);
      return { likes, dislikes, userReaction: type };
    });
  };

  useEffect(() => {
    if (!blog) return;
    saveReactions(slug, "blog", { likes: reaction.likes, dislikes: reaction.dislikes });
  }, [reaction.likes, reaction.dislikes]);

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
    if (feedbackErrors[name]) setFeedbackErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateFeedback = () => {
    const errors = {
      name: !feedback.name.trim(),
      email: !feedback.email.trim(),
      comment: !feedback.comment.trim(),
    };
    setFeedbackErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!validateFeedback()) return;
    setFeedbackStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: feedback.name,
          email: feedback.email,
          subject: `Blog feedback: ${blog.title}`,
          message: feedback.comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackStatus("success");
        setFeedback(emptyFeedback);
      } else {
        console.error("Web3Forms error:", data);
        setFeedbackStatus("error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setFeedbackStatus("error");
    }
  };

  const fieldClass = (name) =>
    `w-full p-3 rounded-lg bg-th-bg/50 border text-th-fg text-sm focus:outline-none focus:ring-2 transition-colors placeholder:text-th-subtle ${
      feedbackErrors[name]
        ? "border-red-500 focus:ring-red-500"
        : "border-[#D4AF37]/20 focus:ring-[#D4AF37]/50"
    }`;

  if (notFound) {
    return (
      <div className="min-h-screen bg-th-bg text-th-fg flex flex-col items-center justify-center gap-4">
        <Navbar />
        <p className="text-2xl text-th-body">Blog post not found.</p>
        <Link to="/blogs" className="text-[#D4AF37] hover:underline">← Back to Blogs</Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-th-bg text-th-fg flex items-center justify-center">
        <Navbar />
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-th-bg text-th-fg">
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
            className="inline-flex items-center gap-2 text-sm text-th-body hover:text-[#D4AF37] transition mb-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
        </motion.div>

        {/* Cover image */}
        {blog.image && (
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden mb-10 h-64 md:h-80"
          >
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

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

          <h1 className="text-4xl md:text-5xl font-bold text-th-fg leading-tight mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-th-subtle mb-10 pb-8 border-b border-th-fg/10">
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
          className="blog-body text-th-body text-lg leading-relaxed"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children }) {
                const lang = /language-(\w+)/.exec(className || "")?.[1];
                return !inline && lang ? (
                  <SyntaxHighlighter style={oneDark} language={lang} PreTag="div" className="rounded-xl my-4 text-sm">
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-th-card px-1.5 py-0.5 rounded text-[#D4AF37] text-sm font-mono">
                    {children}
                  </code>
                );
              },
              img({ src, alt }) {
                return (
                  <img src={src} alt={alt} className="rounded-xl my-6 w-full object-cover" />
                );
              },
              h2({ children }) {
                return <h2 className="text-2xl font-bold text-th-fg mt-10 mb-3">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="text-xl font-semibold text-th-fg mt-8 mb-2">{children}</h3>;
              },
              p({ children }) {
                return <p className="mb-5">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc list-inside mb-5 space-y-1">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal list-inside mb-5 space-y-1">{children}</ol>;
              },
              a({ href, children }) {
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                );
              },
              strong({ children }) {
                return <strong className="text-th-fg font-semibold">{children}</strong>;
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                );
              },
              th({ children }) {
                return <th className="px-4 py-2 text-left border border-th-fg/10 bg-th-card text-th-fg font-semibold">{children}</th>;
              },
              td({ children }) {
                return <td className="px-4 py-2 border border-th-fg/10 text-th-body">{children}</td>;
              },
            }}
          >
            {blog.body}
          </ReactMarkdown>
        </motion.div>

        {/* Likes / Dislikes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-14 pt-8 border-t border-th-fg/10 flex items-center gap-6"
        >
          <span className="text-th-body text-sm">Was this helpful?</span>

          <button
            onClick={() => handleReaction("like")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              reaction.userReaction === "like"
                ? "border-green-400 text-green-400 bg-green-400/10"
                : "border-th-fg/10 text-th-body hover:border-green-400 hover:text-green-400"
            }`}
          >
            <ThumbsUp size={16} fill={reaction.userReaction === "like" ? "currentColor" : "none"} />
            <span className="text-sm">{reaction.likes}</span>
          </button>

          <button
            onClick={() => handleReaction("dislike")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              reaction.userReaction === "dislike"
                ? "border-red-400 text-red-400 bg-red-400/10"
                : "border-th-fg/10 text-th-body hover:border-red-400 hover:text-red-400"
            }`}
          >
            <ThumbsDown size={16} fill={reaction.userReaction === "dislike" ? "currentColor" : "none"} />
            <span className="text-sm">{reaction.dislikes}</span>
          </button>
        </motion.div>

        {/* Feedback form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="text-xl font-semibold text-[#D4AF37] mb-1">Leave a comment</h3>
          <p className="text-th-subtle text-sm mb-6">Your feedback comes directly to me. I read every message😊.</p>

          <form onSubmit={handleFeedbackSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={feedback.name}
                  onChange={handleFeedbackChange}
                  className={fieldClass("name")}
                />
                {feedbackErrors.name && (
                  <span className="text-red-500 text-xs px-1">Name is required</span>
                )}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={feedback.email}
                  onChange={handleFeedbackChange}
                  className={fieldClass("email")}
                />
                {feedbackErrors.email && (
                  <span className="text-red-500 text-xs px-1">Email is required</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <textarea
                name="comment"
                placeholder="Share your thoughts…"
                value={feedback.comment}
                onChange={handleFeedbackChange}
                rows={5}
                className={fieldClass("comment")}
              />
              {feedbackErrors.comment && (
                <span className="text-red-500 text-xs px-1">Comment is required</span>
              )}
            </div>

            <button
              type="submit"
              disabled={feedbackStatus === "sending"}
              className="self-start bg-[#D4AF37] text-[#0B132B] font-bold px-6 py-2.5 rounded-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {feedbackStatus === "sending" ? "Sending…" : "Send"}
            </button>

            {feedbackStatus === "success" && (
              <p className="text-green-400 text-sm">Thanks for your feedback!</p>
            )}
            {feedbackStatus === "error" && (
              <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
            )}
          </form>
        </motion.div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-th-fg/10 flex justify-center">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline text-sm">
            ← All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
