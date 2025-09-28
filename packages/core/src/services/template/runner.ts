import { Template, ChainedStep } from './types';
import { PromptService } from '../prompt';
import { TemplateManager } from './manager';

export class ChainedTemplateRunner {
  private promptService: PromptService;
  private templateManager: TemplateManager;

  constructor(promptService: PromptService, templateManager: TemplateManager) {
    this.promptService = promptService;
    this.templateManager = templateManager;
  }

  async run(template: Template, initialVariables: Record<string, string>): Promise<Record<string, string>> {
    if (template.metadata.templateType !== 'chained' || !template.steps) {
      throw new Error('This template is not a chained template.');
    }

    let stepOutputs: Record<string, string> = { ...initialVariables };

    for (const step of template.steps) {
      const stepResult = await this.executeStep(step, stepOutputs);
      stepOutputs = { ...stepOutputs, ...stepResult };
    }

    return stepOutputs;
  }

  private async executeStep(step: ChainedStep, context: Record<string, string>): Promise<Record<string, string>> {
    const { templateId, inputs } = step;

    // Resolve inputs from the context
    const resolvedInputs: Record<string, string> = {};
    for (const key in inputs) {
      const value = inputs[key];
      if (value.startsWith('{{') && value.endsWith('}}')) {
        const contextKey = value.substring(2, value.length - 2);
        if (context[contextKey]) {
          resolvedInputs[key] = context[contextKey];
        } else {
          throw new Error(`Missing context value for ${value}`);
        }
      } else {
        resolvedInputs[key] = value;
      }
    }

    const subTemplate = await this.templateManager.getTemplate(templateId);
    if (!subTemplate) {
      throw new Error(`Sub-template with id ${templateId} not found.`);
    }

    // This is a simplified execution model. A real implementation would need to handle
    // the specifics of how the prompt service executes a template with variables.
    // For now, we'll simulate this by replacing placeholders in the content.
    let prompt = subTemplate.content as string;
    for (const key in resolvedInputs) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), resolvedInputs[key]);
    }

    const result = await this.promptService.testPrompt({
      prompt,
      model: 'test-model' // Assuming a test model for execution
    });

    return { [step.stepId]: result.content };
  }
}