import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChainedTemplateRunner } from '../../../src/services/template/runner';
import { PromptService } from '../../../src/services/prompt';
import { TemplateManager } from '../../../src/services/template/manager';
import { staticLoader } from '../../../src/services/template/static-loader';
import { MemoryStorageProvider } from '../../../src/services/storage/memoryStorageProvider';
import { PreferenceService } from '../../../src/services/preference/service';
import { TemplateLanguageService } from '../../../src/services/template/languageService';
import { UI_SETTINGS_KEYS } from '../../../src/constants/storage-keys';

describe('Chained Template Workflow Integration Test', () => {
  beforeEach(() => {
    staticLoader.reloadTemplates();
  });

  it('should run the blog-post-workflow successfully', async () => {
    const storageProvider = new MemoryStorageProvider();
    const preferenceService = new PreferenceService(storageProvider);
    await preferenceService.set(UI_SETTINGS_KEYS.BUILTIN_TEMPLATE_LANGUAGE, 'zh-CN');
    const languageService = new TemplateLanguageService(preferenceService);
    await languageService.initialize();
    const templateManager = new TemplateManager(storageProvider, languageService, staticLoader);
    const mockPromptService = {
      testPrompt: vi.fn(),
    } as unknown as PromptService;

    const runner = new ChainedTemplateRunner(mockPromptService, templateManager);

    (mockPromptService.testPrompt as any).mockImplementation(async ({ prompt }: { prompt: string }) => {
      if (prompt.includes('大纲')) {
        return { content: 'AI大纲' };
      }
      if (prompt.includes('文章')) {
        return { content: 'AI文章' };
      }
      return { content: '' };
    });

    const workflowTemplate = await templateManager.getTemplate('blog-post-workflow');
    const result = await runner.run(workflowTemplate, { '主题': 'AI' });

    expect(result['outline']).toBe('AI大纲');
    expect(result['article']).toBe('AI文章');
  });
});