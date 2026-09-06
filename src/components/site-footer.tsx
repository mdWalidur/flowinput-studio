import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface-2">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5 text-primary">
            <BrandMark className="size-7" />
            <span className="font-display text-base font-medium text-foreground">FlowInput</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A quiet workspace for getting your own material into the shape you actually need.
          </p>
        </div>

        <nav aria-label="Product" className="text-sm">
          <h2 className="font-medium text-foreground">Product</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/workspace" className="hover:text-foreground">
                Open the workspace
              </Link>
            </li>
            <li>
              <Link to="/my-work" className="hover:text-foreground">
                My saved work
              </Link>
            </li>
            <li>
              <Link to="/settings" className="hover:text-foreground">
                Settings and limits
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal and support" className="text-sm">
          <h2 className="font-medium text-foreground">Legal &amp; support</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/terms" className="hover:text-foreground">
                Terms of use
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy notice
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact and support
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} FlowInput. All rights reserved.</p>
          <p>You keep the rights to everything you bring here.</p>
        </div>
      </div>
    </footer>
  );
}
