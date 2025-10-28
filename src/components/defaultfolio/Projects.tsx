export default function Projects() {
  const projects = [
    {
      title: "Olipopper Studios",
      description:
        "A full-scale e-commerce platform for custom clothing built for a client with Next.js, TypeScript, Tailwind, Prisma, and PostgreSQL. Features include an admin dashboard, order and product management, Stripe payments, Resend emails, and image uploads via Uploadthing. Designed as a polished production-ready MVP for a real small business.",
      tech: [
        "Next.js",
        "TypeScript",
        "Tailwind",
        "Prisma",
        "PostgreSQL",
        "Stripe",
      ],
      link: "https://www.olipopperstudios.com/",
      github: "https://github.com/MagnesiumSail/OlipopperStudios",
    },
    {
      title: "BoatDealsDirect",
      description:
        "A marketplace web app for buying and selling boats, built during my internship using WordPress, Elementor, GeoDirectory, and Gravity Forms. Integrated advanced search filters, dynamic map listings, and user submission workflows while optimizing performance and UX within WordPress constraints.",
      tech: ["WordPress", "Elementor", "GeoDirectory", "Gravity Forms", "PHP"],
      link: "https://boatdealsdirect.com/",
    },
    {
      title: "Three.js Portfolio",
      WiP: true,
      description:
        "A personal portfolio site built with Next.js, React-Three-Fiber, and custom GLSL shaders. Features a 3D starfield skybox, parallax camera motion, and dynamic gradients to blend design and performance. Serves as both a creative expression exploration and a technical demonstration of real-time rendering in React.",
      tech: ["Next.js", "React-Three-Fiber", "GLSL", "TypeScript", "Tailwind"],
      link: "#",
      github: "https://github.com/MagnesiumSail/IndyPortfolio",
    },
  ];

  return (
    <section id="projects" className="py-24 bg-[#0f1115] text-gray-300 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
          My <span className="text-[#63C697]">Projects</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A few examples of things I've built — from production-ready apps to
          creative experiments.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <div
            key={index}
            className="relative bg-[#1c1f26] border border-[#63C697]/20 rounded-lg p-6 text-left transition-transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(99,198,151,0.2)]"
          >
            {project.WiP && (
              <span className="absolute top-2 right-2 bg-[#63C697] text-black text-xs font-semibold py-1 px-2 rounded">
                Current WiP
              </span>
            )}
            <h3 className="text-xl font-semibold text-white mb-2">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 border border-[#63C697]/30 rounded-full text-[#63C697]"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4 text-sm">
              {project.link && (
                <a
                  href={project.link}
                  className="hover:text-[#63C697] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  className="hover:text-[#63C697] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
