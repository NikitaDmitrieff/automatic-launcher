# Automatic Launcher

Lean launch copilot for solo indie hackers. Generates actionable launch plans with personalized channel recommendations, concrete links, and outreach playbooks.

## Tech Stack
- **Framework**: Next.js 15 (App Router, RSC)
- **UI**: React 19, Tailwind CSS v4
- **Style**: Minimalist glassmorphism, non-overwhelming, Reddit-friendly aesthetic
- **Testing**: Vitest
- **Language**: TypeScript

## Architecture
- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — React components (UI primitives, forms, results)
- `src/lib/` — Business logic, recommendation engine, channel data
- `src/types/` — TypeScript type definitions
- `__tests__/` — Test files

## Product Direction
- **Positioning**: No-bullshit premium founder OS for indie hackers
- **UX**: Lean, elegant, minimalist, fast — default flow is dead simple, advanced options collapsible
- **Output quality**: Proactive, high-signal, genuinely useful — concrete steps, templates, real links. Never fluffy generic checklists.
- **Copy tone**: Direct, confident, zero filler. Speak like a founder who ships, not a marketing page.
- **No Aceternity MCP** — keep UI dependencies minimal

## Key Design Decisions
- Hybrid recommendation engine: rules-based channel matching + AI-generated personalized advice
- Inputs: project name, short description, repo URL, demo URL (required); advanced fields collapsible
- Output: concise actionable launch plan, channel recommendations with links, outreach playbook, early validation actions
- Mobile-first responsive design
- No auth required — instant usage

## Conventions
- Use conventional commits (feat:, fix:, docs:, test:, chore:)
- Feature branches, never push directly to main
- Run tests before committing
- Keep components small and focused
- Use Tailwind for all styling (no CSS modules)
