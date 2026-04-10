import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const anchorLink = (hash, label) =>
    isHome ? (
      <a href={hash} className="hover:text-[#D4AF37] transition">{label}</a>
    ) : (
      <Link to={`/${hash}`} className="hover:text-[#D4AF37] transition">{label}</Link>
    );

  return (
    <nav className="fixed top-0 w-full flex justify-center gap-8 py-4
                    bg-[#0B132B]/30 backdrop-blur-md
                    border-b border-white/10
                    z-50 text-sm">

      {anchorLink("#projects", "Projects")}
      {anchorLink("#experience", "Experience")}

      <Link to="/blogs" className="hover:text-[#D4AF37] transition">
        Blogs
      </Link>

      {anchorLink("#certificates", "Certificates")}
      {anchorLink("#contact", "Contact")}

    </nav>
  );
}