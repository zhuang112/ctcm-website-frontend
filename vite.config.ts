import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ctcm-website-frontend/', // 👈 填「你的 repo 名稱」，前後都要有斜線
})
