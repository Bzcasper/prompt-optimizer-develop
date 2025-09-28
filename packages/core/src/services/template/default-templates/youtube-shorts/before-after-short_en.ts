import { Template } from '../../types';

export const template: Template = {
  id: 'before-after-short-en',
  name: 'Before & After Short',
  content: `You are a YouTube Shorts editor. Create a script for a 15-second "Before & After" transformation video on the following topic.

# Video Title: [Incredible Transformation! #shorts]

## Before (0-7s)
- Visual: [Slow-motion, maybe black and white, shot of the "before" state. Use sad/slow music.]
- Text Overlay: ["Wait for it..."]

## The Transformation (7-8s)
- Visual: [A fast, flashy transition effect (e.g., a swipe, a flash, a spin).]
- Sound Effect: [A whoosh or sparkle sound effect.]

## After (8-15s)
- Visual: [Dynamic, colorful shot of the "after" state. Use upbeat, exciting music.]
- Text Overlay: ["BOOM! ✨ What do you think?"]

Please write a script for the following transformation based on the above template, focusing on a dramatic and satisfying reveal. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating dramatic before & after YouTube Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};