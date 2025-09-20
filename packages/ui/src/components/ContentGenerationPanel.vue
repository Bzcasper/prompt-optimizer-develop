<template>
  <NFlex vertical :style="{ height: '100%' }">
    <!-- 模板选择区域 -->
    <div :style="{ flexShrink: 0, marginBottom: '16px' }">
      <NCard size="small" title="Content Generation">
        <template #header-extra>
          <NSpace>
            <NButton
              size="small"
              type="primary"
              :loading="isGenerating"
              @click="handleGenerate"
            >
              {{ isGenerating ? 'Generating...' : 'Generate Content' }}
            </NButton>
            <NButton
              size="small"
              type="info"
              :loading="isIterating"
              @click="handleIterativeGenerate"
              v-if="selectedTemplate"
            >
              {{ isIterating ? 'Iterating...' : 'Iterative Generate' }}
            </NButton>
          </NSpace>
        </template>

        <NSpace vertical>
          <!-- 模板选择 -->
          <NFormItem label="Template" :show-feedback="false">
            <NSelect
              v-model:value="selectedTemplateId"
              :options="templateOptions"
              placeholder="Select a content template"
              clearable
              @update:value="handleTemplateChange"
            />
          </NFormItem>

          <!-- 变量输入区域 -->
          <div v-if="selectedTemplate && requiredVariables.length > 0">
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }">
              <span :style="{ fontSize: '14px', fontWeight: '500' }">Variables</span>
              <NSpace>
                <NButton
                  size="tiny"
                  type="tertiary"
                  @click="showVariableManager = true"
                >
                  Manage Variables
                </NButton>
                <NButton
                  size="tiny"
                  type="tertiary"
                  @click="showVariableImporter = true"
                >
                  Import Variables
                </NButton>
              </NSpace>
            </div>

            <NFormItem
              v-for="variable in requiredVariables"
              :key="variable"
              :label="variable"
              :show-feedback="false"
            >
              <NInput
                v-model:value="variables[variable]"
                :placeholder="`Enter ${variable}`"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
              />
            </NFormItem>
          </div>

          <!-- 可选变量 -->
          <div v-if="selectedTemplate && optionalVariables.length > 0">
            <NCollapse>
              <NCollapseItem title="Optional Variables" name="optional">
                <NFormItem
                  v-for="variable in optionalVariables"
                  :key="variable"
                  :label="`${variable} (optional)`"
                  :show-feedback="false"
                >
                  <NInput
                    v-model:value="variables[variable]"
                    :placeholder="`Enter ${variable} (optional)`"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  />
                </NFormItem>
              </NCollapseItem>
            </NCollapse>
          </div>

          <!-- 系统提示词 -->
          <NFormItem label="System Prompt (optional)" :show-feedback="false">
            <NInput
              v-model:value="systemPrompt"
              placeholder="Custom system prompt for the AI..."
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </NFormItem>

          <!-- 迭代设置 -->
          <div v-if="showIterationSettings">
            <NFormItem label="Refinement Requirements" :show-feedback="false">
              <NInput
                v-model:value="refinementPrompt"
                placeholder="Describe how to improve the content..."
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
            </NFormItem>

            <NFormItem label="Max Iterations" :show-feedback="false">
              <NSlider
                v-model:value="maxIterations"
                :min="1"
                :max="10"
                :step="1"
                :marks="{ 1: '1', 3: '3', 5: '5', 10: '10' }"
              />
            </NFormItem>
          </div>
        </NSpace>
      </NCard>
    </div>

    <!-- 生成结果区域 -->
    <div :style="{ flex: 1, overflow: 'hidden' }">
      <NCard size="small" title="Generated Content" :style="{ height: '100%' }">
        <template #header-extra>
          <NSpace>
            <NButton
              size="small"
              type="tertiary"
              @click="copyToClipboard"
              v-if="generatedContent"
            >
              Copy
            </NButton>
            <NButton
              size="small"
              type="tertiary"
              @click="clearContent"
            >
              Clear
            </NButton>
          </NSpace>
        </template>

        <div v-if="generatedContent" :style="{ height: '100%', overflow: 'auto' }">
          <MarkdownRenderer :content="generatedContent" />
        </div>

        <NEmpty
          v-else
          description="No content generated yet"
          :style="{ height: '200px' }"
        />
      </NCard>
    </div>

    <!-- Variable Manager Modal -->
    <VariableManagerModal
      v-model:show="showVariableManager"
      :variables="availableVariables"
      @variable-selected="handleVariableSelected"
    />

    <!-- Variable Importer Modal -->
    <VariableImporter
      v-model:show="showVariableImporter"
      @variables-imported="handleVariablesImported"
    />
  </NFlex>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import {
  NCard,
  NSpace,
  NFormItem,
  NSelect,
  NInput,
  NButton,
  NCollapse,
  NCollapseItem,
  NSlider,
  NEmpty,
  NFlex
} from 'naive-ui'

