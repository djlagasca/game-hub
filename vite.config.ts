import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const normalizeBase = (base: string) => {
  if (!base || base === "/") return "/"
  const trimmed = base.replace(/^\/|\/$/g, "")
  return `/${trimmed}/`
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  const repoBase = process.env.GITHUB_PAGES_BASE ?? "game-hub"

  return {
    base: normalizeBase(repoBase),
    plugins: [react(), tsconfigPaths()],
  }
})