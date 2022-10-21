import { State } from './'

export let state: State

export const initializeState = (initialState: State) => (state = initialState)

export const setState = <K extends keyof State>(key: K, value: State[K]) =>
  (state = {
    ...state,
    [key]: value,
  })
