import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  const close = () => setMenuOpen(false);

  const anchorLink = (hash, label) =>
    isHome ? (
      <a href={hash} className="hover:text-[#D4AF37] transition" onClick={close}>{label}</a>
    ) : (
      <Link to={`/${hash}`} className="hover:text-[#D4AF37] transition" onClick={close}>{label}</Link>
    );

  const ThemeToggle = () => (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-th-fg/10 transition text-th-fg/70 hover:text-[#D4AF37]"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );

  return (
    <nav className="fixed top-0 w-full bg-th-bg/30 backdrop-blur-md border-b border-th-fg/10 z-50 text-sm text-th-fg">

      {/* Desktop */}
      <div className="hidden md:flex justify-center items-center gap-8 py-4 relative">
        {anchorLink("#projects", "Projects")}
        {anchorLink("#experience", "Experience")}
        <Link to="/blogs" className="hover:text-[#D4AF37] transition">Blogs</Link>
        {anchorLink("#certificates", "Certificates")}
        {anchorLink("#contact", "Contact")}
        <div className="absolute right-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile header bar */}
      <div className="md:hidden flex justify-between items-center px-5 py-3">
        <span className="text-[#D4AF37] font-semibold tracking-wide">Teodora</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-th-fg text-2xl leading-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-5 py-5 border-t border-th-fg/10 bg-th-bg/95">
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
