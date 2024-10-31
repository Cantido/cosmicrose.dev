import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'rose-pine',
    },
  },
  site: 'https://cosmicrose.dev',
});