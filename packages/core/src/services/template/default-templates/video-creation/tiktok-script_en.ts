import { Template } from '../../types';

export const template: Template = {
  id: 'tiktok-script-en',
  name: 'TikTok Script Writer',
  content: `You are a viral video scriptwriter. Please help me write a script for a TikTok video on the following topic and return it in the following format:

# Video Concept: [A short, catchy concept for the video]

## Hook (First 3 Seconds)
- Visual: [A visually arresting opening shot]
- Audio/Text: [A provocative question or statement]

## Middle (Build-up)
- Scene 1: [Quick shot or action that builds on the hook]
- Scene 2: [Quick shot or action that adds to the story or information]
- Scene 3: [Quick shot or action leading to the payoff]

## Payoff (Climax)
- The Reveal/Punchline: [The most satisfying or surprising moment of the video]

## Call to Action
- CTA: [e.g., "Follow for more!", "Comment your thoughts!", "Try this trend!"]
- Trending Hashtags: [#fyp #viral #[relevant_trend]]

Please write a TikTok script for the following topic based on the above template, ensuring the content is fast-paced, visually driven, and designed for a short attention span. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating short, viral video scripts for TikTok.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
