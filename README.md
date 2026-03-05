# Automatic Launcher

Lean launch copilot for solo indie hackers. Input your project details, get an actionable launch plan with personalized channel recommendations, concrete links, and outreach playbooks.

<!-- ![Screenshot](docs/screenshot.png) -->

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **UI**: React 19, Tailwind CSS v4
- **Style**: Minimalist glassmorphism, dark theme
- **Testing**: Vitest
- **Language**: TypeScript

## Architecture

```
src/
  app/        — Next.js App Router pages and layouts
  components/ — React components (UI primitives, forms, results)
  lib/        — Business logic, recommendation engine, channel data
  types/      — TypeScript type definitions
__tests__/    — Test files
```

The recommendation engine uses a hybrid approach: rules-based channel matching combined with AI-generated personalized advice.

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes — keep components small, use Tailwind for styling
3. Run `pnpm test` and `pnpm lint` before committing
4. Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
5. Open a PR against `main`

## License

[MIT](LICENSE)
