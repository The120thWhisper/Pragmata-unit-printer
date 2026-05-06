# PRAGMATA Unit Printer

A React-based upgrade cost tracker for PRAGMATA's Unit Printer.

The app helps players answer a practical question: given the Unit Printer levels they already own, how much Lim and Lunum is still needed to finish the currently available upgrades?

## What It Does

- Tracks listed Unit Printer upgrade levels.
- Provides top-level Unit Printer tabs for weapons, hacking, abilities, and attachments.
- Calculates remaining Lim and Lunum costs from the selected current level of each item.
- Breaks totals down by currently unlocked item type.
- Hides items until their Shelter License level makes them available.
- Handles board-unlocked weapons whose first level is unlocked outside the Unit Printer.
- Provides quick controls to reset progress or mark the current visible list as maxed.

Each item card shows its current level, remaining upgrade cost, Shelter-capped cost, full max cost, unlock notes when relevant, and a row of level bars that can be clicked to set progress.

## How To Use

1. Pick the active Unit Printer tab: Weapons, Hacking, Abilities, or Attachments.
2. Set the Shelter License level with the circular Shelter control.
3. Click an item's slanted level bars to set its current level.
4. Use the item image area to advance that item by one level.
5. Read the remaining Lim and Lunum totals at the top of the page.
6. Filter the visible list by item type when checking a specific upgrade category.

Level `0` means the item has not been printed or unlocked yet. Items with a Shelter cap of `0` are hidden and do not count toward totals until the selected Shelter License level unlocks them.

## Tech Stack

- React 19
- Vite
- Tailwind CSS utility classes
- Framer Motion for card layout animation

## Local Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Start the localhost-only data editor:

```sh
npm run config
```

The config panel runs at `http://127.0.0.1:8787/`, writes upgrade data into `src/data/*.json`, and saves uploaded icons under `public/images/<kind>/`. It is a local Node server, not a Vite route, so it is not included in the GitHub Pages build.

Create a production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Deployment

The project deploys to GitHub Pages with the workflow in `.github/workflows/deploy.yml`.

On every push to `main`, GitHub Actions installs dependencies, runs `npm run build`, uploads the generated `dist` directory, and deploys that build artifact to Pages. The generated `dist` directory is ignored locally and should not be committed.

The Vite production base path is configured for the repository URL:

```txt
/Pragmata-unit-printer/
```

In the repository's GitHub Pages settings, use GitHub Actions as the Pages source so the live site serves the built Vite output rather than the raw source files.

## Data Notes

Weapon upgrade costs, unlock notes, categories, image URLs, and Shelter License availability live in `src/data/weaponUpgrades.json`. Hacking upgrade source data lives in `src/data/hackingUpgrades.json`; Heat level 2 and 3 costs are intentionally stored as unknown until they can be confirmed, and each hacking item includes a `shelterLevels` array for future UI gating. Empty ability and attachment data files are present for future entries. The app also runs a small set of calculation self-tests in the browser console so obvious total-cost regressions are easier to catch during development.
