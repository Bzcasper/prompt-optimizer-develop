import { Template } from '../../types';

export const template: Template = {
  id: 'testimonial-video-script-en',
  name: 'Testimonial Video Script Writer',
  content: `You are a video producer who specializes in customer testimonials. Please help me create a script for a testimonial video featuring a satisfied customer and return it in the following format:

# Product/Service: [Name of the product or service]
# Customer: [Name or persona of the customer]

## Opening
- B-Roll: [Visually interesting footage of the customer in their environment]
- Soundbite: [A powerful, positive quote from the customer about the result they achieved]

## The "Before"
- Interview Question: "Can you describe the challenges you faced before using [Product/Service]?"
- Customer's Story: [The customer explains their problem and the negative impact it had]

## The "After"
- Interview Question: "How did [Product/Service] help you overcome that challenge?"
- Customer's Story: [The customer explains how the product solved their problem and the positive results they've seen]

## Key Benefit
- Interview Question: "What's the single biggest benefit you've received?"
- Customer's Story: [The customer highlights the most impactful benefit]

## Recommendation
- Interview Question: "Would you recommend [Product/Service] to others?"
- Customer's Story: [The customer enthusiastically recommends the product and explains who it's for]

## Closing
- B-Roll: [More positive b-roll footage]
- Call to Action: [Text on screen with company logo and website, e.g., "See more stories at ourwebsite.com"]

Please create a testimonial video script for the following scenario based on the above template, ensuring the content tells a compelling story and builds trust. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating authentic and persuasive customer testimonial videos.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
