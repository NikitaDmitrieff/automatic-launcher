# Contributing to Automatic Launcher

Thanks for your interest in contributing! This project is built by and for indie hackers, and every contribution makes it better for the community.

## Getting Started

1. **Fork** the repo and clone your fork
2. **Install dependencies**: `pnpm install`
3. **Run dev server**: `pnpm dev`
4. **Run tests**: `pnpm test`

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```
2. Make your changes -- keep components small, use Tailwind for all styling
3. Run checks before committing:
   ```bash
   pnpm lint && pnpm test
   ```
4. Use [conventional commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation
   - `test:` tests
   - `chore:` maintenance
5. Open a PR against `main`

## Project Architecture

```
src/
  app/           Pages and API routes (Next.js App Router)
  components/    React components
  lib/           Business logic and recommendation engine
  types/         TypeScript types
__tests__/       Tests (Vitest)
```

Key files:
- `src/lib/engine.ts` -- Recommendation engine (rules-based matching)
- `src/lib/channels.ts` -- Channel database and metadata
- `src/lib/templates.ts` -- Outreach post templates
- `src/components/ProjectForm.tsx` -- Main input form
- `src/components/ChannelCard.tsx` -- Channel recommendation cards

## Code Style

- **TypeScript** for all new code
- **Tailwind CSS** for styling (no CSS modules)
- **Small, focused components** -- one responsibility per component
- **No unnecessary abstractions** -- simple > clever

## Adding a New Launch Channel

One of the easiest ways to contribute is adding new launch channels to the database:

1. Edit `src/lib/channels.ts`
2. Add a new channel entry with: name, URL, category, audience description, and matching rules
3. Add corresponding outreach templates in `src/lib/templates.ts`
4. Add tests for the new channel matching logic

## Reporting Bugs

Use the [bug report template](https://github.com/NikitaDmitrieff/automatic-launcher/issues/new?template=bug_report.md) and include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS info if relevant

## Requesting Features

Use the [feature request template](https://github.com/NikitaDmitrieff/automatic-launcher/issues/new?template=feature_request.md) and describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Questions?

Open a [discussion](https://github.com/NikitaDmitrieff/automatic-launcher/discussions) or file an issue. We're happy to help.
