import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>FlowInput — input anything, get what you need.</p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link to="/workspace" className="hover:text-foreground">
            Workspace
          </Link>
          <Link to="/history" className="hover:text-foreground">
            History
          </Link>
          <Link to="/settings" className="hover:text-foreground">
            Settings
          </Link>
        </nav>
      </div>
    </footer>
  );
}
