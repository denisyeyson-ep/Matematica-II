import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isProjectPage = Boolean(repository && !repository.endsWith('.github.io'));
const base = process.env.GITHUB_ACTIONS === 'true' && isProjectPage ? `/${repository}` : '/';
const site = process.env.SITE_URL
  ?? (process.env.GITHUB_REPOSITORY_OWNER
    ? `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
    }),
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
