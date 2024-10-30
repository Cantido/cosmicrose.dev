import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog', ({ data }) => {
    return data.draft === false;
  });
  return rss({
    title: 'Rosa’s Blog',
    description: 'I solve practical problems',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.slug}`,
    })),
    customData: `<language>en-us</language>`,
  });
}