import MarkdownRenderer from './MarkdownRenderer.vue'
import VariableManagerModal from './VariableManagerModal.vue'
import VariableImporter from './VariableImporter.vue'

// Types
interface ContentTemplate {
  id: string
  name: string
  description: string
  category: string
  requiredVariables: string[]
  optionalVariables: string[]
  outputFormat: string
}

interface ContentGenerationResult {
  content: string
  metadata: {
    templateId: string
    modelKey: string
    variables: Record<string, any>
    generatedAt: Date
    tokensUsed?: number
    processingTime: number
  }
  iterations?: Array<{
    step: number
    content: string
    feedback?: string
    timestamp: Date
  }>
}

// Props
interface Props {
  contentGenerationService?: {
    generateContent: (request: any) => Promise<ContentGenerationResult>
    generateWithIteration: (request: any, refinementPrompt: string, maxIterations?: number) => Promise<ContentGenerationResult>
    getAvailableTemplates: () => Promise<ContentTemplate[]>
    validateVariables: (templateId: string, variables: Record<string, any>) => Promise<{ isValid: boolean; errors: string[]; warnings: string[] }>
  }
  modelKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelKey: 'mcp-default'
})

// Emits
const emit = defineEmits<{
  contentGenerated: [result: ContentGenerationResult]
  error: [error: Error]
}>()

// Composables
const message = useMessage()

// Reactive data
const selectedTemplateId = ref<string>('')
const selectedTemplate = ref<ContentTemplate | null>(null)
const variables = ref<Record<string, string>>({})
const systemPrompt = ref('')
const refinementPrompt = ref('')
const maxIterations = ref(3)
const generatedContent = ref('')
const isGenerating = ref(false)
const isIterating = ref(false)
const showIterationSettings = ref(false)
const availableTemplates = ref<ContentTemplate[]>([])
const showVariableManager = ref(false)
const showVariableImporter = ref(false)
const availableVariables = ref<Array<{name: string, value: string}>>([])

// Computed
const templateOptions = computed(() =>
  availableTemplates.value.map(template => ({
    label: `${template.name} (${template.category})`,
    value: template.id
  }))
)

const requiredVariables = computed(() =>
  selectedTemplate.value?.requiredVariables || []
)

const optionalVariables = computed(() =>
  selectedTemplate.value?.optionalVariables || []
)

// Methods
const loadTemplates = async () => {
  if (!props.contentGenerationService) return

  try {
    availableTemplates.value = await props.contentGenerationService.getAvailableTemplates()
  } catch (error) {
    console.error('Failed to load templates:', error)
    message.error('Failed to load content templates')
  }
}

const handleTemplateChange = (templateId: string) => {
  selectedTemplate.value = availableTemplates.value.find(t => t.id === templateId) || null
  variables.value = {}

  // Initialize required variables
  if (selectedTemplate.value) {
    selectedTemplate.value.requiredVariables.forEach(variable => {
      variables.value[variable] = ''
    })
  }
}

