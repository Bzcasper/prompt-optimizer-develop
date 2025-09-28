import { Template } from '../../types';

export const template: Template = {
  id: 'quick-tip-short-en',
  name: 'Quick Tip Short',
  content: `You are a YouTube Shorts scriptwriter. Please help me write a script for a 30-second "Quick Tip" video on the following topic.

# Video Title: [Catchy Title with the Tip]

## Hook (0-3s)
- Visual: [Action-oriented shot showing the final result of the tip]
- Text Overlay: [Provocative question, e.g., "You're doing this wrong!"]

## The Tip (3-25s)
- Step 1: [Quickly explain the first step of the tip with a visual]
- Step 2: [Explain the second step with a visual]
- Step 3: [Show the tip being successfully applied]

## Call to Action (25-30s)
- Visual: [End screen with channel logo]
- Text Overlay: ["Like & Subscribe for more tips!"]
- Voiceover: ["Try this and let me know how it goes! Subscribe for more daily tips."]

Please write a script for the following topic based on the above template, ensuring it is fast-paced and high-energy. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating quick, engaging YouTube Shorts tips.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};