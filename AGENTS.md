## Cursor Cloud specific instructions

**Feel Lab** is a client-side-only React SPA (no backend, no database, no auth, no `.env` files).

### Services

| Service | Command | Notes |
|---|---|---|
| Vite dev server | `npm run dev` | Serves on port 5173 with HMR |

### Common commands

See `package.json` `scripts` for the full list:
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Preview**: `npm run preview` (serves the `dist/` build output)

### Caveats

- ESLint has ~39 pre-existing errors (mostly `react-hooks/refs` in `ButtonPlayground.jsx` and unused imports in `ExamplesSection.jsx`). These are not regressions.
- No test framework is configured; there are no automated test files. Validation requires manual browser interaction.
- The single `.ts` file (`src/utils/framerSoundOverride.ts`) is a code-generation utility — Vite handles it natively.
