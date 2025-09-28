import { Template } from '../../types';

export const template: Template = {
  id: 'blog-post-workflow_en',
  name: 'Blog Post Generation Workflow',
  content: 'This is a chained template for generating a complete blog post.',
  steps: [
    {
      stepId: 'outline',
      templateId: 'blog-post-outline_en',
      inputs: {
        'Topic': '{{Topic}}'
      }
    },
    {
      stepId: 'article',
      templateId: 'blog-post_en',
      inputs: {
        'Topic': '{{Topic}}',
        'Outline': '{{outline}}'
      }
    }
  ],
  metadata: {
    version: '1.0.0',
    lastModified: 1727493628000,
    author: 'System',
    description: 'A two-step workflow that first generates a blog outline, then writes the full article based on the outline.',
    templateType: 'chained',
    language: 'en'
  },
  isBuiltin: true
};