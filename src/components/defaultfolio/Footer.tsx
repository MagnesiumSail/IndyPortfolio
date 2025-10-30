export default function Footer() {
  return (
    <footer className="relative z-10 w-full text-gray-900 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 gap-4">
        
        {/* Left Section */}
        <p className="text-sm bg-white/25 backdrop-blur-md px-4 py-2 rounded-md">
          © {new Date().getFullYear()} Indy. All rights reserved.
        </p>

        {/* Right Section */}
        <div className="flex gap-6 text-sm bg-white/25 backdrop-blur-md px-4 py-2 rounded-md">
          <a href="#about" className="hover:text-[#63C697] transition-colors">
            About
          </a>
          <a href="#projects" className="hover:text-[#63C697] transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-[#63C697] transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
