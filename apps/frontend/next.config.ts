import type { NextConfig } from 'next';

// Configure Next.js to use the new Turbopack config key instead of deprecated experimental.turbo
// Also explicitly disable the React Compiler to avoid requiring the Babel plugin in dev.
const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  // Using Turbopack in dev via `next dev --turbopack`
  // If you need to customize Turbopack, do it under this key.
  turbopack: {},
};

export default nextConfig;
