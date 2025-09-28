import { Template } from '../../types';

export const template: Template = {
  id: 'comedy-sketch-short-en',
  name: 'Comedy Sketch Short',
  content: `You are a YouTube Shorts scriptwriter specializing in short comedy sketches. Write a script for a 30-second video based on the following comedic premise.

# Video Title: [Hilarious Sketch Title #comedy]

## Setup (0-10s)
- Character A: [Introduces a normal situation or asks a simple question.]
- Character B: [Gives a strange or unexpected response, setting up the joke.]

## The Escalation (10-25s)
- Character A: [Reacts with confusion or tries to clarify.]
- Character B: [Doubles down on their absurd logic with a completely serious face.]

## The Punchline (25-30s)
- Visual: [A zoom-in on Character A's bewildered face, or Character B doing a final, ridiculous action.]
- Text Overlay: ["We've all been there... right?"]

Please write a script for the following comedy premise based on the above template, focusing on timing and a strong punchline. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating short, punchy comedy sketches for YouTube Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};