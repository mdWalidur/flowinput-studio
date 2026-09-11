import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Point } from "@/components/point";

const NAV = [
  { to: "/workspace", label: "Workspace" },
  { to: "/my-work", label: "My work" },
  { to: "/settings", label: "Settings" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-14 max-w-[72rem] items-center px-6 sm:px-10">
        <Link to="/" aria-label="FlowPoint home" className="flex items-baseline gap-1.5">
          <span className="text-sm font-medium tracking-tight">FlowPoint</span>
          <Point state="active" />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-8 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              activeProps={{
                className: "flex items-center gap-2 text-sm font-medium text-foreground",
              }}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <Point
                    state={isActive ? "active" : "idle"}
                    className={isActive ? "" : "opacity-0"}
                  />
                  {item.label}
                </>
              )}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto text-sm text-muted-foreground sm:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-border sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border px-6 py-4 text-sm text-muted-foreground last:border-b-0"
              activeProps={{
                className:
                  "block border-b border-border px-6 py-4 text-sm font-medium text-foreground last:border-b-0",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
