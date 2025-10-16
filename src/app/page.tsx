export default function PortfolioScaffold() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-lg">My Portfolio</h1>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-4">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Mobile menu button */}
        <button className="sm:hidden">☰</button>
      </header>

      {/* Main */}
      <main className="flex-1 p-4">
        <section className="mb-4">
          <h2 className="text-xl">Welcome</h2>
          <p>This is a simple responsive layout.</p>
        </section>

        {/* Responsive grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border p-4">Box 1</div>
          <div className="border p-4">Box 2</div>
          <div className="border p-4">Box 3</div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t text-center">
        © 2025 My Portfolio
      </footer>
    </div>
  );
}
