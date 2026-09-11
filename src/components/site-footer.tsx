import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[72rem] flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:px-10">
        <p className="label">© {year} FlowPoint</p>
        <nav aria-label="Legal and support" className="flex gap-6 sm:ml-auto">
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground">
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}
