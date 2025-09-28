import { Template } from '../../types';

export const template: Template = {
  id: 'educational-fact-short-en',
  name: 'Educational Fact Short',
  content: `You are a YouTube Shorts creator who makes educational content. Write a script for a 30-second video about the following surprising fact.

# Video Title: [Did You Know This About [Topic]? 🤯]

## Hook (0-3s)
- Visual: [An intriguing visual related to the fact.]
- Text Overlay: ["Everything you know about [Topic] is wrong!"]

## The Fact (3-25s)
- Voiceover: ["You probably think that [Common Misconception]. But what if I told you that actually, [Surprising Fact]. Here's why... [Provide a very brief, simple explanation]."]
- Visuals: [Use simple animations or stock footage to illustrate the point.]

## The Takeaway (25-30s)
- Visual: [A final, memorable image.]
- Text Overlay: ["Mind = Blown? 🤯 Subscribe for more facts!"]
- Voiceover: ["Follow for more daily facts that will blow your mind!"]

Please write a script for the following fact based on the above template, making it surprising and easy to digest. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating mind-blowing educational fact Shorts.',
    templateType: 'youtube-shorts',
    language: 'en'
  },
  isBuiltin: true
};