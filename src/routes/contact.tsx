import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, MessageSquare, ShieldAlert } from "lucide-react";
import { PageShell, ProsePage, ProseSection } from "@/components/page-shell";
import { publicRouteMeta } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () =>
    publicRouteMeta({
      path: "/contact",
      title: "Contact and support — FlowPoint",
      description:
        "How to reach the FlowPoint team about a problem, a file that would not open, a feature request or a security concern.",
    }),
  component: ContactPage,
});

const CHANNELS = [
  {
    icon: LifeBuoy,
    title: "Something didn't work",
    body: "A file that wouldn't open, a result that came out wrong, a page that broke. Tell us the file type and what you expected.",
  },
  {
    icon: MessageSquare,
    title: "A request or an idea",
    body: "Missing a goal you'd use every week? Describe the job you're trying to finish rather than the feature, if you can.",
  },
  {
    icon: ShieldAlert,
    title: "A security concern",
    body: "Report it privately and give us time to fix it before sharing details publicly. We'll confirm we received it.",
  },
];

function ContactPage() {
  return (
    <PageShell>
      <ProsePage
        title="Contact and support"
        intro="FlowPoint is early, and messages from people using it shape what gets built next."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {CHANNELS.map((channel) => (
            <div key={channel.title} className="border-t border-border pt-4">
              <channel.icon className="size-4 text-signal" aria-hidden="true" />
              <h2 className="mt-3 text-base font-medium">{channel.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{channel.body}</p>
            </div>
          ))}
        </div>

        <ProseSection heading="Where to send it">
          <p>
            A support address is not published yet — this page is the placeholder for it. Add your
            real support email or help-desk link here before launch so the footer links resolve to
            something people can actually use.
          </p>
          <p>
            Until then, the fastest way to unblock yourself is usually{" "}
            <Link to="/settings" className="underline decoration-rule underline-offset-4">
              settings
            </Link>
            , which lists the current size limits and the file types that are fully supported.
          </p>
        </ProseSection>

        <ProseSection heading="What helps us help you">
          <p>
            The goal you picked, the kind of source you used, roughly how long it was, and your
            browser. Please don't send confidential documents — a short excerpt that reproduces the
            problem is enough.
          </p>
        </ProseSection>
      </ProsePage>
    </PageShell>
  );
}
