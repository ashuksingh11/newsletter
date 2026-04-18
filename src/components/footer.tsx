// A reusable Footer component.

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} The Newsletter. All rights reserved.
      </div>
    </footer>
  );
}
