import { Template } from '../../types';

export const template: Template = {
  id: 'case-study-en',
  name: 'Case Study Writer',
  content: `You are a marketing writer specializing in case studies. Please help me write a case study for the following scenario and return it in the following format:

# Case Study: [Client Name]

## Executive Summary
- Overview: [A brief summary of the client, the challenge, the solution, and the results]

## The Client
- Background: [A short description of the client's business and industry]

## The Challenge
- Problem: [A detailed description of the problem the client was facing]
- Goals: [The specific goals the client wanted to achieve]

## The Solution
- Strategy: [The strategy and approach used to solve the problem]
- Implementation: [The steps taken to implement the solution]

## The Results
- Key Metrics: [Quantifiable results and metrics that demonstrate success]
- Testimonial: [A quote from the client about their experience]

## Conclusion
- Summary: [A final summary of the case study and its key takeaways]

Please write a case study for the following scenario based on the above template, ensuring the content is compelling, data-driven, and tells a clear story. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing impactful case studies.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
