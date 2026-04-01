export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full flex justify-center gap-8 py-4 bg-transparent z-50 text-sm">
      <a href="#projects" className="hover:text-[#D4AF37]">Projects</a>
      <a href="#certificates" className="hover:text-[#D4AF37]">Certificates</a>
      <a href="#about" className="hover:text-[#D4AF37]">About</a>
    </nav>
  );
}