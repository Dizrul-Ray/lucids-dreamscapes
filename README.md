# Lucid's Dreamscapes

A local-first creative writing experience built with React + Vite.

## What was rewritten

The app was rebuilt to provide a simpler and more reliable flow:

- Local account creation + sign-in.
- Autosaved per-user draft workspace.
- Explicit save-to-library flow for creations.
- Load/delete saved versions.
- Prompt generator and character forge.

## Local-first behavior

All data is stored in browser `localStorage`:

- `creative-writing/users`
- `creative-writing/session`
- `creative-writing/draft/<email>`
- `creative-writing/creations/<email>`

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
