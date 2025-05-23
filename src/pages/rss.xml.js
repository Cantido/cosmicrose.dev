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
      author: "cosmic.lady.rosa@gmail.com",
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.id}`,
    }

    items.push(item);
  }

  return rss({
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    title: 'Rosa Richter',
    description: 'Blog posts from Rosa Richter',
    site: context.site,
    items: items,
    customData:
      `<language>en-us</language>` +
      `<atom:link href="https://cosmicrose.dev/rss.xml" rel="self" type="application/rss+xml" />` +
    `<managingEditor>cosmic.lady.rosa@gmail.com (Rosa Richter)</managingEditor>` +
    `<webMaster>cosmic.lady.rosa@gmail.com (Rosa Richter)</webMaster>`,
  });
}
