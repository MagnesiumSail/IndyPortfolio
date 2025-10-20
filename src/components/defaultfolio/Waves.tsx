"use client";

import { useEffect, useRef } from "react";

export default function ParallaxWaves() {
  const l1Ref = useRef<SVGSVGElement | null>(null);
  const l2Ref = useRef<SVGSVGElement | null>(null);
  const l3Ref = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const rqm =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (rqm?.matches) return;

    let raf = 0;

    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const between = (x: number, start: number, end: number) =>
      clamp((x - start) / (end - start), 0, 1);

    const START = 0.6; // 60% down the page
    const END = 1.0;   // bottom

    const START_Y_FRONT = 120;
    const START_Y_MID = 85;
    const START_Y_BACK = 55;

    const update = () => {
      const vh = window.innerHeight || 1;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - vh);
      const scrollY = window.scrollY || 0;

      const g = clamp(scrollY / maxScroll);
      const local = between(g, START, END);

      const eased = local * local;

      const y1 = (1 - eased) * START_Y_FRONT;
      const y2 = (1 - eased) * START_Y_MID;
      const y3 = (1 - eased) * START_Y_BACK;

      if (l1Ref.current) l1Ref.current.style.transform = `translate3d(0, ${y1}px, 0)`;
      if (l2Ref.current) l2Ref.current.style.transform = `translate3d(0, ${y2}px, 0)`;
      if (l3Ref.current) l3Ref.current.style.transform = `translate3d(0, ${y3}px, 0)`;

      const opacity = clamp(between(g, START + 0.04, END));
      if (wrapRef.current) wrapRef.current.style.opacity = String(opacity);

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    const onResize = () => update();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 h-[18vh] md:h-[22vh] lg:h-[26vh] opacity-0 transition-opacity"
      style={{ zIndex: 0 }}
    >
      {/* back wave */}
      <svg
        ref={l3Ref}
        className="absolute inset-x-0 bottom-0 w-full h-[120%] will-change-transform"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveBack" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1e2230" />
            <stop offset="100%" stopColor="#0f1115" />
          </linearGradient>
        </defs>
        <path
          d="M0,256L60,245.3C120,235,240,213,360,192C480,171,600,149,720,149.3C840,149,960,171,1080,170.7C1200,171,1320,149,1380,138.7L1440,128V320H0Z"
          fill="url(#waveBack)"
          opacity="0.55"
        />
      </svg>

      {/* mid wave */}
      <svg
        ref={l2Ref}
        className="absolute inset-x-0 bottom-0 w-full h-[120%] will-change-transform"
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveMid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#63C697" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#358e6b" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <path
          d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,186.7C672,192,768,160,864,165.3C960,171,1056,213,1152,224C1248,235,1344,213,1392,202.7L1440,192V320H0Z"
          fill="url(#waveMid)"
        />
      </svg>

      {/* front wave */}
      <svg
        ref={l1Ref}
        className="absolute inset-x-0 bottom-0 w-full h-[130%] will-change-transform"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveFront" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#63C697" />
            <stop offset="100%" stopColor="#3fb37d" />
          </linearGradient>
        </defs>
        <path
          d="M0,288L60,272C120,256,240,224,360,208C480,192,600,192,720,197.3C840,203,960,213,1080,208C1200,203,1320,181,1380,170.7L1440,160V320H0Z"
          fill="url(#waveFront)"
        />
      </svg>
    </div>
  );
}
