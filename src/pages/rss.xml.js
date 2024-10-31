import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog', ({ data }) => {
    return data.draft === false;
  });


  let items = [];


  for (let i = 0; i < blog.length; i++) {
    const post = blog[i];
    const author = await getEntry(post.data.author);
    const item = {
      title: post.data.title,
      author: author.data.name,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.slug}`,
    }

    items.push(item);
  }

  return rss({
    title: 'Rosa Richter',
    description: 'I solve practical problems',
    site: context.site,
    items: items,
    customData: `<language>en-us</language>`,
  });
}
