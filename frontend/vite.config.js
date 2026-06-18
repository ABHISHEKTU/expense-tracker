import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/expenses': 'http://localhost:8000',
      '/summary': 'http://localhost:8000',
      '/categories': 'http://localhost:8000',
    }
  }
})
