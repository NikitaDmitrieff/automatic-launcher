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

One of the easiest ways to contribute is adding new launch channels to the database.

### 1. Add the channel definition

Edit `src/lib/channels.ts` and add a new entry to the `CHANNELS` array:

```typescript
{
  name: 'My New Channel',
  type: 'community',          // 'social' | 'community' | 'news' | 'directory' | 'email'
  url: 'https://example.com/',
  description: 'Short description of the channel and its audience.',
  audienceSize: '50k+ members',
  effort: 'medium',           // 'low' | 'medium' | 'high'
  cost: 'free',               // 'free' | 'low' | 'medium'
}
```

### 2. Update scoring/bonus logic

The recommendation engine scores each channel against the user's project input. Scoring bonuses live in `src/lib/engine.ts`:

- **Category bonuses** (`getCategoryBonus`) -- Maps project categories (`saas`, `devtool`, etc.) to per-channel score adjustments. Add your channel name to the relevant category objects:
  ```typescript
  devtool: {
    'My New Channel': 10,  // +10 bonus for devtool projects
    // ...
  },
  ```
- **Audience bonuses** (`getAudienceBonus`) -- Same pattern, keyed by target audience (`developers`, `founders`, etc.).
- **Developer/product channel lists** (`isDeveloperChannel`, `isProductChannel`) -- Add your channel name if it qualifies. This controls the +5 URL bonus.

The `scoreChannel` function starts at 50 and applies all bonuses, clamping the result to 0-100.

### 3. Add outreach templates

Edit `src/lib/templates.ts` and add a new entry to the `outreachTemplates` array:

```typescript
{
  id: 'my-new-channel',
  channelName: 'My New Channel',
  channelType: 'community',   // matches the OutreachTemplate['channelType'] union
  subject: '{{projectName}} -- {{description}}',
  body: `Your template here. Use {{projectName}}, {{description}}, and {{demoUrl}} as placeholders.`,
  tips: [
    'DO: ...',
    "DON'T: ...",
  ],
}
```

Available placeholders: `{{projectName}}`, `{{description}}`, `{{demoUrl}}`. All values are HTML-escaped before substitution.

### 4. Add action items (optional)

If your channel needs specific launch steps, add a `case` to the `generateActionItems` switch in `src/lib/engine.ts`:

```typescript
case 'My New Channel':
  items.push('Step-by-step action for launching on this channel');
  break;
```

### 5. Write tests

Add tests in `__tests__/` to verify:
- The channel appears in recommendations for matching project inputs
- The scoring bonuses produce expected scores
- The outreach template fills correctly

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
