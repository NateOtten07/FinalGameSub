import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = 'https://nateotten07.github.io/FinalGameSub'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? repoBase : '/'
}))
