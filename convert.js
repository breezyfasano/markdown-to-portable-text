// User uploads file(s) to be converted
// User Selects which Collection/Schema it will be converted to

// Parse out front matter of that file

// Finds schema variable matches and fills out fields
// Will need to always be done from a test dataset probably

// Convert content markdown to HTML

// Convert it to Portable Text

// Get the Sanity Collection and schema you want to 'Push' it to

// Do so with the Sanity API (push into dataset that can NEVER be main/production)
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import { htmlToBlocks } from '@sanity/block-tools'
import { JSDOM } from 'jsdom';
const Schema = require('@sanity/schema').default

import fs from 'fs/promises';
import matter from 'gray-matter';

// Read the file containing the front matter
// TODO: User uploads file(s) to be converted
const inputFile = 'example.md';

// User Selects which Collection/Schema it will be converted to
const defaultSchema = Schema.compile({
  name: 'myBlog',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Title',
          type: 'string',
          name: 'title'
        },
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{type: 'block'}]
        }
      ]
    }
  ]
})

// The compiled schema type for the content type that holds the block array
const blockContentType = defaultSchema.get('blogPost')
  .fields.find(field => field.name === 'body').type

async function main() {
  try {
    const data = await fs.readFile(inputFile, 'utf8');

    // Parse the front matter using gray-matter library
    const parsedData = matter(data);

    // Extract variables from front matter
    const variables = parsedData.data;
    const postContentRaw = parsedData.content;

    // 
    const postContentHTML = String(await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeFormat)
      .use(rehypeStringify)
      .process(String(postContentRaw)))

    // Convert the HTML to Portable Text


    const postContentPortableText = htmlToBlocks(postContentHTML, blockContentType, {
      parseHtml: (html) => new JSDOM(html).window.document,
    })

    // // Log variables
    // console.log('Variables from front matter:');
    // console.log(variables);

    // console.log('Content from the post');
    console.log(blockContentType);

  } catch (err) {
    console.error(`Error reading file ${inputFile}:`, err);
  }
}

main();
