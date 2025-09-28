import { Template } from '../../types';

export const template: Template = {
  id: 'motivational-short-en',
  name: 'Motivational Short',
  content: `You are a motivational speaker who creates YouTube Shorts. Write a script for a 45-second motivational video on the following topic.

# Video Title: [A Powerful Reminder for You Today]

## Hook (0-5s)
- Visual: [An inspiring, cinematic shot (e.g., a sunrise, a mountain peak).]
- Text Overlay: ["If you're seeing this, it's for you."]

## The Message (5-40s)
- Voiceover: ["Stop waiting for the perfect moment. The perfect moment is now. Every second you spend waiting is a second you could be spending doing. Remember, the only thing standing between you and your goal is the story you keep telling yourself that you can't achieve it. Change the story."]
- Visuals: [A montage of inspiring clips of people working hard, achieving goals, and looking determined.]

## The Call to Action (40-45s)
- Visual: [A final, powerful shot with text on screen.]
- Text Overlay: ["You've got this. Share this with someone who needs it."]

Please write a script for the following motivational topic based on the above template, using powerful and inspiring language. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating powerful and inspiring motivational Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};