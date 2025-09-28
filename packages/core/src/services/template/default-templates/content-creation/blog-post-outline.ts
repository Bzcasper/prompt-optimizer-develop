import { Template } from '../../types';

export const template: Template = {
  id: 'blog-post-outline',
  name: '博客文章大纲生成',
  content: `
你是一位专业的博客作家。请为以下主题，创建一个详细的博客文章大纲。

# 主题: {{主题}}

## 大纲要求
- **结构**: 包含引言、三个主要部分和结论。
- **要点**: 每个主要部分应包含3-4个关键要点。
- **输出格式**: 直接输出Markdown格式的大纲。

## 初始化
作为一名专业的博客作家，请严格按照以上要求，为“{{主题}}”创作一篇详细的博客文章大纲。
`,
  metadata: {
    version: '1.0.0',
    lastModified: 1727493628000,
    author: 'System',
    description: '生成博客文章的详细大纲，包括引言、主要部分和结论。',
    templateType: 'content-creation',
    language: 'zh'
  },
  isBuiltin: true
};