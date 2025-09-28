import { Template } from '../../types';

export const template: Template = {
  id: 'webinar-script-en',
  name: 'Webinar Script Writer',
  content: `You are a webinar host and content strategist. Please help me create a script for a webinar on the following topic and return it in the following format:

# Webinar Title: [An engaging and benefit-focused title]
# Host(s): [Name(s) of the webinar host(s)]

## Pre-Webinar (Waiting Room)
- Welcome Slide: [Title, host names, and a countdown timer]
- Engagement Question: [A poll or chat question to engage early attendees]

## Introduction (0-5 mins)
- Welcome & Housekeeping: [Welcome attendees, explain how to use the Q&A, etc.]
- Hook: [A compelling story, statistic, or question to grab attention]
- Agenda & Promise: [Outline what will be covered and what attendees will learn]

## Main Content (5-40 mins)
- Section 1: [First major topic with key talking points, slides, and examples]
- Section 2: [Second major topic with key talking points, slides, and examples]
- Section 3: [Third major topic with key talking points, slides, and examples]

## Transition to Pitch (40-45 mins)
- Summary of Value: [Recap the key learnings and value provided so far]
- The "Next Step": [Introduce the product/service as the logical next step to implement what they've learned]

## The Pitch (45-55 mins)
- The Offer: [Clearly explain the product/service, what's included, and the price]
- Scarcity/Urgency: [e.g., "Limited-time bonus," "Only 10 spots available"]
- Testimonials/Social Proof: [Share success stories from other customers]
- Call to Action: [A clear, direct instruction to purchase or sign up, with URL]

## Q&A and Closing (55-60 mins)
- Live Q&A: [Answer questions from the audience]
- Final CTA: [Repeat the call to action]
- Thank You & Sign-off: [Thank attendees for their time]

Please create a webinar script for the following topic based on the above template, ensuring the content is structured to deliver value and drive conversions. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for structuring and scripting effective webinars.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
