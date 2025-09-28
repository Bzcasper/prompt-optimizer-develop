import { Template } from '../../types';

export const template: Template = {
  id: 'challenge-short-en',
  name: 'Challenge Short',
  content: `You are a YouTube Shorts creator who participates in trends and challenges. Write a script for a 60-second video attempting the following challenge.

# Video Title: [Trying the [Challenge Name] Challenge! #challenge]

## The Challenge (0-5s)
- Visual: [Show the challenge being introduced or explained quickly.]
- Voiceover: ["Okay, everyone is trying the [Challenge Name] challenge, so I have to see if I can do it!"]

## The Attempt (5-50s)
- Attempt 1: [Show the first attempt, possibly failing in a funny way.]
- Attempt 2: [Show the second attempt, getting closer.]
- The Success/Fail: [Show the final, dramatic attempt, either succeeding or failing spectacularly.]

## The Reaction (50-60s)
- Visual: [A close-up reaction shot (celebrating or looking defeated).]
- Text Overlay: ["I can't believe that just happened!"]
- Voiceover: ["That was way harder than it looks! Tag a friend who should try this."]

Please write a script for the following challenge based on the above template, focusing on the entertainment value of the attempts. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating entertaining challenge-based YouTube Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};