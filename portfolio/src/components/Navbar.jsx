export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full flex justify-center gap-8 py-4
                    bg-[#0B132B]/30 backdrop-blur-md
                    border-b border-white/10
                    z-50 text-sm">

      <a href="#projects" className="hover:text-[#D4AF37] transition">
        Projects
      </a>

      <a href="#certificates" className="hover:text-[#D4AF37] transition">
        Certificates
      </a>

      <a href="#about" className="hover:text-[#D4AF37] transition">
        About
      </a>

    </nav>
  );
}