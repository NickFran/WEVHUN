import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Must import from @tailwindcss/vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
})