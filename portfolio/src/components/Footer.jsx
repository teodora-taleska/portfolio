import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-white py-10 px-6 text-center">
      <div className="flex justify-center gap-6 mb-4">
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/teodora-taleska-b5305422b/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#D4AF37] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5V24H0V8zm7.5 0h4.8v2.1h.1c.7-1.3 2.4-2.6 4.9-2.6 5.2 0 6.2 3.4 6.2 7.8V24h-5v-7c0-1.7 0-3.9-2.4-3.9-2.4 0-2.7 1.8-2.7 3.8V24h-5V8z"/>
          </svg>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/teodora-taleska"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#D4AF37] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.74-1.34-1.74-1.09-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>

        {/* Blog */}
        <a
          href="/blogs"
          className="hover:text-[#D4AF37] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 4v16h18V4H3zm16 14H5V6h14v12zm-7-2h5v-2h-5v2zm0-4h5v-2h-5v2zm-7 4h5v-2H5v2zm0-4h5v-2H5v2z"/>
          </svg>
        </a>
      </div>

      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} Teodora Taleska. All rights reserved.
      </p>
    </footer>
  );
}