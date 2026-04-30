# src/

Application source root. All code lives here.

## Directory Map

| Directory | Purpose |
|---|---|
| `app/` | Next.js App Router entry points — layout, page, global CSS |
| `components/` | React UI components — game board, keyboard, dialogs, primitives |
| `hooks/` | Thin wrappers over React contexts (`useGame`, `useAudio`) |
| `providers/` | Context providers holding game state and audio state |
| `utils/` | Pure functions — validation, math evaluation, feedback logic, daily puzzle |
| `lib/` | Shared utility (`cn` for Tailwind class merging) |

## Naming Conventions

- Files: `kebab-case.tsx` / `kebab-case.ts`
- Components: PascalCase exports
- Hooks: `use-*.ts` with camelCase export (`useGame`, `useAudio`)
- Providers: PascalCase + `Provider` suffix
- Utils: named exports, no default exports

## Path Alias

`@/` maps to `src/`. Use it for all internal imports.
