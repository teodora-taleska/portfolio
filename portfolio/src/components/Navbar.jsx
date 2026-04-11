import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  const anchorLink = (hash, label) =>
    isHome ? (
      <a href={hash} className="hover:text-[#D4AF37] transition" onClick={close}>{label}</a>
    ) : (
      <Link to={`/${hash}`} className="hover:text-[#D4AF37] transition" onClick={close}>{label}</Link>
    );

  return (
    <nav className="fixed top-0 w-full bg-[#0B132B]/30 backdrop-blur-md border-b border-white/10 z-50 text-sm">

      {/* Desktop */}
      <div className="hidden md:flex justify-center gap-8 py-4">
        {anchorLink("#projects", "Projects")}
        {anchorLink("#experience", "Experience")}
        <Link to="/blogs" className="hover:text-[#D4AF37] transition">Blogs</Link>
        {anchorLink("#certificates", "Certificates")}
        {anchorLink("#contact", "Contact")}
      </div>

      {/* Mobile header bar */}
      <div className="md:hidden flex justify-between items-center px-5 py-3">
        <span className="text-[#D4AF37] font-semibold tracking-wide">Teodora</span>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="text-white text-2xl leading-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-5 py-5 border-t border-white/10 bg-[#0B132B]/95">
          {anchorLink("#projects", "Projects")}
          {anchorLink("#experience", "Experience")}
          <Link to="/blogs" className="hover:text-[#D4AF37] transition" onClick={close}>Blogs</Link>
          {anchorLink("#certificates", "Certificates")}
          {anchorLink("#contact", "Contact")}
        </div>
      )}
    </nav>
  );
}
