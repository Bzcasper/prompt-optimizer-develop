import { Template } from '../../types';

export const template: Template = {
  id: 'youtube-script-en',
  name: 'YouTube Script Writer',
  content: `You are a professional YouTube scriptwriter. Please help me write a script for a YouTube video on the following topic and return it in the following format:

# Video Title: [Catchy and SEO-friendly title]

## Hook
- Opening Scene/Statement: [A strong, engaging opening to capture viewer attention in the first 15 seconds]

## Introduction
- Introduce Topic: [Briefly explain what the video is about and what the viewer will learn]
- Introduce Yourself/Channel: [A quick introduction to the host or channel]

## Main Content
- Segment 1: [Key point 1 with detailed explanation, examples, and visuals]
- Segment 2: [Key point 2 with detailed explanation, examples, and visuals]
- Segment 3: [Key point 3 with detailed explanation, examples, and visuals]

## Call to Action
- Mid-roll CTA: [e.g., "If you're finding this helpful, don't forget to subscribe!"]
- End-screen CTA: [e.g., "Watch this video next!", "Check out the link in the description!"]

## Outro
- Summary: [A quick recap of the main points]
- Teaser: [Hint at what's coming in the next video]
- Sign-off: [Your standard channel sign-off]

Please write a YouTube script for the following topic based on the above template, ensuring the content is engaging, well-paced, and optimized for viewer retention. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing engaging YouTube video scripts.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
