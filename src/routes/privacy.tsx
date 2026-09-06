import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, ProsePage, ProseSection } from "@/components/page-shell";
import { publicRouteMeta } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () =>
    publicRouteMeta({
      path: "/privacy",
      title: "Privacy notice — FlowInput",
      description:
        "How FlowInput handles your content: files and text are read in your browser, saved work stays on your device, and nothing is uploaded in this version.",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell>
      <ProsePage
        title="Privacy notice"
        intro="The short version: in this version of FlowInput, your content is read inside your browser and stays on your device."
        updated="September 2026"
      >
        <ProseSection heading="What happens to a file you open">
          <p>
            When you open a text, Markdown, Word or PDF file, it is read by code running in your own
            browser tab. The file is not uploaded, copied to a server, or shared with a third party.
            When you close the tab, the file itself is gone from the app.
          </p>
        </ProseSection>

        <ProseSection heading="What gets stored">
          <p>
            Only what you explicitly save. Saving a piece of work writes a shortened copy of the
            source and the result into your browser's local storage, on your device. Clearing your
            browser data — or using “Delete everything” in{" "}
            <Link to="/settings" className="text-primary underline underline-offset-2">
              settings
            </Link>{" "}
            — removes it permanently. There is no backup, because there is no server copy.
          </p>
        </ProseSection>

        <ProseSection heading="What we don't do">
          <p>
            No accounts, no advertising trackers, no selling of data, and no training of models on
            your content. There is no AI service connected in this version, so nothing is sent to
            one.
          </p>
        </ProseSection>

        <ProseSection heading="When that changes">
          <p>
            Optional accounts, cloud sync and assisted processing are planned. Those need a server,
            so they will be opt-in and this notice will be updated to describe exactly what is
            stored, where, and for how long before they ship.
          </p>
        </ProseSection>

        <ProseSection heading="Sensitive material">
          <p>
            Because processing happens locally, FlowInput is a reasonable place for ordinary working
            documents. Even so, use your own judgement with confidential or personal data — a shared
            or public computer keeps browser storage behind after you leave.
          </p>
        </ProseSection>
      </ProsePage>
    </PageShell>
  );
}
