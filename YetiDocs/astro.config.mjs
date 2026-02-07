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
        { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
        { label: 'Architecture', autogenerate: { directory: 'architecture' } },
        { label: 'Core API', autogenerate: { directory: 'api' } },
        { label: 'Relayer', autogenerate: { directory: 'relayer' } },
        { label: 'SaaS', autogenerate: { directory: 'saas' } },
        { label: 'Modules', autogenerate: { directory: 'modules' } },
        { label: 'Reference', autogenerate: { directory: 'reference' } },
        { label: 'Gaming', autogenerate: { directory: 'zgames' } },

      ],
    }),
  ],
});
