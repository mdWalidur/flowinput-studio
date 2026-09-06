# FlowInput Studio

Build the MVP for a production-quality Micro SaaS web app called "FlowInput" (working name). Core promise: "Input anything. Get what you need." This is not only a PDF converter and not only an AI creative tool. Users can upload or paste content, choose their goal, transform the content, preview the result, then copy or download it.

Build a polished responsive full-stack TypeScript app using the default stack, Tailwind and shadcn/ui. Prioritize security-minded architecture, stability, accessibility, fast perceived performance, clear loading/error states, and excellent UI/UX. Do not pretend unsupported AI integrations exist; use local/demo transformation behavior with clear architecture boundaries where a future backend/AI provider can be connected.

MVP features:
1. Landing page with strong value proposition and feature overview.
2. App workspace/dashboard.
3. Input Studio: drag/drop upload area plus paste text. Support UI for PDF, DOCX, TXT, Markdown and plain text; validate type/size client-side and show friendly errors. For the first build, TXT/Markdown/plain text should genuinely flow through; unsupported server parsing for PDF/DOCX must be honestly indicated rather than faked.
4. Goal selection cards: Convert to Markdown, Prepare for Study, Optimize for AI, Build Website/App Specification, Optimize a Prompt.
5. Result Studio with source preview and output preview.
6. Working deterministic demo transformations for text-based input:
   - Markdown cleanup/normalization
   - Study context wrapper and structured sections
   - AI-ready context/prompt wrapper
   - Website/app specification scaffold inferred from the input
   - Prompt optimization template
7. Copy result button and real .md or .txt download where applicable.
8. Recent work/history stored locally for the MVP, with a clean repository/service boundary so authenticated cloud persistence can be added later.
9. Basic project/work item model so future Creative Studio can reuse the same core entities.

Information architecture: Landing, Workspace, New Transformation flow, History, Settings placeholder. Main workspace should guide: Input -> Choose Goal -> Configure -> Transform -> Review -> Copy/Download/Save.

Design direction: premium modern productivity tool, minimal but not empty, excellent spacing and hierarchy, subtle depth, professional typography, responsive mobile layout, accessible contrast. Avoid generic AI neon aesthetics and excessive gradients. The UI should make different user types feel welcome: students, developers, researchers, and image/video creators, without forcing any one workflow.

Architecture: modular components, typed domain models, transformation strategy/adapter pattern keyed by goal, provider interfaces reserved for future AI services and external platform connections, centralized validation, safe error handling, no secrets in client code. Add clear TODO comments for production server-side file parsing, malware scanning, auth/authorization, rate limiting, object storage, background jobs, and audit logging.

Seed the app with useful example text so the user can immediately test the complete flow. Build the actual pages and working interactions now, not just a static mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f58f644-f55b-469c-8145-9824edb7302b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
