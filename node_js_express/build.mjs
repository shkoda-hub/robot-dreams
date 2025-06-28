import { build } from 'esbuild';

await build({
  entryPoints : ['src/server.ts'],
  external    : ['swagger-ui-express', 'swagger-ui-dist'],
  bundle      : true,
  format      : 'esm',
  platform    : 'node',
  target      : 'node20',
  outfile     : 'dist/server.mjs',
  minifySyntax: true,
  minifyWhitespace: true,
  minifyIdentifiers: false,
  treeShaking : true,
  legalComments: 'none',

  banner: {
    js: `
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
`
  }
})
