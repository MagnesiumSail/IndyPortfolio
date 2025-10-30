"use client";

import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    // basic guard
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong.");
    }
  }

  return (
    <section
      id="contact"
      className="py-24 bg-[#0f1115] text-gray-300 px-6 flex flex-col items-center text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">
        Get In <span className="text-[#63C697]">Touch</span>
      </h2>

      <p className="max-w-2xl text-gray-400 mb-10">
        I'm always open to new opportunities, collaborations, and conversations.
        Whether you want to discuss a project, share ideas, or just say hi - feel free to reach out.
      </p>

      <form
        className="w-full max-w-md flex flex-col gap-4 text-left"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="bg-[#1c1f26] border border-[#63C697]/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#63C697]/60"
          disabled={status === "loading"}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="bg-[#1c1f26] border border-[#63C697]/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#63C697]/60"
          disabled={status === "loading"}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="bg-[#1c1f26] border border-[#63C697]/20 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#63C697]/60"
          disabled={status === "loading"}
        />

        {errorMsg ? (
          <p className="text-red-400 text-sm">{errorMsg}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className={`self-center mt-4 border border-[#63C697] text-[#63C697] rounded-full px-8 py-3 font-medium tracking-wider transition-colors
            ${status === "loading" ? "opacity-60 cursor-not-allowed" : "hover:bg-[#63C697] hover:text-[#0f1115]"}`}
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>

        {status === "success" ? (
          <p className="text-green-400 text-center text-sm mt-2">
            Thanks! I got your message.
          </p>
        ) : null}
      </form>

      <p className="text-gray-500 text-sm mt-8 mb-1 md:mb-10 lg:mb-15">
        <span className="inline-flex items-center gap-1 bg-white/10 rounded-full px-2 py-1 align-middle">
          Or email me directly at{" "}
          <a
            href="mailto:contact@sail.dev"
            className="text-[#63C697] hover:underline focus:outline-none focus:ring-2 focus:ring-[#63C697]/40 rounded-sm"
          >
            contact@indybrown.me
          </a>
        </span>
      </p>
    </section>
  );
}
