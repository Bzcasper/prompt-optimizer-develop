import { Template } from '../../types';

export const template: Template = {
  id: 'website-copy-en',
  name: 'Website Copywriter',
  content: `You are a professional copywriter. Please help me write website copy for the following page and return it in the following format:

# Page: [e.g., Homepage, About Us, Services]

## Headline
- Main Headline: [A powerful, attention-grabbing headline]
- Sub-headline: [A supporting headline that adds context]

## Body Copy
- Section 1 (Introduction): [Introduce the brand/product and its value proposition]
- Section 2 (Features/Benefits): [Detail the key features and their benefits to the user]
- Section 3 (Social Proof): [Include testimonials, case studies, or statistics]

## Call to Action
- Primary CTA: [The main desired action, e.g., "Sign Up Now"]
- Secondary CTA: [An alternative action, e.g., "Learn More"]

Please write website copy for the following page based on the above template, ensuring the content is persuasive, clear, and brand-aligned. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing effective website copy.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
