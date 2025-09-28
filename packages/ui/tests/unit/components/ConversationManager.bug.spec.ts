import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import ConversationManager from '../../../src/components/ConversationManager.vue'

// Mock the performance monitor to prevent infinite loops in tests
vi.mock('../../../src/composables/usePerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    recordUpdate: vi.fn(),
  }),
}))

// Minimal i18n setup
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } })

describe('ConversationManager Bug Isolation Test', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should throw "updates.forEach is not a function" when messages prop changes', async () => {
    const wrapper = mount(ConversationManager, {
      props: {
        messages: [],
        availableVariables: {},
        scanVariables: () => [],
      },
      global: {
        plugins: [i18n],
        // Stub all naive-ui components to avoid rendering complexity
        stubs: {
          'n-button': true, 'n-empty': true, 'n-dropdown': true, 'n-card': true,
          'n-space': true, 'n-text': true, 'n-tag': true, 'n-scrollbar': true,
          'n-list': true, 'n-list-item': true, 'n-input': true,
        }
      }
    })

    // The watcher on `messages` runs immediately. Let's clear that first timer.
    vi.runAllTimers();

    // Now, trigger the watcher again by changing the prop.
    // This will call `batchStateUpdate` with a single function.
    await wrapper.setProps({ messages: [{ role: 'user', content: 'hello' }] })

    // Assert that running the timers now executes the faulty callback
    // and throws the specific TypeError we are looking for.
    // The bug is that `batchExecute`'s returned function is called with a single
    // function, but the inner logic tries to iterate over it as an array.
    expect(() => {
      vi.runAllTimers()
    }).toThrowError(/forEach is not a function/);
  })
})