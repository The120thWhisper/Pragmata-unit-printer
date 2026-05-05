# PRAGMATA Unit Printer

A React-based upgrade cost tracker for PRAGMATA's Unit Printer weapons.

The app helps players answer a practical question: given the weapon levels they already own, how much Lim and Lunum is still needed to finish the rest of the Unit Printer upgrades?

## What It Does

- Tracks every listed weapon upgrade level in the Unit Printer.
- Calculates remaining Lim and Lunum costs from the selected current level of each weapon.
- Breaks totals down by main-game inventory and weapon type: Attack, Tactical, and Defensive.
- Keeps post-game weapons separate, with a toggle to include them in the grand total.
- Handles board-unlocked weapons whose first level is unlocked outside the Unit Printer.
- Provides quick controls to reset progress or mark all main-game weapons as maxed.

Each weapon card shows its current level, remaining upgrade cost, total max cost, unlock notes when relevant, and a row of level bars that can be clicked to set progress.

## How To Use

1. Click a weapon's slanted level bars to set its current level.
2. Use the weapon image area to advance that weapon by one level.
3. Read the remaining Lim and Lunum totals at the top of the page.
4. Filter the main list by weapon type when checking a specific upgrade category.
5. Toggle post-game weapons into the grand total when planning completion after the story.

Level `0` means the weapon has not been printed or unlocked yet, so all listed upgrade costs for that weapon are counted as remaining.

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

Upgrade costs, unlock notes, categories, and image URLs currently live in `src/App.jsx`. The app also runs a small set of calculation self-tests in the browser console so obvious total-cost regressions are easier to catch during development.
