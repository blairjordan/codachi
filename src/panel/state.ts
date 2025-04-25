import type { State } from './'

export let state: State

export const initializeState = (initialState: State): void => {
  state = initialState
}

export const setState = <K extends keyof State>(
  key: K,
  value: State[K]
): State => {
  state = {
    ...state,
    [key]: value,
  }
  return state
}
