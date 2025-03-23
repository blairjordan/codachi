import { DOM } from './dom'
import {
  generatePet,
  getPetAnimations,
  gifs,
  mutateLevel,
  petTypes,
  randomPetName,
  randomPetType,
} from './pets'
import { initializeState, setState, state } from './state'
import { transforms } from './transforms'
import {
  Direction,
  Gifs,
  NextFrameFn,
  NextFrameFnReturn,
  NextFrameOpts,
  Pet,
  PetAnimation,
  PetLevel,
  PetState,
  PetType,
  State,
  Transforms,
  UserPet,
  UserPetArgs,
  UserPetBaseProps,
} from './types'

// Function to adjust speed based on scale
export const adjustSpeedForScale = (
  originalSpeed: number,
  scale: number
): number => originalSpeed * (0.7 + 0.6 * scale)

export {
  Direction,
  DOM,
  generatePet,
  getPetAnimations,
  gifs,
  Gifs,
  initializeState,
  mutateLevel,
  NextFrameFn,
  NextFrameFnReturn,
  NextFrameOpts,
  Pet,
  PetAnimation,
  PetLevel,
  PetState,
  PetType,
  petTypes,
  randomPetName,
  randomPetType,
  setState,
  State,
  state,
  Transforms,
  transforms,
  UserPet,
  UserPetArgs,
  UserPetBaseProps,
}
