import esbuild from 'esbuild'
import { cp } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const prod = process.argv.includes('--production')

// JS bundle (also picks up CSS imports via esbuild's loader)
await esbuild.build({
  entryPoints: [path.join(__dirname, 'index.js')],
  bundle: true,
  outdir: path.join(PROJECT_ROOT, 'dist'),
  entryNames: 'app',
  format: 'esm',
  target: 'es2022',
  minify: prod,
  sourcemap: true,
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  loader: { '.css': 'css' },
  define: {
    'process.env.NODE_ENV': prod ? '"production"' : '"development"',
  },
})

// Copy static assets to dist/
await cp(path.join(__dirname, 'index.html'), path.join(PROJECT_ROOT, 'dist', 'index.html'))
await cp(path.join(PROJECT_ROOT, '.meta', 'logos', 'e-favicon-32.svg'), path.join(PROJECT_ROOT, 'dist', 'favicon.svg'))

console.log('Build complete.')
