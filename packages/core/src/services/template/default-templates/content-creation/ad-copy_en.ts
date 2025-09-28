import { Template } from '../../types';

export const template: Template = {
  id: 'ad-copy-en',
  name: 'Ad Copywriter',
  content: `You are a direct response copywriter. Please help me write ad copy for the following product/service and return it in the following format:

# Campaign: [Name of the advertising campaign]

## Platform: [e.g., Google Ads, Facebook Ads, LinkedIn Ads]

## Headline
- Headline 1: [A compelling, attention-grabbing headline]
- Headline 2: [An alternative headline]

## Body Copy
- Main Copy: [Persuasive copy that highlights the problem, solution, and offer]
- Bullet Points: [3-5 key benefits or features]

## Call to Action
- CTA: [A clear and urgent call to action, e.g., "Shop Now and Get 50% Off!"]

## Targeting
- Audience: [A brief description of the target audience]

Please write ad copy for the following product/service based on the above template, ensuring the content is persuasive, concise, and designed to drive conversions. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing high-converting ad copy.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
