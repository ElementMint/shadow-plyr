import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve'; 

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ShadowPlyr',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(), 
    typescript({ tsconfig: './tsconfig.json' }),
    terser(),
  ],
};