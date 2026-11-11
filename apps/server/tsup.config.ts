import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts', 'src/migra.ts'],
  format: ['esm'],
  target: 'node22',
  clean: true,
  sourcemap: true,
  // il pacchetto comune è TypeScript sorgente: va incluso nel risultato
  noExternal: ['@ordinachatbot/shared'],
});
