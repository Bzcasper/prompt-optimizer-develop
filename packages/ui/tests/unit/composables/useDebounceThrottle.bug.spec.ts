import { useDebounceThrottle } from '../../../src/composables/useDebounceThrottle'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the performance monitor to prevent side effects from other parts of the code
vi.mock('../../../src/composables/usePerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    recordUpdate: vi.fn(),
  }),
}))


describe('useDebounceThrottle Bug', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should throw TypeError when batchExecute is used with a callback that expects an array but receives a single item', () => {
    const { batchExecute } = useDebounceThrottle()

    // This callback mimics the one in ConversationManager.vue, which expects an array.
    const callbackThatExpectsArray = (updates) => {
      updates.forEach(fn => fn());
    }

    const batchedFunction = batchExecute(callbackThatExpectsArray);

    // This call mimics the buggy usage in ConversationManager.vue, passing a single function.
    batchedFunction(() => { /* a dummy function */ });

    // We expect this to throw because the callback will be called with a single function,
    // not an array, and will thus fail on `.forEach`.
    expect(() => {
      vi.runAllTimers();
    }).toThrow(TypeError);
  })
})