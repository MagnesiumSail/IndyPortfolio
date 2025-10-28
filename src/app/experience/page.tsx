import Scene from "@/components/Scene";

export default function Home() {
  return (
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="border border-black">
          <Scene />
        </div>
      </main>
  );
}