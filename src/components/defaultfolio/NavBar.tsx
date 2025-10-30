'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Header shrink on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on Esc
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (open) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  const closeMenu = () => setOpen(false);

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

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-8 text-sm text-gray-200">
          <a href="#about" className="hover:text-[#63C697] transition-colors">About</a>
          <a href="#projects" className="hover:text-[#63C697] transition-colors">Projects</a>
          <a href="#contact" className="hover:text-[#63C697] transition-colors">Contact</a>
          <a href="https://drive.google.com/file/d/10beJ8D14ow33x-1CwqOJcffrCiKDab7J/view?usp=sharing" className="hover:text-[#63C697] transition-colors">Resume</a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="sm:hidden text-gray-200 hover:text-[#63C697] transition-colors"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className={`
          sm:hidden overflow-hidden transition-[max-height,opacity] duration-300
          ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
        style={{ position: 'relative', zIndex: 40 }}
      >
        <nav className="px-6 pt-2 pb-6 bg-black/80 border-t border-[#63C697]/30 text-gray-200">
          <ul className="flex flex-col gap-4 text-base">
            <li><a href="#about" onClick={closeMenu} className="block hover:text-[#63C697]">About</a></li>
            <li><a href="#projects" onClick={closeMenu} className="block hover:text-[#63C697]">Projects</a></li>
            <li><a href="#contact" onClick={closeMenu} className="block hover:text-[#63C697]">Contact</a></li>
            <li><Link href="/experience" onClick={closeMenu} className="block hover:text-[#63C697]">3D Experience</Link></li>
          </ul>
        </nav>
      </div>

      {/* Click-away backdrop (mobile only) */}
      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={closeMenu}
          className="fixed inset-0 top-[64px] sm:hidden bg-black/40"
        />
      )}
    </header>
  );
}
