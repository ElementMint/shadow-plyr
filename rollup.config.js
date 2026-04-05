import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';

// hls.js is a peer dependency — consumers provide it via npm install or CDN.
// The player dynamically imports it only when an .m3u8 source is detected, and
// gracefully falls back to window.Hls for UMD/CDN usage.
const EXTERNALS = ['hls.js'];

export default [
  // ESM build (supports code splitting for dynamic import)
  {
    input: 'src/index.ts',
    external: EXTERNALS,
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      entryFileNames: 'index.js',
      chunkFileNames: 'chunks/[name]-[hash].js',
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },

  // UMD build (single file, no code splitting)
  // hls.js is expected on window.Hls when loaded via <script> tag from CDN.
  {
    input: 'src/index.ts',
    external: EXTERNALS,
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ShadowPlyr',
      sourcemap: true,
      inlineDynamicImports: true,
      globals: { 'hls.js': 'Hls' },
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
];