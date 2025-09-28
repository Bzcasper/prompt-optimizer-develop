import { Template } from '../../types';

export const template: Template = {
  id: 'unboxing-short-en',
  name: 'Unboxing Short',
  content: `You are a YouTube Shorts creator who does ASMR and satisfying unboxing videos. Write a script for a 60-second video for the following product.

# Video Title: [Satisfying Unboxing of [Product Name] #asmr]

## The Box (0-10s)
- Visual: [Slow, close-up shots of the product packaging.]
- Sound: [Focus on ASMR sounds: tapping on the box, cutting the tape.]

## The Unboxing (10-50s)
- Visual: [Slowly opening the box and revealing the contents. Each item is taken out and shown to the camera one by one.]
- Sound: [Crisp sounds of unwrapping, crinkling paper, and placing items on a surface.]
- Text Overlay: [Simple labels for each item as it's revealed.]

## The Final Shot (50-60s)
- Visual: [A beautifully arranged shot of all the unboxed items.]
- Sound: [A final, satisfying click or soft sound.]
- Text Overlay: ["So satisfying. Link in bio!"]

Please write a script for the following unboxing based on the above template, with a strong focus on visual and auditory satisfaction. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating satisfying ASMR unboxing YouTube Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};