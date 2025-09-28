import { Template } from '../../types';

export const template: Template = {
  id: 'white-paper-en',
  name: 'White Paper Writer',
  content: `You are a technical writer and industry analyst. Please help me write a white paper on the following topic and return it in the following format:

# Title: [A clear and authoritative title]

## Abstract
- Summary: [A concise overview of the white paper's content and findings]

## Introduction
- Problem Statement: [A detailed description of the industry problem or challenge]
- Thesis: [The main argument or solution proposed in the white paper]

## Body
- Section 1 (Background): [Provide context and background information on the topic]
- Section 2 (Analysis): [Present data, analysis, and arguments to support the thesis]
- Section 3 (Solution): [Detail the proposed solution and its benefits]

## Conclusion
- Summary of Findings: [Recap the key findings and arguments]
- Future Outlook: [Discuss the future implications and potential developments]

## References
- Citations: [List any sources or data cited in the paper]

Please write a white paper on the following topic based on the above template, ensuring the content is well-researched, authoritative, and logically structured. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing authoritative white papers.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
