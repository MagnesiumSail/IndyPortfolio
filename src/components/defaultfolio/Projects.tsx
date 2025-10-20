export default function Projects() {
  const projects = [
    {
      title: 'Olipopper Studios',
      description:
        'A full-scale e-commerce platform for custom clothing built with Next.js, Tailwind, and PostgreSQL. Includes admin tools, product management, and SEO optimization.',
      tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
      link: '#',
      github: '#',
    },
    {
      title: 'StreakTracker',
      description:
        'A minimalist web app that tracks user consistency through streaks, gamifying productivity while maintaining clean data models and user authentication.',
      tech: ['React', 'Prisma', 'Node.js'],
      link: '#',
      github: '#',
    },
    {
      title: 'Indie Game Engine',
      description:
        'An experimental 2D engine prototype for pixel-based worlds with flexible entity systems and input control layers.',
      tech: ['JavaScript', 'Canvas API'],
      link: '#',
      github: '#',
    },
  ];

  return (
    <section id="projects" className="py-24 bg-[#0f1115] text-gray-300 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
          My <span className="text-[#63C697]">Projects</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A few examples of things I’ve built — from production-ready apps to creative experiments.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-[#1c1f26] border border-[#63C697]/20 rounded-lg p-6 text-left transition-transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(99,198,151,0.2)]"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
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
              <a
                href={project.link}
                className="hover:text-[#63C697] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live
              </a>
              <a
                href={project.github}
                className="hover:text-[#63C697] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
