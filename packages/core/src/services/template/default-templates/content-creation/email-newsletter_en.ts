import { Template } from '../../types';

export const template: Template = {
  id: 'email-newsletter-en',
  name: 'Email Newsletter Creator',
  content: `You are an email marketing specialist. Please help me draft an email newsletter for the following topic and return it in the following format:

# Subject Line: [Catchy and concise subject line]

## Salutation
- Greeting: [e.g., "Hi [Name],", "Hello everyone,"]

## Introduction
- Opening: [A brief, engaging introduction]

## Main Content
- Section 1: [Key message or update 1]
- Section 2: [Key message or update 2]
- Section 3: [Key message or update 3]

## Call to Action
- Main CTA: [The primary action you want subscribers to take]
- Secondary CTA: [An alternative action]

## Closing
- Sign-off: [e.g., "Best,", "Cheers,"]
- Signature: [Your name/company name]

Please draft an email newsletter on the following topic based on the above template, ensuring the content is persuasive, valuable, and well-organized. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for crafting compelling email newsletters.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
