export default function About() {
  return (
    <section
      id="about"
      className="py-24 bg-[#0f1115] text-gray-300 px-6 flex flex-col items-center text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">
        About <span className="text-[#63C697]">Me</span>
      </h2>

      <p className="max-w-2xl text-gray-400 leading-relaxed mb-8">
        I'm Indiana Brown — a software engineer specializing in full-stack web development. I enjoy
        building reliable systems, designing user-first interfaces, and solving problems with optimized code.
        Whether it's crafting backend web applications or experimenting with modern frontend frameworks,
        I value elegance, function, and learning something new every day for my toolbox.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-lg text-sm">
        <div className="bg-[#1c1f26] rounded-lg p-4 border border-[#63C697]/20">
          <p className="font-semibold text-[#63C697] mb-1">Frontend</p>
          <p className="text-gray-400">Next.js · React · Tailwind</p>
        </div>
        <div className="bg-[#1c1f26] rounded-lg p-4 border border-[#63C697]/20">
          <p className="font-semibold text-[#63C697] mb-1">Backend</p>
          <p className="text-gray-400">Node.js · SQL · Prisma</p>
        </div>
        <div className="bg-[#1c1f26] rounded-lg p-4 border border-[#63C697]/20">
          <p className="font-semibold text-[#63C697] mb-1">Tools</p>
          <p className="text-gray-400">Git · Vercel · Stripe</p>
        </div>
      </div>
    </section>
  );
}
