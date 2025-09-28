import { ILLMService } from '../llm/types';
import { TemplateManager } from '../template/manager';
import { isRunningInElectron } from '../../utils/environment';
import { createContentGenerationService } from './service';
import { ElectronContentGenerationServiceProxy } from './electron-proxy';
import { IContentGenerationService } from './types';

export function createContentGenerationServiceFactory(
  llmService: ILLMService,
  templateManager: TemplateManager
): IContentGenerationService {
  if (isRunningInElectron()) {
    // In Electron renderer, use the proxy
    const electronAPI = (window as any).electronAPI;
    if (!electronAPI) {
      throw new Error('Electron API not available in renderer process');
    }
    return new ElectronContentGenerationServiceProxy(electronAPI);
  } else {
    // In main process or web environment, use direct service
    return createContentGenerationService(llmService, templateManager);
  }
}