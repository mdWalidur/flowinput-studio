# FlowInput

FlowInput is a content preparation workspace: bring existing material, choose your goal, and get a usable output you can review, copy, download, and save.

## What FlowInput Does

FlowInput helps users transform existing content into a next-step format:

- notes to clean Markdown
- source text to study material
- source text to AI-ready context
- rough product ideas to a website/app plan
- rough prompts to clearer prompts

## Product Philosophy

**INPUT → FLOW → OUTPUT**

- **Input**: what you already have (text, file, prompt, idea)
- **Flow**: deterministic preparation steps
- **Output**: structured result for immediate use

## Current MVP

- Interactive landing page with a lightweight Flow demo
- Workspace flow: input → goal → options → result
- Local deterministic transformations (no AI provider required)
- Result review with copy/download/save
- My Work history stored in browser localStorage

## Supported Inputs

- Paste text
- Start with an idea
- Upload `.txt`, `.md`, `.markdown`, `.docx`, `.pdf` (text-based PDF)

## Transformation Goals

1. Convert to Markdown
2. Prepare for Study
3. Prepare for AI
4. Turn into a Website/App Plan
5. Improve a Prompt

## Architecture

- **Domain**: typed entities in `src/domain`
- **Input & parsing**: `src/lib/parsing` and `src/lib/validation`
- **Transformation engine**: strategy pattern in `src/lib/transform`
- **Persistence**: repository boundary in `src/services/work-item-repository.ts`
- **UI**: route-driven app with reusable components in `src/components`
- **Extensibility**: provider interfaces in `src/lib/providers/ai-provider.ts`

## Local Development

```sh
npm install
npm run dev
```

### Quality checks

```sh
npm run lint
npm run build
npm run test
```

## Environment Variables

- `VITE_SITE_URL` — canonical public base URL used for metadata, robots, and sitemap generation.

## Security Model

Current MVP security posture:

- processing is local in-browser for current transformations
- no client-side API keys
- centralized file validation (type/size/MIME/signature checks where practical)
- safe Markdown rendering (no raw HTML injection)
- SSR error fallback with secure response headers

Future production controls (not implemented yet):

- authenticated API boundary
- signed uploads and object storage
- malware scanning
- background processing jobs
- provider access via server-side secrets only

## Current Limitations

- No OCR for scanned/image-only PDFs
- No account system
- No cloud sync
- No live AI provider integrations
- Saved work is local to the current browser and can be lost if browser data is cleared

## Roadmap

- Optional accounts and cloud persistence
- Server-side document processing pipeline
- Real provider adapters for AI transforms
- Stronger audit and observability controls

## Contributing

1. Keep changes focused and architecture-aligned.
2. Preserve honesty in product claims (no fake AI/OCR/cloud behavior).
3. Validate with lint/build/tests before shipping.
