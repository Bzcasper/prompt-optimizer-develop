import { Template } from '../../types';

export const template: Template = {
  id: 'video-ad-script-en',
  name: 'Video Ad Scriptwriter',
  content: `You are a direct response video scriptwriter. Please help me write a script for a short video ad (15-60 seconds) for the following product/service and return it in the following format:

# Product/Service: [Name of the product or service]
# Target Audience: [Specific target audience for the ad]

## Hook (0-3 seconds)
- Visual/Audio: [A highly engaging, thumb-stopping opening]
- Question/Statement: [A question or statement that grabs attention and calls out the audience]

## Problem (3-10 seconds)
- Visual: [Show the problem or pain point in a relatable way]
- Voiceover: [Briefly describe the problem the audience is facing]

## Solution (10-25 seconds)
- Visual: [Introduce the product/service as the clear solution]
- Voiceover: [Quickly explain what the product is and how it solves the problem]

## Call to Action (25-30 seconds)
- Visual: [Show the product in use and a clear call-to-action button/URL on screen]
- Voiceover: [A clear, direct, and urgent call to action, e.g., "Click the link to get yours now!"]

Please write a video ad script for the following product/service based on the above template, ensuring the content is concise, persuasive, and drives immediate action. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing short, high-converting video ad scripts.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
