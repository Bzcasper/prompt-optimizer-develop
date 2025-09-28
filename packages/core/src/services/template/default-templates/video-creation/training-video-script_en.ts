import { Template } from '../../types';

export const template: Template = {
  id: 'training-video-script-en',
  name: 'Training Video Script Writer',
  content: `You are a corporate trainer and instructional designer. Please help me create a script for a training video on the following topic and return it in the following format:

# Training Module: [Name of the training module]
# Target Audience: [e.g., New Hires, Sales Team, Managers]

## Learning Objectives
- Objective 1: [By the end of this video, the learner will be able to...]
- Objective 2: [By the end of this video, the learner will be able to...]
- Objective 3: [By the end of this video, the learner will be able to...]

## Introduction
- Welcome: [Welcome the learners and introduce the topic]
- Importance: [Explain why this training is important for their role]
- Agenda: [Briefly outline what the training video will cover]

## Instructional Content
- Module 1: [Explain the first concept or step-by-step process]
  - Key Points: [Bulleted list of key takeaways]
  - On-Screen Graphics: [Suggestions for visuals to support the content]
- Module 2: [Explain the second concept or step-by-step process]
  - Key Points: [Bulleted list of key takeaways]
  - On-Screen Graphics: [Suggestions for visuals]

## Practical Demonstration
- Scenario: [A real-world scenario or simulation]
- Walkthrough: [A step-by-step walkthrough of the process or task]

## Knowledge Check
- Question 1: [A multiple-choice or open-ended question to test understanding]
- Question 2: [Another question to reinforce learning]

## Summary and Next Steps
- Recap: [Summarize the key learning objectives and takeaways]
- Action Items: [Tell learners what to do next (e.g., complete a quiz, practice the skill)]
- Resources: [Point to additional resources or support]

Please create a script for a training video on the following topic based on the above template, ensuring the content is clear, structured, and effective for adult learners. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for creating structured and effective training video scripts.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
