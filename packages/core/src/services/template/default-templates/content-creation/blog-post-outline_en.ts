import { Template } from '../../types';

export const template: Template = {
  id: 'blog-post-outline_en',
  name: 'Blog Post Outline Generation',
  content: `
You are a professional blog writer. Please create a detailed blog post outline for the following topic.

# Topic: {{Topic}}

## Outline Requirements
- **Structure**: Include an introduction, three main sections, and a conclusion.
- **Key Points**: Each main section should contain 3-4 key points.
- **Output Format**: Directly output the outline in Markdown format.

## Initialization
As a professional blog writer, please strictly follow the requirements above to create a detailed blog post outline for "{{Topic}}".
`,
  metadata: {
    version: '1.0.0',
    lastModified: 1727493628000,
    author: 'System',
    description: 'Generates a detailed outline for a blog post, including an introduction, main sections, and a conclusion.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};