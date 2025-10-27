import Image from 'next/image';
import React from 'react';

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-[#0f1115] relative"
    >
      {/* Subtle glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#63C697]/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Greeting and name */}
      <span className="text-[#63C697] uppercase tracking-widest text-sm mb-4">
        Software Engineer
      </span>
      <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
        Hi, I'm <span className="text-[#63C697]">Indy</span>
      </h1>
      <p className="text-gray-400 max-w-xl mb-8">
        I build beautiful, reliable, and cohesive web experiences. Simple, effective, and user-focused.
      </p>

      {/* Call to action */}
      <a
        href="#projects"
        className="border border-[#63C697] text-[#63C697] hover:bg-[#63C697] hover:text-[#0f1115] rounded-full px-8 py-3 font-medium tracking-wider transition-colors"
      >
        View My Work
      </a>

      {/* Profile image */}
      <div className="relative mt-12">
        <div className="rounded-full border-2 border-[#63C697]/40 p-2 shadow-[0_0_20px_rgba(99,198,151,0.2)]">
          <Image
            src="/profile.jpg"
            alt="Profile Picture"
            width={220}
            height={220}
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
