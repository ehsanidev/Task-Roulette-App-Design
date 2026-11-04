# Task Roulette

Task Roulette is a Persian-first mobile task planner that turns a daily to-do list into a colorful roulette wheel. Add tasks, spin to choose what to work on next, record completion notes and difficulty, and review progress in the stats screen. The project is being prepared as an Android app for distribution through Café Bazaar.

## Features

- Add daily tasks with descriptions and priority levels.
- Spin the task wheel to select an active task at random.
- Record completion notes, difficulty, and completion time, or skip a selected task.
- View completion, pending, skipped, and spin-count statistics.
- Switch between dark and light themes.
- Save task, profile, and theme preferences locally with AsyncStorage via Zustand persistence.
- Persian RTL interface based on the provided Task Roulette design.

## Technology

- React Native and Expo
- TypeScript
- Zustand for app state
- AsyncStorage for local persistence
- React Native SVG for the roulette wheel and charts
- NativeWind / Tailwind CSS utilities

## Run locally

```bash
npm install
npx expo start
```

Use the Expo CLI prompts to open the app on an Android device or emulator. Android release configuration and Café Bazaar listing materials should be finalized before publishing.

## Project structure

- `App.tsx` — app entry point and screen composition
- `src/components` — reusable UI components, including the task wheel and charts
- `src/screens` — login, dashboard, report, and statistics screens
- `src/store` — Zustand state and app actions
- `src/data` — initial sample task data
- `src/constants` — shared color and priority constants
- `src/theme` — theme palette
- `src/types` — TypeScript domain types
- `src/utils` — shared utilities, including wheel geometry

## Current status

This repository contains the mobile app implementation and its core task-management flows. Before a public release, replace or remove sample task content as appropriate, provide final app branding assets and a unique Android application ID, verify the release build on real devices, and prepare the privacy policy and Café Bazaar listing information. User profile and task data are stored on-device; the app does not currently require a backend.
