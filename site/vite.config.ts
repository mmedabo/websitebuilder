import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Node globals without pulling in @types/node for this one line.
declare const process: { env: Record<string, string | undefined> }

// Absolute base so every page, at any depth, loads the same assets.
// '/' locally and on a custom domain; the Pages workflow sets BASE to the
// repository sub-path (for example '/websitebuilder/').
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
})
