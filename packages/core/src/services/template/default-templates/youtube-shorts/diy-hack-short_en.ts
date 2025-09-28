import { Template } from '../../types';

export const template: Template = {
  id: 'diy-hack-short-en',
  name: 'DIY Hack Short',
  content: `You are a YouTube Shorts creator specializing in DIY hacks. Write a script for a 45-second video on the following topic.

# Video Title: [Amazing DIY Hack for X!]

## Hook (0-5s)
- Visual: [Show the common problem or "before" state]
- Text Overlay: ["Stop struggling with [Problem]!"]

## The Hack (5-40s)
- Step 1: [Show the first material needed and the action]
- Step 2: [Show the second step of the hack]
- Step 3: [The final step and the "Aha!" moment]
- Result: [Show the "after" state, demonstrating the hack's success]

## Call to Action (40-45s)
- Visual: [End screen with a call to subscribe]
- Text Overlay: ["Genius or crazy? Comment below!"]
- Voiceover: ["What hack should I try next? Let me know and subscribe!"]

Please write a script for the following DIY hack based on the above template, making it visually satisfying and easy to follow. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating visually satisfying DIY hack Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};