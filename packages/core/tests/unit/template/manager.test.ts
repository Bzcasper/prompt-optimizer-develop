import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateManager } from '../../../src/services/template/manager';
import { IStorageProvider } from '../../../src/services/storage/types';
import { MemoryStorageProvider } from '../../../src/services/storage/memoryStorageProvider';
import { createTemplateLanguageService, TemplateLanguageService } from '../../../src/services/template/languageService';
import { StaticLoader } from '../../../src/services/template/static-loader';
import { Template } from '../../../src/services/template/types';
import { PreferenceService } from '../../../src/services/preference/service';

describe('TemplateManager with Mocked LanguageService', () => {
  let storageProvider: IStorageProvider;
  let languageService: TemplateLanguageService;
  let templateManager: TemplateManager;
  let staticLoader: StaticLoader;
  let preferenceService: PreferenceService;

  beforeEach(async () => {
    storageProvider = new MemoryStorageProvider();
    staticLoader = new StaticLoader();
    preferenceService = new PreferenceService(storageProvider);

    // Create a real language service instance and spy on its methods
    languageService = createTemplateLanguageService(preferenceService);
    
    vi.spyOn(languageService, 'initialize').mockResolvedValue(undefined);
    vi.spyOn(languageService, 'getCurrentLanguage').mockReturnValue('en-US');
    vi.spyOn(languageService, 'setLanguage').mockResolvedValue(undefined);
    vi.spyOn(languageService, 'getSupportedLanguages').mockReturnValue(['en-US', 'zh-CN']);
    
    templateManager = new TemplateManager(storageProvider, languageService);
    
    const mockZhTemplates = {
      'test-zh': { id: 'test-zh', name: '测试模板', content: '你好', isBuiltin: true, metadata: { templateType: 'optimize', version: '1.0', lastModified: 0, language: 'zh-CN' } },
      'analytical-optimize': { id: 'analytical-optimize', name: '分析优化', content: '分析内容', isBuiltin: true, metadata: { templateType: 'optimize', version: '1.0', lastModified: 0, language: 'zh-CN' } }
    };
    const mockEnTemplates = { 'test-en': { id: 'test-en', name: 'Test Template', content: 'Hello', isBuiltin: true, metadata: { templateType: 'optimize', version: '1.0', lastModified: 0, language: 'en-US' } } };

    // Spy on static loader methods to provide consistent mock data
    vi.spyOn(staticLoader, 'getDefaultTemplates').mockReturnValue(mockZhTemplates);
    vi.spyOn(staticLoader, 'getDefaultTemplatesEn').mockReturnValue(mockEnTemplates);

    // Mock loadTemplates to ensure the fix can be tested correctly
    vi.spyOn(staticLoader, 'loadTemplates').mockReturnValue({
      all: { ...mockEnTemplates, ...mockZhTemplates },
      byLanguage: { 'en': mockEnTemplates, 'zh': mockZhTemplates },
      byType: {
        'optimize': {
          'en': mockEnTemplates,
          'zh': mockZhTemplates
        },
        'iterate': { 'en': {}, 'zh': {} },
        'user-optimize': { 'en': {}, 'zh': {} }
      }
    });
    
    // Manually inject the mocked staticLoader into the private field for testing purposes
    (templateManager as any).staticLoader = staticLoader;
  });

  it('should load English templates by default in a test environment', async () => {
    const templates = await templateManager.listTemplates();
    const enTemplate = templates.find(t => t.id === 'test-en');
    const zhTemplate = templates.find(t => t.id === 'test-zh');

    expect(enTemplate).toBeDefined();
    expect(zhTemplate).toBeUndefined();
    expect(enTemplate?.content).toBe('Hello');
    });

  it('should switch to Chinese templates when language is explicitly changed', async () => {
    // Change the language and reload
    vi.spyOn(languageService, 'getCurrentLanguage').mockReturnValue('zh-CN');
    await templateManager.changeBuiltinTemplateLanguage('zh-CN');
    
    const templates = await templateManager.listTemplates();
    const enTemplate = templates.find(t => t.id === 'test-en');
    const zhTemplate = templates.find(t => t.id === 'test-zh');

    expect(zhTemplate).toBeDefined();
    expect(enTemplate).toBeUndefined();
    expect(zhTemplate?.content).toBe('你好');
    });

  it('should get current builtin template language from the language service', async () => {
    vi.spyOn(languageService, 'getCurrentLanguage').mockResolvedValue('en-US');
    const lang = await templateManager.getCurrentBuiltinTemplateLanguage();
    expect(lang).toBe('en-US');
    expect(languageService.getCurrentLanguage).toHaveBeenCalled();
    });

  it('should save and retrieve a user template', async () => {
    const newUserTemplate: Template = {
      id: 'user-test',
      name: 'User Template',
      content: 'User Content',
      isBuiltin: false,
      metadata: { templateType: 'userOptimize', version: '1.0', lastModified: Date.now() }
    };
    await templateManager.saveTemplate(newUserTemplate);
    const retrieved = await templateManager.getTemplate('user-test');
    expect(retrieved).toBeDefined();
    expect(retrieved.content).toBe('User Content');
    expect(retrieved.isBuiltin).toBe(false);
    });

  it('should not allow overwriting a builtin template', async () => {
    const maliciousTemplate: Template = {
      id: 'test-en', // ID of a built-in template
      name: 'Malicious Template',
      content: 'Malicious Content',
      isBuiltin: false,
      metadata: { templateType: 'userOptimize', version: '1.0', lastModified: Date.now() }
    };
    await expect(templateManager.saveTemplate(maliciousTemplate))
      .rejects.toThrow('Cannot overwrite built-in template: test-en');
    });

  it('should list both builtin and user templates', async () => {
    const newUserTemplate: Template = {
      id: 'user-test-2',
      name: 'Another User Template',
      content: 'Another User Template',
      isBuiltin: false,
      metadata: { templateType: 'userOptimize', version: '1.0', lastModified: Date.now() }
    };
    await templateManager.saveTemplate(newUserTemplate);

    const allTemplates = await templateManager.listTemplates();
    expect(allTemplates.length).toBe(2);
    expect(allTemplates.some(t => t.id === 'test-en')).toBe(true);
    expect(allTemplates.some(t => t.id === 'user-test-2')).toBe(true);
    });

  it('should delete a user template', async () => {
    const newUserTemplate: Template = {
      id: 'to-be-deleted',
      name: 'Delete Me',
      content: 'Delete me',
      isBuiltin: false,
      metadata: { templateType: 'userOptimize', version: '1.0', lastModified: Date.now() }
    };
    await templateManager.saveTemplate(newUserTemplate);
    let allTemplates = await templateManager.listTemplates();
    expect(allTemplates.length).toBe(2);

    await templateManager.deleteTemplate('to-be-deleted');
    
    allTemplates = await templateManager.listTemplates();
    expect(allTemplates.length).toBe(1);
    expect(allTemplates.some(t => t.id === 'to-be-deleted')).toBe(false);
    });

  it('should not allow deleting a built-in template', async () => {
    await expect(templateManager.deleteTemplate('test-en'))
      .rejects.toThrow('Cannot delete built-in template: test-en');
  });

  it('should not delete a user template that conflicts with a built-in template in another language', async () => {
    // Mock that 'analytical-optimize' is a built-in template in Chinese
    vi.spyOn(staticLoader, 'getDefaultTemplates').mockReturnValue({
      'analytical-optimize': {
        id: 'analytical-optimize',
        name: '分析优化',
        content: '分析内容',
        isBuiltin: true,
        metadata: { templateType: 'optimize', version: '1.0', lastModified: 0, language: 'zh-CN' }
      }
    });
    // Ensure English templates don't have this ID
    vi.spyOn(staticLoader, 'getDefaultTemplatesEn').mockReturnValue({
      'test-en': { id: 'test-en', name: 'Test Template', content: 'Hello', isBuiltin: true, metadata: { templateType: 'optimize', version: '1.0', lastModified: 0, language: 'en-US' } }
    });


    // Current language is English
    vi.spyOn(languageService, 'getCurrentLanguage').mockReturnValue('en-US');

    // Create a user template with an ID that conflicts with a Chinese built-in template
    const conflictingTemplate: Template = {
      id: 'analytical-optimize',
      name: 'Conflicting User Template',
      content: 'User Content',
      isBuiltin: false,
      metadata: { templateType: 'userOptimize', version: '1.0', lastModified: Date.now() }
    };

    // This save should succeed as the conflict is in another language
    await templateManager.saveTemplate(conflictingTemplate);

    // This delete should fail, but currently passes
    await expect(templateManager.deleteTemplate('analytical-optimize'))
      .rejects.toThrow('Cannot delete built-in template: analytical-optimize');
  });
});