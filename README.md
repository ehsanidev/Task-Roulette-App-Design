# Task Roulette Mobile App

A polished React Native + Expo app inspired by the provided Task Roulette design and built for mobile use with a clean, production-oriented project structure.

## Tech stack
- React Native
- Expo
- TypeScript
- React Native SVG
- Zustand for state management
- NativeWind / Tailwind-style utility setup

## Run locally
1. Install dependencies:
   npm install
2. Start the app:
   npx expo start
3. Run on Android/iOS/web as needed.

## Project structure
- `src/components` — reusable UI pieces
- `src/screens` — screen-level views
- `src/data` — sample/static datasets
- `src/store` — Zustand app store and state logic
- `src/constants` — color and design constants
- `src/theme` — theme config
- `src/types` — TypeScript domain types
- `src/utils` — geometry and helper utilities

## Notes
This branch keeps the app logic centralized in Zustand so it is easier to extend, test, and maintain as a production app.
