import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Basic Vite config with the official React plugin.
export default defineConfig({
  plugins: [react()],
})
