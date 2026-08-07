import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = '/games-hub-with-navigation-NateOtten07/'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? repoBase : '/'
}))
