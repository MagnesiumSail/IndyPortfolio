// data/projects.ts
export type Project = {
  id: string;
  title: string;
  blurb: string;
  image?: string;     // optional thumbnail url
  href?: string;      // optional link
  tech?: string[];    // optional tags
};

export const projects: Project[] = [
  {
    id: "olipopper",
    title: "Olipopper Studios",
    blurb: "Full-stack e-commerce (Next.js, TS, Tailwind, Postgres).",
    image: "",
    href: "https://example.com",
    tech: ["Next.js","TS","Postgres"]
  },
  {
    id: "streaker",
    title: "Streak Tracker",
    blurb: "Daily streaks with custom user system.",
    image: "",
    tech: ["Prisma","NextAuth"]
  }
  // add more by appending objects
];
