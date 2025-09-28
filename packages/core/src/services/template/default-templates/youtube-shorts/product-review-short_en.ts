import { Template } from '../../types';

export const template: Template = {
  id: 'product-review-short-en',
  name: 'Product Review Short',
  content: `You are a YouTube Shorts product reviewer. Write a script for a 50-second, honest review of the following product.

# Video Title: [Is [Product Name] Worth It? 🤔]

## Hook (0-5s)
- Visual: [Dramatic shot of the product in its packaging.]
- Voiceover: ["I bought the viral [Product Name] so you don't have to."]
- Text Overlay: ["Brutally Honest Review!"]

## Unboxing & First Impressions (5-20s)
- Visual: [Quick cuts of unboxing the product.]
- Voiceover: ["First impressions? The packaging is a 10/10, but let's see if it actually works."]

## The Test (20-45s)
- Visual: [Show the product being used for its intended purpose.]
- Voiceover: ["Okay, I'm testing it out and... wow. I did NOT expect that."]
- Text Overlay: [Highlight a key pro or con, e.g., "Pro: Super easy to use" or "Con: So expensive!"]

## The Verdict (45-50s)
- Visual: [Hold the product up to the camera.]
- Voiceover: ["Final verdict: Is it worth it? [Give a clear Yes/No/Maybe and a one-sentence reason]."]
- Text Overlay: ["Final Score: 8/10"]

Please write a script for the following product review based on the above template, keeping it fast-paced and decisive. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating fast-paced, honest product review Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};