import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageShell, ProsePage, ProseSection } from "@/components/page-shell";
import { publicRouteMeta } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () =>
    publicRouteMeta({
      path: "/terms",
      title: "Terms of use — FlowPoint",
      description:
        "The plain-language terms for using FlowPoint: what the workspace does, what you are responsible for, and the limits of the service.",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell>
      <ProsePage
        title="Terms of use"
        intro="Written in plain language. This is a summary of how FlowPoint works and what we each take responsibility for — it is not legal advice."
        updated="September 2026"
      >
        <ProseSection heading="What FlowPoint is">
          <p>
            FlowPoint is a workspace for reshaping content you already have. You bring text or a
            file, choose what you want back, and the app produces a prepared version you can copy,
            download or save.
          </p>
          <p>
            The current version works with rule-based processing that runs in your browser. It does
            not judge whether your material is accurate, complete or suitable for any particular
            purpose — always read the result before you use it.
          </p>
        </ProseSection>

        <ProseSection heading="Your content and your rights">
          <p>
            Everything you bring here stays yours. We claim no ownership over your source material
            or over anything the workspace produces from it.
          </p>
          <p>
            In return, you confirm that you have the right to use the content you put in. Do not use
            FlowPoint for material you are not allowed to copy, for private information belonging to
            other people, or for anything unlawful.
          </p>
        </ProseSection>

        <ProseSection heading="Acceptable use">
          <p>
            Please do not attempt to break, overload or reverse-engineer the service, upload harmful
            files, or use it in a way that puts other people's data at risk.
          </p>
        </ProseSection>

        <ProseSection heading="No guarantees">
          <p>
            FlowPoint is provided as it is, without a promise of uninterrupted availability or of a
            particular result. Output quality depends on the material you provide. Nothing produced
            here should be treated as professional, legal, medical or financial advice.
          </p>
        </ProseSection>

        <ProseSection heading="Changes">
          <p>
            The product is early and these terms will change as features land — for example when
            accounts and cloud storage are added. Significant changes will be noted on this page.
          </p>
          <p>
            Questions? See{" "}
            <Link to="/contact" className="underline decoration-rule underline-offset-4">
              contact and support
            </Link>
            .
          </p>
        </ProseSection>
      </ProsePage>
    </PageShell>
  );
}
