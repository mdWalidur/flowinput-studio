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
    <header className="sticky top-0 z-40 border-b border-border/75 bg-background/90 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center px-5 sm:px-8">
        <Link
          to="/"
          aria-label="FlowInput home"
          className="group flex items-center gap-3"
        >
          <BrandMark className="size-7 transition-transform duration-300 group-hover:-rotate-3" />

          <span className="font-display text-xl tracking-tight">
            FlowInput
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto hidden items-center gap-8 md:flex"
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

          <Button asChild size="sm" className="ml-1 rounded-full px-5">
            <Link to="/workspace">Start something</Link>
          </Button>
        </nav>

        <div className="ml-auto md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="rounded-full"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[20rem]">
              <SheetTitle className="font-display text-xl">
                FlowInput
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
                className="mt-8 w-full rounded-full"
                onClick={() => setOpen(false)}
              >
                <Link to="/workspace">Start something</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}