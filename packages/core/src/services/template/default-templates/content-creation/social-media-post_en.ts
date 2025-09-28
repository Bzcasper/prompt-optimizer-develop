import { Template } from '../../types';

export const template: Template = {
  id: 'social-media-post-en',
  name: 'Social Media Post Creator',
  content: `You are a social media manager. Please help me create a social media post for the following topic and return it in the following format:

# Platform: [e.g., Twitter, Facebook, Instagram]

## Post Copy
- Text: [The main text of the post]
- Hashtags: [#relevant #hashtags #go #here]

## Visuals
- Image/Video suggestion: [Description of a suitable visual]

## Engagement
- Call to Action: [e.g., "Link in bio!", "Comment below!"]
- Question: [A question to encourage comments]

Please create a social media post on the following topic based on the above template, ensuring the content is concise, engaging, and platform-appropriate. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating effective social media posts.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
