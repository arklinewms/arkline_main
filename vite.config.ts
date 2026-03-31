import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "10f4-2a02-2455-91f7-da00-b027-1ad0-36ef-6c39.ngrok-free.app"
    ]
  }
})