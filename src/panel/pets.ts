import {
  PetType,
  Pet,
  UserPetArgs,
  Direction,
  PetAnimation,
  UserPet,
  PetLevel,
  Gifs,
} from './'

export const gifs: Gifs = {
  egg1: 'egg1.gif',
  dust1: 'dust1.gif',
  dust2: 'dust2.gif',
  monster1phase1: 'm1d1.gif',
  monster1phase2: 'm1d2.gif',
  monster1phase3: 'm1d3.gif',
  monster2phase1: 'm2d1.gif',
  monster2phase2: 'm2d2.gif',
  monster2phase3: 'm2d3.gif',
  monster3phase1: 'm3d1.gif',
  monster3phase2: 'm3d2.gif',
  monster3phase3: 'm3d3.gif',
  monster4phase1: 'm4d1.gif',
  monster4phase2: 'm4d2.gif',
  monster4phase3: 'm4d3.gif',
  monster5phase1: 'm5d1.gif',
  monster5phase2: 'm5d2.gif',
  monster5phase3: 'm5d3.gif',
}

export const petNames = [
  'boo',
  'nacho',
  'gary',
  'fudge',
  'neko',
  'pip',
  'bibo',
  'fifi',
  'jax',
  'bobba',
  'gidget',
  'mina',
  'crumb',
  'zimbo',
  'dusty',
  'brock',
  'otis',
  'marvin',
  'smokey',
  'barry',
  'tony',
  'dusty',
  'mochi',
]

const animationDefaults = {
  width: 75,
  height: 64,
  speed: 0,
  offset: 0,
}

const egg: PetLevel = {
  xp: 0,
  defaultState: 'idle',
  animations: {
    idle: {
      ...animationDefaults,
      gif: 'egg1',
    },
    transition: {
      ...animationDefaults,
      gif: 'dust1',
      offset: 6,
      width: 100,
      height: 100,
    },
  },
}

// Generic evolution transition
const transition: PetAnimation = {
  ...animationDefaults,
  gif: 'dust2',
  offset: -80,
  width: 280,
  height: 100,
}

export const petTypes = new Map<string, Pet>([
  [
    'monster1',
    {
      levels: new Map([
        [0, egg],
        [
          1,
          {
            xp: 35,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster1phase1',
                speed: 4,
              },
            },
          },
        ],
        [
          2,
          {
            xp: 150000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster1phase2',
                speed: 3,
              },
            },
          },
        ],
        [
          3,
          {
            xp: 240000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster1phase3',
                speed: 3,
              },
            },
          },
        ],
      ]),
    },
  ],
  [
    'monster2',
    {
      levels: new Map([
        [0, egg],
        [
          1,
          {
            xp: 35,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster2phase1',
                width: 64,
                speed: 3,
              },
            },
          },
        ],
        [
          2,
          {
            xp: 100000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster2phase2',
                width: 64,
                speed: 3,
              },
            },
          },
        ],
        [
          3,
          {
            xp: 600000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster2phase3',
                width: 64,
                speed: 3,
              },
            },
          },
        ],
      ]),
    },
  ],
  [
    'monster3',
    {
      levels: new Map([
        [0, egg],
        [
          1,
          {
            xp: 35,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster3phase1',
                width: 64,
                speed: 1,
              },
            },
          },
        ],
        [
          2,
          {
            xp: 599900,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster3phase2',
                width: 64,
                speed: 0,
              },
            },
          },
        ],
        [
          3,
          {
            xp: 600000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster3phase3',
                width: 64,
                speed: 2,
              },
            },
          },
        ],
      ]),
    },
  ],
  [
    'monster4',
    {
      levels: new Map([
        [0, egg],
        [
          1,
          {
            xp: 35,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster4phase1',
                width: 64,
                speed: 3,
              },
            },
          },
        ],
        [
          2,
          {
            xp: 150000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster4phase2',
                width: 64,
                speed: 3,
              },
            },
          },
        ],
        [
          3,
          {
            xp: 240000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster4phase3',
                width: 64,
                speed: 4,
              },
            },
          },
        ],
      ]),
    },
  ],
  [
    'monster5',
    {
      levels: new Map([
        [0, egg],
        [
          1,
          {
            xp: 35,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster5phase1',
                width: 64,
                height: 66,
                speed: 2,
              },
            },
          },
        ],
        [
          2,
          {
            xp: 150000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster5phase2',
                speed: 3,
                height: 100,
                width: 100,
              },
            },
          },
        ],
        [
          3,
          {
            xp: 240000,
            defaultState: 'walking',
            animations: {
              transition,
              walking: {
                ...animationDefaults,
                gif: 'monster5phase3',
                speed: 3,
                height: 135,
                width: 125,
              },
            },
          },
        ],
      ]),
    },
  ],
])

export const randomPetType = (): PetType =>
  Array.from(petTypes.keys())[
    Math.floor(Math.random() * petTypes.size)
  ] as PetType

export const randomPetName = (): string => {
  const name = petNames[Math.floor(Math.random() * petNames.length)]
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

export const getPetAnimations = ({
  userPet,
}: {
  userPet: UserPet
}): {
  animation: PetAnimation
  transition: PetAnimation | undefined
} => {
  const petTypeFound = petTypes.get(userPet.type)
  if (!petTypeFound) {
    throw new Error(`Pet type not found: ${userPet.type}`)
  }

  const levelFound = petTypeFound.levels.get(userPet.level)
  if (!levelFound) {
    throw new Error(
      `Pet level not found for pet type ${userPet.type}: ${userPet.level}`
    )
  }

  if (!(userPet.state in levelFound.animations)) {
    throw new Error(
      `Animation not found for pet type ${userPet.type}, level ${userPet.level}: ${userPet.state}`
    )
  }

  const transition =
    'transition' in levelFound.animations
      ? levelFound.animations.transition
      : undefined

  return {
    animation: levelFound.animations[userPet.state],
    transition,
  }
}

// TODO: Set scale (passed from settings)
export const generatePet = ({ name, type }: UserPetArgs): UserPet => ({
  leftPosition: 0,
  speed: 0,
  direction: Direction.right,
  level: 0,
  xp: 0,
  // All level 0 characters require this state
  state: 'idle',
  isTransitionIn: true,
  name,
  type,
  scale: 1, // TODO: require scale (passed from settings)
})

export const getLevel = ({
  petType,
  level,
}: {
  petType: PetType
  level: number
}) => {
  const petTypeFound = petTypes.get(petType)
  if (!petTypeFound) {
    return undefined
  }

  const levelFound = petTypeFound.levels.get(level)
  if (!levelFound) {
    return undefined
  }

  return levelFound
}

export const mutateLevel = ({ userPet }: { userPet: UserPet }) => {
  const nextLevelFound = getLevel({
    petType: userPet.type,
    level: userPet.level + 1,
  })

  if (!nextLevelFound) {
    return
  }

  if (userPet.xp >= nextLevelFound.xp) {
    userPet.level += 1
    userPet.xp = 0
    userPet.state = nextLevelFound.defaultState
    userPet.speed = nextLevelFound.animations[userPet.state].speed || 0
    userPet.isTransitionIn = true
  }
}
