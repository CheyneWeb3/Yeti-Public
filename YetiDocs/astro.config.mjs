// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'YetiCashier Docs',
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        { label: 'Overview', autogenerate: { directory: 'overview' } },
        { label: 'Gaming', autogenerate: { directory: 'zgames' } },
        { label: 'Modules & SDK', autogenerate: { directory: 'modules' } },
        { label: 'Reference', autogenerate: { directory: 'reference' } },

      ],
    }),
  ],
});
