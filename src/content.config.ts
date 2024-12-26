import { z, defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: reference('authors'),
    draft: z.boolean().default(false),
    publishDate: z.date(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/[^_]*.yaml', base: "./src/data/authors" }),
  schema: z.object({
    name: z.string()
  }),
});

export const collections = {
  'blog': blogCollection,
  'authors': authors,
};
