export type State = {
  userPet: UserPet
  basePetUri: string
  intervalId?: NodeJS.Timeout | undefined
}

export type Gifs = { [name: string]: string }

export type PetState = 'walking' | 'idle' | 'transition'

// Special transformations which apply in certain context,
// i.e., a buff animation's offset may change slightly based on
// pet's direction
export type ContextTransformProps = {
  [transformProp: string]: string | number
}

export type ContextTransform = (contextInput: any) => ContextTransformProps

export type Animation = {
  gif: string
  width?: number
  height?: number
  offset?: number
  speed?: number
  duration?: number
  isFixedPosition?: boolean
  contextTransforms?: ContextTransform[]
}

export type PetLevel = {
  xp: number
  defaultState: PetState
  animations: {
    [name: string]: Animation
  }
}

export type Pet = {
  levels: Map<number, PetLevel>
}

export interface UserPetBaseProps {
  leftPosition: number
  speed: number
  direction: number
  level: number
  xp: number
  state: PetState
  isTransitionIn: boolean
  isApplyBuff: boolean
  buffCountdownTimerMs: number
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
