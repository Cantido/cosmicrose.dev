import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    draft: z.boolean().default(false),
    publishDate: z.date(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
