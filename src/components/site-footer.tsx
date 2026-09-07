import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
        <p>© {year} FlowPoint</p>
        <nav aria-label="Legal and support" className="flex flex-wrap gap-x-5 gap-y-2 sm:ml-auto">
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/contact" className="hover:text-foreground">Support</Link>
        </nav>
      </div>
    </footer>
  );
}
