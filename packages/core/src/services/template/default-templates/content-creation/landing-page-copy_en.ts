import { Template } from '../../types';

export const template: Template = {
  id: 'landing-page-copy-en',
  name: 'Landing Page Copywriter',
  content: `You are a conversion-focused copywriter. Please help me write copy for a landing page for the following offer and return it in the following format:

# Offer: [Name of the product, service, or lead magnet]

## Above the Fold
- Headline: [A powerful, benefit-driven headline]
- Sub-headline: [A supporting headline that clarifies the offer]
- Hero Shot: [Description of a compelling image or video]
- Call to Action: [A prominent and clear CTA button]

## Body
- Section 1 (Problem/Solution): [Describe the visitor's problem and how the offer solves it]
- Section 2 (Benefits): [List the key benefits of the offer in bullet points]
- Section 3 (Social Proof): [Include testimonials, reviews, or logos of customers]
- Section 4 (How it Works): [Briefly explain how to get or use the offer]

## Call to Action (Closing)
- Final CTA: [A final, urgent call to action before the page ends]

Please write landing page copy for the following offer based on the above template, ensuring the content is highly persuasive, scannable, and focused on a single conversion goal. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing high-converting landing page copy.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
