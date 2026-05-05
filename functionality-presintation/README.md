# Mock Vue App

Vue 3 + TypeScript starter created with Vite.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Architecture

The `src` directory is split into frontend clean architecture layers:

- `app` - application composition root, global providers, global styles.
- `pages` - page-level composition.
- `features` - user actions and application use cases.
- `entities` - domain models and business rules without UI dependencies.
- `shared` - reusable UI and low-level shared utilities.

Imports from `src` use the `@` alias.
