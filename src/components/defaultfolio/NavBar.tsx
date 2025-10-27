'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md border-b 
        ${scrolled ? 'bg-black/70 border-[#63C697]/40 py-3' : 'bg-transparent border-transparent py-5'}`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {/* Logo / Name */}
        <Link href="#home" className="font-semibold text-lg tracking-wide text-[#63C697]">
          Indiana Brown
        </Link>

        {/* Navigation Links */}
        <nav className="hidden sm:flex gap-8 text-sm text-gray-200">
          <a href="#about" className="hover:text-[#63C697] transition-colors">
            About
          </a>
          <a href="#projects" className="hover:text-[#63C697] transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-[#63C697] transition-colors">
            Contact
          </a>
        </nav>

        {/* Mobile Menu */}
        <button
          className="sm:hidden text-gray-200 hover:text-[#63C697] transition-colors"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
