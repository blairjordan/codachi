export type State = {
  userPet: UserPet
  basePetUri: string
  intervalId?: NodeJS.Timeout | undefined
}

export type Gifs = { [name: string]: string }

export type PetState = 'walking' | 'idle' | 'transition'

export type PetAnimation = {
  gif: string
  width: number
  height: number
  offset?: number
  speed?: number
  duration?: number
}

export type PetLevel = {
  xp: number
  defaultState: PetState
  animations: {
    [name: string]: PetAnimation
  }
}

export type Pet = {
  levels: Map<number, PetLevel>
}

export interface UserPetBaseProps {
  leftPosition: number
  speed: number
  originalSpeed?: number
  direction: number
  level: number
  xp: number
  state: PetState
  isTransitionIn: boolean
  scale: number
}

export type PetType = 'monster1' | 'monster2' | 'unknown'

export interface UserPetArgs {
  name: string
  type: PetType
}

export type UserPet = UserPetBaseProps & UserPetArgs

export enum Direction {
  right = 1,
  left = -1,
}

export type NextFrameOpts = {
  containerWidth: number
  leftPosition: number
  direction: number
  speed: number
  offset: number
  scale: number
}

export type NextFrameFnReturn = {
  leftPosition: number
  direction: number
  newPetState?: PetState
}

export type NextFrameFn = (opts: NextFrameOpts) => NextFrameFnReturn

export type Transforms = {
  [transform: string]: {
    nextFrame: NextFrameFn
  }
}
