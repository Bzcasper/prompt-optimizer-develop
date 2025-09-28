import { Template } from '../../types';

export const template: Template = {
  id: 'blog-post-workflow',
  name: '博客文章生成工作流',
  content: '这是一个链式模板，用于生成完整的博客文章。',
  steps: [
    {
      stepId: 'outline',
      templateId: 'blog-post-outline',
      inputs: {
        '主题': '{{主题}}'
      }
    },
    {
      stepId: 'article',
      templateId: 'blog-post',
      inputs: {
        '主题': '{{主题}}',
        '大纲': '{{outline}}'
      }
    }
  ],
  metadata: {
    version: '1.0.0',
    lastModified: 1727493628000,
    author: 'System',
    description: '一个两步工作流，首先生成博客大纲，然后根据大纲撰写完整的文章。',
    templateType: 'chained',
    language: 'zh'
  },
  isBuiltin: true
};