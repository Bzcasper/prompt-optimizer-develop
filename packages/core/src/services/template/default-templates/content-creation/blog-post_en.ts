import { Template } from '../../types';

export const template: Template = {
  id: 'blog-post_en',
  name: 'Blog Post Generation',
  content: `
You are a professional blog writer. Please create a high-quality blog post on the following topic.

# Topic: {{Topic}}

## Article Structure

### 1. Title
- Requirement: Catchy, concise, and accurately reflects the content of the article.

### 2. Introduction
- Goal: Spark the reader's interest and introduce the core idea of the article.
- Content:
  - Start with an engaging question or a surprising fact.
  - Briefly introduce what the article will cover.
  - Clearly state the article's main argument or purpose.

### 3. Body
- Requirement: Logically clear, informative, and well-paragraphed.
- Structure:
  - **Paragraph 1: [Supporting Point 1]**
    - Elaborate on the first key point.
    - Provide data, examples, or quotes to support the argument.
    - Ensure a smooth transition to the next paragraph.
  - **Paragraph 2: [Supporting Point 2]**
    - Elaborate on the second key point.
    - Provide data, examples, or quotes to support the argument.
    - Ensure a smooth transition to the next paragraph.
  - **Paragraph 3: [Supporting Point 3]**
    - Elaborate on the third key point.
    - Provide data, examples, or quotes to support the argument.
    - Ensure a smooth transition to the next paragraph.

### 4. Conclusion
- Goal: Summarize the article, reinforce the key message, and guide the reader toward further thought or action.
- Content:
  - Summarize the main points of the article.
  - Reiterate the value of the core message.
  - Pose an open-ended question or provide a clear Call to Action (CTA).

### 5. SEO Optimization
- **Keywords**: [Primary Keyword 1], [Primary Keyword 2], [Related Keyword 1]
- **Meta Description**: [A concise 1-2 sentence summary containing the main keywords]

## Writing Requirements
- **Tone of Voice**: [e.g., Professional, Humorous, Accessible]
- **Target Audience**: [e.g., Beginners, Tech Experts, Marketers]
- **Article Length**: [e.g., 800-1200 words]

## Initialization
As a professional blog writer, please strictly follow the structure and requirements above to create a high-quality blog post on "{{Topic}}". Please output the article content directly.
`,
  metadata: {
    version: '1.0.0',
    lastModified: 1727493628000,
    author: 'System',
    description: 'Generates a well-structured, high-quality blog post, including title, intro, body, and conclusion.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};