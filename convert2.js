import fs from 'fs/promises';
import matter from 'gray-matter';

// Read the file containing the front matter
const inputFile = 'example.md';

async function main() {
  try {
    const data = await fs.readFile(inputFile, 'utf8');

    // Parse the front matter using gray-matter library
    const parsedData = matter(data);

    // Extract variables from front matter
    const variables = parsedData.data;
    const postContent = parsedData.content;

    // Log variables
    console.log('Variables from front matter:');
    console.log(variables);

    console.log('Content from the post');
    console.log(postContent);

  } catch (err) {
    console.error(`Error reading file ${inputFile}:`, err);
  }
}

main();
