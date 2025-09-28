import { Template } from '../../types';

export const template: Template = {
  id: 'press-release-en',
  name: 'Press Release Writer',
  content: `You are a public relations professional. Please help me write a press release for the following announcement and return it in the following format:

# FOR IMMEDIATE RELEASE

## Headline
- Main Headline: [A compelling headline that summarizes the news]

## Dateline
- CITY, State – [Date] –

## Introduction
- Summary: [A concise summary of the announcement (who, what, when, where, why)]

## Body
- Paragraph 1: [Elaborate on the key details of the news]
- Paragraph 2: [Provide supporting information and context]
- Quote: [A quote from a key person involved]

## Boilerplate
- About [Company/Organization]: [A brief, standard description of the company]

## Media Contact
- Name: [Contact Person's Name]
- Title: [Title]
- Email: [Email Address]
- Phone: [Phone Number]

### ###

Please write a press release for the following announcement based on the above template, ensuring the content is newsworthy, factual, and follows standard press release format. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for writing professional press releases.',
    templateType: 'content-creation',
    language: 'en'
  },
  isBuiltin: true
};
