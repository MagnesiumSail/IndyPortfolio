'use client';

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 bg-[#0f1115] text-gray-300 px-6 flex flex-col items-center text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">
        Get In <span className="text-[#63C697]">Touch</span>
      </h2>

      <p className="max-w-2xl text-gray-400 mb-10">
        I'm always open to new opportunities, collaborations, and conversations. Whether you want to discuss
        a project, share ideas, or just say hi — feel free to reach out.
      </p>

      <form
        className="w-full max-w-md flex flex-col gap-4 text-left"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="bg-[#1c1f26] border border-[#63C697]/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#63C697]/60"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="bg-[#1c1f26] border border-[#63C697]/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#63C697]/60"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          className="bg-[#1c1f26] border border-[#63C697]/20 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#63C697]/60"
        ></textarea>
        <button
          type="submit"
          className="self-center mt-4 border border-[#63C697] text-[#63C697] hover:bg-[#63C697] hover:text-[#0f1115] rounded-full px-8 py-3 font-medium tracking-wider transition-colors"
        >
          Send Message
        </button>
      </form>

      <p className="text-gray-500 text-sm mt-8">
        Or email me directly at{' '}
        <a
          href="mailto:contact@sail.dev"
          className="text-[#63C697] hover:underline"
        >
          contact@sail.dev
        </a>
      </p>
    </section>
  );
}