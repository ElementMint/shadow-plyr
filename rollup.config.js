import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';

export default [
  // ✅ ESM build (supports code splitting for dynamic import)
  {
    input: 'src/index.ts',
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

  // ✅ UMD build (single file, no code splitting)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ShadowPlyr',
      sourcemap: true,
      inlineDynamicImports: true, // 👈 IMPORTANT
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
];