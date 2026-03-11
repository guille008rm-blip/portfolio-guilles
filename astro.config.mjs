// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://guillermolopez.dev',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
