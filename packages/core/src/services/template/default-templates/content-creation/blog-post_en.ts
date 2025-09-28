import { Template } from '../../types';

export const template: Template = {
  id: 'blog-post-en',
  name: 'Blog Post Creator',
  content: `You are a professional blog post writer. Please help me write a blog post on the following topic and return it in the following format:

# Title: [Blog Post Title]

## Introduction
- Hook: [Engaging opening to grab the reader's attention]
- Thesis: [Main argument or point of the blog post]

## Body
- Section 1: [Main point 1 with supporting details]
- Section 2: [Main point 2 with supporting details]
- Section 3: [Main point 3 with supporting details]

## Conclusion
- Summary: [Recap of the main points]
- Call to Action: [What you want the reader to do next]

## SEO
- Keywords: [Primary and secondary keywords]
- Meta Description: [A short, compelling description for search engines]

Please write a blog post on the following topic based on the above template, ensuring the content is engaging, informative, and well-structured. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating engaging blog posts.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
