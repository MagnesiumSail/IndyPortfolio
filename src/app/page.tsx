export default function PortfolioScaffold() {
  const projects: { title: string; tech: string[]; blurb: string; link?: string }[] = [
    {
      title: "Project One",
      tech: ["Next.js", "TypeScript", "Tailwind"],
      blurb: "A quick sentence about what this does and the impact.",
      link: "#",
    },
    {
      title: "Project Two",
      tech: ["Node", "PostgreSQL"],
      blurb: "Another project. Keep it brief and outcomes-focused.",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Indiana Brown</h1>
            <p className="text-sm text-neutral-500">Software Engineer</p>
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#about" className="hover:underline">About</a>
            <a href="#projects" className="hover:underline">Projects</a>
            <a href="#resume" className="hover:underline">Resume</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-3">
        {/* Left rail / profile */}
        <aside className="md:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-neutral-100 text-2xl">🙂</div>
                <div>
                  <div className="font-semibold">Indiana Brown</div>
                  <div className="text-sm text-neutral-500">they/he • Seattle-ish</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-neutral-700">
                Short tagline goes here. Example: "I build fast, accessible web apps and love shipping polished UX."
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-neutral-100 px-3 py-1">TypeScript</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1">React</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1">Postgres</span>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a className="hover:underline" href="#about">About me</a></li>
                <li><a className="hover:underline" href="#projects">Featured projects</a></li>
                <li><a className="hover:underline" href="#resume">Download resume</a></li>
                <li><a className="hover:underline" href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Right content with dropdowns */}
        <section className="md:col-span-2 space-y-4">
          <Dropdown id="about" title="About Me">
            <p className="text-sm leading-6 text-neutral-700">
              Keep this tight. 3–5 sentences about your focus, strengths, and what you want next.
            </p>
          </Dropdown>

          <Dropdown id="projects" title="Projects">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <article key={p.title} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                  <h4 className="font-semibold">{p.title}</h4>
                  <p className="mt-2 text-sm text-neutral-700">{p.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {p.tech.map((t) => (
                      <span key={t} className="rounded-full bg-neutral-100 px-3 py-1">{t}</span>
                    ))}
                  </div>
                  {p.link && (
                    <a href={p.link} className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">
                      View project
                    </a>
                  )}
                </article>
              ))}
            </div>
          </Dropdown>

          <Dropdown id="resume" title="Resume">
            <div className="flex items-center justify-between rounded-xl border bg-white p-4">
              <div>
                <div className="font-medium">Resume.pdf</div>
                <div className="text-xs text-neutral-500">Last updated: Jan 2025</div>
              </div>
              <div className="flex gap-2">
                <a href="#" className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50">Preview</a>
                <a href="#" className="rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800">Download</a>
              </div>
            </div>
          </Dropdown>

          <Dropdown id="contact" title="Contact">
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:underline" href="mailto:hello@example.com">hello@example.com</a>
              </li>
              <li>
                <a className="hover:underline" href="#">Github</a>
              </li>
              <li>
                <a className="hover:underline" href="#">LinkedIn</a>
              </li>
            </ul>
          </Dropdown>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-xs text-neutral-500">
          <span>© {new Date().getFullYear()} Indiana Brown</span>
          <span>Built with Next.js + Tailwind</span>
        </div>
      </footer>
    </div>
  );
}

function Dropdown({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <details id={id} className="group rounded-2xl border bg-white p-4 open:shadow-sm" open>
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Chevron className="transition group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function Chevron(props: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="w-15 h-15 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5" {...props}>
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
