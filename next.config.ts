import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fix workspace root inference when multiple lockfiles exist (e.g., parent folder)
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig
