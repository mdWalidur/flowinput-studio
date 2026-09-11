# FlowPoint roadmap

## Done
- Design system: closed type/spacing scale, warm paper + neutral ink tokens, one orange signal, hairlines only, 180ms motion.
- One signature primitive (`Point`, `DirectionLine`) reused for brand, selection, progress and result state.
- Homepage: single composer seeded with a real example, plain direction row, one Continue action, hands off to the workspace.
- Workspace: one continuous instrument — source editor, direction/control strip, result. No dashboard rail, no pills or switches.
- Result Studio: quiet header, document measure, per-goal structure, one disclosure row (What changed · Source · Raw).
- My work / Settings / legal pages aligned to the same grid and language.
- Hygiene: shared source construction (`src/lib/source.ts`), draft handoff service, orphan components removed, unused Fraunces font dropped, hydration mismatch resolved.

## Open (needs a decision or backend)
- Accounts, cloud storage of saved work, server-side parsing/OCR — all require a backend; currently declared as planned in Settings only.
- Unused shadcn shims and their dependencies (recharts, embla, vaul, day-picker, input-otp, cmdk, resizable-panels) are still installed; prune once no future screen needs them.
