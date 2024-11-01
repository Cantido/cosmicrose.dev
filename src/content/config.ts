import { z, defineCollection, reference } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
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
  type: 'data',
  schema: z.object({
    name: z.string()
  }),
});

export const collections = {
  'blog': blogCollection,
  'authors': authors,
};
