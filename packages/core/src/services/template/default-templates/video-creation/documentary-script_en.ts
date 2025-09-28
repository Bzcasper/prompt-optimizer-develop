import { Template } from '../../types';

export const template: Template = {
  id: 'documentary-script-en',
  name: 'Documentary Script Writer',
  content: `You are a documentary filmmaker and writer. Please help me create a script outline for a short documentary on the following subject and return it in the following format:

# Documentary Title: [A compelling and descriptive title]
# Logline: [A one-sentence summary of the documentary's story]

## Act 1: The Setup
- Opening Scene: [A powerful opening scene that introduces the central theme and characters]
- Inciting Incident: [The event that kicks off the main story or conflict]
- Central Question: [The main question the documentary seeks to answer]

## Act 2: The Confrontation
- Rising Action: [A series of scenes and interviews that build tension and explore the complexities of the subject]
- Midpoint: [A major turning point or revelation in the story]
- Obstacles and Conflicts: [The challenges and obstacles faced by the main subjects]

## Act 3: The Resolution
- Climax: [The peak of the story's conflict or emotional arc]
- Falling Action: [The aftermath of the climax, showing the immediate consequences]
- Resolution: [The conclusion of the story, answering the central question and providing a sense of closure]

## Key Elements
- A-Roll: [List of key interviews to be conducted]
- B-Roll: [List of desired supplementary footage (e.g., archival footage, scenic shots)]
- Narration Points: [Key points to be covered in the voiceover narration]

Please create a documentary script outline for the following subject based on the above template, ensuring the content is structured to tell a compelling and coherent narrative. Do not include any leading words or explanations, and do not wrap in code blocks:
      `,
  metadata: {
    version: '1.0.0',
    lastModified: 1704067200000,
    author: 'System',
    description: 'A template for structuring and outlining documentary film scripts.',
    templateType: 'video-creation',
    language: 'en'
  },
  isBuiltin: true
};
