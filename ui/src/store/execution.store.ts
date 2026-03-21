import { create } from 'zustand'

export interface ExecutionResult {
  stdout:   string
  stderr:   string
  exitCode: number
  time:     string
  memory:   number
  status:   string
}

interface ExecutionStore {
  result:    ExecutionResult | null
  loading:   boolean
  error:     string | null
  isOpen:    boolean

  setResult:  (result: ExecutionResult) => void
  setLoading: (loading: boolean) => void
  setError:   (error: string | null) => void
  toggle:     () => void
  open:       () => void
  close:      () => void
  reset:      () => void
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  result:  null,
  loading: false,
  error:   null,
  isOpen:  false,

  setResult:  (result)  => set({ result, isOpen: true }),
  setLoading: (loading) => set({ loading }),
  setError:   (error)   => set({ error, isOpen: true }),
  toggle:     ()        => set((s) => ({ isOpen: !s.isOpen })),
  open:       ()        => set({ isOpen: true }),
  close:      ()        => set({ isOpen: false }),
  reset:      ()        => set({ result: null, error: null, loading: false }),
}))