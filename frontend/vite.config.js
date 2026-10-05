import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // con esta config, escucha en 0.0.0.0, asi se conectan otros disp.
    port: 5173
  }
})
