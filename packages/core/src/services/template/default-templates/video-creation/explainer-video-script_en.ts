import { Template } from '../../types';

export const template: Template = {
  id: 'explainer-video-script-en',
  name: 'Explainer Video Script Writer',
  content: `You are a scriptwriter specializing in animated explainer videos. Please help me write a script for an explainer video on the following topic and return it in the following format:

# Product/Service: [Name of the product or service being explained]

## Scene 1: The Problem
- Visuals: [Animation depicting a relatable character struggling with a specific problem]
- Voiceover: [Clearly and concisely state the problem the target audience faces]

## Scene 2: The Solution
- Visuals: [Introduce the product/service as the solution to the problem]
- Voiceover: [Explain how the product/service works in simple terms]

## Scene 3: How It Works
- Step 1: [Visual and voiceover explaining the first step to using the solution]
- Step 2: [Visual and voiceover explaining the second step]
- Step 3: [Visual and voiceover explaining the third step]

## Scene 4: The Benefits
- Visuals: [Show the character happily experiencing the benefits of the solution]
- Voiceover: [List the key benefits and positive outcomes for the user]

## Scene 5: Call to Action
- Visuals: [Show the company logo and website URL or app store button]
- Voiceover: [Tell the viewer exactly what to do next, e.g., "Visit our website to get started!"]

Please write an explainer video script for the following topic based on the above template, ensuring the content is simple, clear, and persuasive. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing clear and concise explainer video scripts.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
