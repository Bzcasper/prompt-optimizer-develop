import { describe, it, expect, vi } from 'vitest';
import { ChainedTemplateRunner } from '../../../src/services/template/runner';
import { PromptService } from '../../../src/services/prompt';
import { TemplateManager } from '../../../src/services/template/manager';
import { Template } from '../../../src/services/template/types';

describe('ChainedTemplateRunner', () => {
  const mockPromptService = {
    testPrompt: vi.fn(),
  } as unknown as PromptService;

  const mockTemplateManager = {
    getTemplate: vi.fn(),
  } as unknown as TemplateManager;

  it('should run a chained template successfully', async () => {
    const runner = new ChainedTemplateRunner(mockPromptService, mockTemplateManager);

    const outlineTemplate: Template = {
      id: 'outline-template',
      name: 'Outline',
      content: 'Create an outline for {{topic}}',
      metadata: { templateType: 'content-creation', version: '1', lastModified: 0 },
    };

    const articleTemplate: Template = {
      id: 'article-template',
      name: 'Article',
      content: 'Write an article about {{topic}} based on this outline: {{outline}}',
      metadata: { templateType: 'content-creation', version: '1', lastModified: 0 },
    };

    const chainedTemplate: Template = {
      id: 'workflow',
      name: 'Workflow',
      content: '',
      metadata: { templateType: 'chained', version: '1', lastModified: 0 },
      steps: [
        { stepId: 'outline', templateId: 'outline-template', inputs: { topic: '{{topic}}' } },
        { stepId: 'article', templateId: 'article-template', inputs: { topic: '{{topic}}', outline: '{{outline}}' } },
      ],
    };

    (mockTemplateManager.getTemplate as any).mockImplementation(async (id: string) => {
      if (id === 'outline-template') return outlineTemplate;
      if (id === 'article-template') return articleTemplate;
      return null;
    });

    (mockPromptService.testPrompt as any).mockImplementation(async ({ prompt }: { prompt: string }) => {
      if (prompt.includes('outline for AI')) return { content: 'AI Outline' };
      if (prompt.includes('based on this outline: AI Outline')) return { content: 'AI Article' };
      return { content: '' };
    });

    const result = await runner.run(chainedTemplate, { topic: 'AI' });

    expect(result).toEqual({
      topic: 'AI',
      outline: 'AI Outline',
      article: 'AI Article',
    });
  });

  it('should throw an error if the template is not a chained template', async () => {
    const runner = new ChainedTemplateRunner(mockPromptService, mockTemplateManager);
    const simpleTemplate: Template = {
      id: 'simple',
      name: 'Simple',
      content: 'Hello',
      metadata: { templateType: 'content-creation', version: '1', lastModified: 0 },
    };

    await expect(runner.run(simpleTemplate, {})).rejects.toThrow('This template is not a chained template.');
  });
});