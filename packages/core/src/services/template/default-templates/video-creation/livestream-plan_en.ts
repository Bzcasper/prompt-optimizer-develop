import { Template } from '../../types';

export const template: Template = {
  id: 'livestream-plan-en',
  name: 'Livestream Plan Creator',
  content: `You are a livestream producer and host. Please help me create a plan for a livestream event on the following topic and return it in the following format:

# Livestream Title: [An engaging title for the event]
# Platform(s): [e.g., YouTube Live, Twitch, Facebook Live]

## Pre-Stream Checklist
- Technical Setup: [e.g., Check camera, microphone, lighting, internet connection]
- Content Prep: [e.g., Prepare slides, talking points, guest intros]
- Promotion: [e.g., Announce stream on social media, send email reminder]

## Stream Outline (Running Order)
- (0:00) Waiting Room: [Music, countdown timer, welcome message]
- (5:00) Introduction: [Welcome viewers, introduce topic and any guests]
- (10:00) Segment 1: [First main topic or activity]
- (25:00) Community Interaction: [Q&A session, read comments, run a poll]
- (40:00) Segment 2: [Second main topic or activity]
- (55:00) Call to Action & Outro: [Promote next stream, thank viewers, sign off]

## Engagement Strategy
- Chat Moderation: [Plan for how to handle the chat]
- Interactive Elements: [Polls, Q&A, shoutouts, on-screen alerts]
- Guest Management: [If applicable, plan for bringing guests on and off screen]

## Post-Stream Actions
- Repurpose Content: [e.g., Edit highlights for social media, create a blog post from the content]
- Analyze Metrics: [Review viewership, engagement, and other key metrics]
- Follow-up: [Thank attendees, share a link to the replay]

Please create a livestream plan for the following event based on the above template, ensuring the content is well-structured for a live, interactive format. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for planning and structuring engaging livestream events.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
