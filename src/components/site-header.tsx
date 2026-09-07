import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
        <Link
          to="/"
          aria-label="FlowPoint home"
          className="group flex items-center gap-2.5"
        >
          <BrandMark className="size-5" />

          <span className="text-base font-semibold">
            FlowPoint
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto hidden items-center gap-7 md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{
                className:
                  "relative py-2 text-sm text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-brand",
              }}
            >
              {item.label}
            </Link>
          ))}

          <Button asChild size="sm" className="ml-1 shadow-none">
            <Link to="/workspace">Open FlowPoint</Link>
          </Button>
        </nav>

        <div className="ml-auto md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className=""
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[20rem]">
              <SheetTitle className="text-lg font-semibold">
                FlowPoint
              </SheetTitle>

              <nav className="mt-8 flex flex-col">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-4 text-lg"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <Button
                asChild
                className="mt-8 w-full"
                onClick={() => setOpen(false)}
              >
                <Link to="/workspace">Open FlowPoint</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}