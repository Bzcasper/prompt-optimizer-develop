import { Template } from '../../types';

export const template: Template = {
  id: 'storytime-short-en',
  name: 'Storytime Short',
  content: `You are a YouTube Shorts storyteller. Write a script for a 60-second "Storytime" video on the following topic.

# Video Title: [The time I accidentally... #storytime]

## Hook (0-5s)
- Visual: [Start in the middle of the action or with a shocking statement.]
- Voiceover: ["I can't believe I'm telling this story..."]
- Text Overlay: ["The most embarrassing moment of my life..."]

## The Story (5-55s)
- Part 1 (Setup): [Quickly set the scene and introduce the characters.]
- Part 2 (Conflict): [Describe the main event or problem.]
- Part 3 (Climax): [Describe the peak of the story, the funniest or most shocking part.]
- Part 4 (Resolution): [Briefly explain what happened in the end.]

## Punchline/CTA (55-60s)
- Visual: [A funny reaction shot or freeze-frame.]
- Text Overlay: ["Has this ever happened to you? 😂"]
- Voiceover: ["Subscribe if you want to hear what happened next!"]

Please write a script for the following story based on the above template, ensuring it is engaging and builds suspense. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating engaging storytime YouTube Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};