const validateInputs = (): boolean => {
  if (!selectedTemplate.value) {
    message.error('Please select a content template')
    return false
  }

  // Check required variables
  for (const variable of requiredVariables.value) {
    if (!variables.value[variable]?.trim()) {
      message.error(`Please fill in the required variable: ${variable}`)
      return false
    }
  }

  return true
}

const handleGenerate = async () => {
  if (!props.contentGenerationService || !validateInputs()) return

  isGenerating.value = true
  showIterationSettings.value = false

  try {
    const result = await props.contentGenerationService.generateContent({
      templateId: selectedTemplateId.value,
      variables: variables.value,
      modelKey: props.modelKey,
      options: {
        systemPrompt: systemPrompt.value || undefined
      }
    })

    generatedContent.value = result.content
    emit('contentGenerated', result)
    message.success('Content generated successfully')
  } catch (error) {
    console.error('Content generation failed:', error)
    message.error('Failed to generate content')
    emit('error', error as Error)
  } finally {
    isGenerating.value = false
  }
}

const handleIterativeGenerate = async () => {
  if (!props.contentGenerationService || !validateInputs()) return

  if (!refinementPrompt.value.trim()) {
    message.error('Please provide refinement requirements for iterative generation')
    return
  }

  isIterating.value = true
  showIterationSettings.value = true

  try {
    const result = await props.contentGenerationService.generateWithIteration(
      {
        templateId: selectedTemplateId.value,
        variables: variables.value,
        modelKey: props.modelKey,
        options: {
          systemPrompt: systemPrompt.value || undefined,
          iterativeRefinement: true,
          refinementSteps: maxIterations.value
        }
      },
      refinementPrompt.value,
      maxIterations.value
    )

    generatedContent.value = result.content
    emit('contentGenerated', result)
    message.success(`Content generated with ${result.iterations?.length || 0} iterations`)
  } catch (error) {
    console.error('Iterative content generation failed:', error)
    message.error('Failed to generate content iteratively')
    emit('error', error as Error)
  } finally {
    isIterating.value = false
  }
}

const copyToClipboard = async () => {
  if (!generatedContent.value) return

  try {
    await navigator.clipboard.writeText(generatedContent.value)
    message.success('Content copied to clipboard')
  } catch (error) {
    message.error('Failed to copy content')
  }
}

const clearContent = () => {
  generatedContent.value = ''
}

const handleVariableSelected = (variable: {name: string, value: string}) => {
  // Apply selected variable to current variables
  if (selectedTemplate.value) {
    const varName = Object.keys(variables.value).find(key =>
      key.toLowerCase().includes(variable.name.toLowerCase()) ||
      variable.name.toLowerCase().includes(key.toLowerCase())
    )

    if (varName) {
      variables.value[varName] = variable.value
      message.success(`Applied variable "${variable.name}" to "${varName}"`)
    } else {
      // If no matching variable found, add it to the first empty required variable
      const emptyVar = requiredVariables.value.find(v => !variables.value[v])
      if (emptyVar) {
        variables.value[emptyVar] = variable.value
        message.success(`Applied variable "${variable.name}" to "${emptyVar}"`)
      }
    }
  }
}

const handleVariablesImported = (importedVariables: Array<{name: string, value: string}>) => {
  // Update available variables list
  availableVariables.value = [...availableVariables.value, ...importedVariables]
  message.success(`Imported ${importedVariables.length} variables`)
}

// Lifecycle
onMounted(() => {
  loadTemplates()
})

// Watchers
watch(selectedTemplateId, (newId) => {
  if (!newId) {
    selectedTemplate.value = null
    variables.value = {}
  }
})
</script>

<style scoped>
/* Component-specific styles if needed */
</style>