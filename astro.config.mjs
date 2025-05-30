import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'vitesse-black',
    },
  },
  site: 'https://cosmicrose.dev',
});
