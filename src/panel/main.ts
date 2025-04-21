import { DOM } from './'
import type { PetAnimation, UserPet } from './'
import {
  generatePet,
  gifs,
  state,
  setState,
  adjustSpeedForScale,
  getPetAnimations,
  transforms,
  petTypes,
} from './'
import { initializeState } from './state'

declare global {
  interface Window {
    codachiApp: { [key: string]: unknown };
    isExplorerView?: boolean;
  }
}

const defaultState = {
  userPet: generatePet({ name: 'unknown', type: 'unknown' }),
  basePetUri: '',
}

initializeState(defaultState)

const dom = new DOM({
  movementContainerSelector: 'movement-container',
  petImageSelector: 'pet',
  transitionContainerSelector: 'transition-container',
  transitionSelector: 'transition',
})

const TICK_INTERVAL_MS = 100

const tick = ({ userPet }: { userPet: UserPet }): void => {
  const { leftPosition, direction } = transforms[userPet.state].nextFrame({
    containerWidth:
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth,
    leftPosition: userPet.leftPosition,
    direction: userPet.direction,
    speed: adjustSpeedForScale(userPet.speed, userPet.scale),
    offset: getPetAnimations({ userPet }).animation.offset || 0,
    scale: userPet.scale,
  })

  userPet.leftPosition = leftPosition
  userPet.direction = direction

  // Apply transformation
  const movementContainer = dom.getMovementSelector()
  movementContainer.style.marginLeft = `${userPet.leftPosition}px`

  const petImageElement = dom.getPetImageSelector()
  petImageElement.style.transform = `scaleX(${userPet.direction}) scale(${userPet.scale})`

  // Get the pet container and adjust its position to keep pet on the ground
  const petContainer = document.getElementById('pet-container')
  if (petContainer) {
    const { animation } = getPetAnimations({ userPet })
    const verticalAdjustment = (animation.height * (userPet.scale - 1)) / 2
    petContainer.style.bottom = `${verticalAdjustment}px`
  }

  // We're not going to touch isTransitionIn here - we'll only handle it in specific events
}

// Explicitly handle transitions for specific events
const handleTransition = (userPet: UserPet): void => {
  if (!userPet.isTransitionIn) return;
  
  const { transition: animation } = getPetAnimations({
    userPet,
  })

  if (animation) {
    const transitionContainer = dom.getTransitionSelector()
    transitionContainer.style.marginLeft = `${userPet.leftPosition}px`

    // Also adjust transition container height
    const transitionContainerElement = document.getElementById(
      'transition-container'
    )
    if (transitionContainerElement) {
      const verticalAdjustment = (animation.height * (userPet.scale - 1)) / 2
      transitionContainerElement.style.bottom = `${verticalAdjustment}px`
    }

    setImage({
      container: dom.getTransitionSelector(),
      selector: dom.getTransitionImageSelector(),
      animation,
    })
    
    // Clear the transition flag after handling it
    state.userPet.isTransitionIn = false
  }
}

const setImage = ({
  container,
  selector,
  animation,
}: {
  container: HTMLElement
  selector: HTMLImageElement
  animation: PetAnimation
}): void => {
  const { basePetUri, userPet } = state

  selector.src = `${basePetUri}/${gifs[animation.gif]}`
  selector.width = animation.width
  selector.style.minWidth = `${animation.width}px`
  selector.height = animation.height

  // For pet image, we need to maintain scaleX for direction
  if (selector === dom.getPetImageSelector()) {
    selector.style.transform = `scaleX(${userPet.direction}) scale(${userPet.scale})`
  } else {
    // For transition images, just apply the scale
    selector.style.transform = `scale(${userPet.scale})`
  }

  container.style.left = `${animation.offset ?? 0}px`
}

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms))

const startAnimation = (): void => {
  const { userPet } = state
  if (state.intervalId) {
    clearInterval(state.intervalId)
  }
  const intervalId = setInterval(() => {
    tick({ userPet })
  }, TICK_INTERVAL_MS)
  setState('intervalId', intervalId)
}

export const addPetToPanel = async ({
  userPet,
}: {
  userPet: UserPet
}): Promise<void> => {
  const { animation } = getPetAnimations({
    userPet,
  })

  // Store the original speed if it's not already set
  if (!userPet.originalSpeed && animation.speed) {
    userPet.originalSpeed = animation.speed
  }

  if (userPet.originalSpeed) {
    userPet.speed = adjustSpeedForScale(userPet.originalSpeed, userPet.scale)
  }

  // Update the state
  setState('userPet', userPet)
  
  // Handle transition if needed (but only once)
  if (userPet.isTransitionIn) {
    handleTransition(userPet)
  }
  
  // Start the animation loop
  startAnimation()

  // Give everything a chance to render
  await sleep(TICK_INTERVAL_MS * 2)

  // Set the main pet image
  setImage({
    selector: dom.getPetImageSelector(),
    animation,
    container: dom.getMovementSelector(),
  })

  // Apply vertical position adjustment for the pet container
  const petContainer = document.getElementById('pet-container')
  if (petContainer) {
    const verticalAdjustment = (animation.height * (userPet.scale - 1)) / 2
    petContainer.style.bottom = `${verticalAdjustment}px`
  }
}

export const app = ({
  userPet,
  basePetUri,
}: {
  userPet: UserPet
  basePetUri: string
}): void => {
  setState('basePetUri', basePetUri)
  
  // Expose petTypes to the window for XP bar calculations
  window.codachiApp = window.codachiApp || {};
  window.codachiApp.petTypes = petTypes;

  if (userPet) {
    // Handle initial state
    addPetToPanel({ userPet })
  }
  
  // Handle messages sent from the extension to the webview
  window.addEventListener('message', (event): void => {
    const { command, data } = event.data // The data that the extension sent
    switch (command) {
      case 'spawn-pet':
        // New pet creation - always show transition
        addPetToPanel({ userPet: data.userPet })
        break

      case 'update-pet': {
        // If this is just an XP update, only update the XP value
        if (data.isXPUpdate && state.userPet) {
          state.userPet.xp = data.userPet.xp;
          return;
        }
        
        // For level changes or state changes, do a full refresh
        const updatedPet = {
          ...data.userPet,
          leftPosition: state.userPet.leftPosition,
          direction: state.userPet.direction,
        }
        
        // We want transitions to work for level changes
        addPetToPanel({ userPet: updatedPet })
        break;
      }
    }
  })
}
