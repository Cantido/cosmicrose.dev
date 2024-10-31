serve:
  npm run dev

new slug:
  cp src/content/blog/test-post.md src/content/blog/{{slug}}.md
  ${EDITOR} src/content/blog/{{slug}}.md
