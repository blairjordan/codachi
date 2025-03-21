import {
  DOM,
  PetAnimation,
  UserPet,
  adjustSpeedForScale,
  generatePet,
  getPetAnimations,
  gifs,
  setState,
  state,
  transforms,
} from './'
import { initializeState } from './state'

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

// Store played transitions in a local variable outside the tick function
const playedTransitions: { [key: string]: boolean } = {}

const tick = ({ userPet }: { userPet: UserPet }) => {
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

  // Handle transition animations with tracking to prevent repeating
  if (userPet.isTransitionIn) {
    const transitionKey = `${userPet.level}-${userPet.state}`

    // Skip if we've already played this specific transition
    if (playedTransitions[transitionKey]) {
      // For eggs (level 0, idle), preserve isTransitionIn but don't show animation again
      if (userPet.level === 0 && userPet.state === 'idle') {
        // Preserve the flag but skip animation
        return
      } else {
        // For non-eggs, clear the flag
        state.userPet.isTransitionIn = false
        return
      }
    }

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

      // Mark this transition as played
      playedTransitions[transitionKey] = true

      // For non-eggs, clear the transition flag
      if (!(userPet.level === 0 && userPet.state === 'idle')) {
        state.userPet.isTransitionIn = false
      }
    }
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
}) => {
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const startAnimation = () => {
  const { userPet } = state
  if (state.intervalId) {
    clearInterval(state.intervalId)
  }
  const intervalId = setInterval(() => {
    tick({ userPet })
  }, TICK_INTERVAL_MS)
  setState('intervalId', intervalId)
}

export const addPetToPanel = async ({ userPet }: { userPet: UserPet }) => {
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

  // If this is a new egg (level 0), reset transition tracking
  if (
    userPet.level === 0 &&
    userPet.state === 'idle' &&
    userPet.isTransitionIn
  ) {
    // Clear history for new eggs to ensure transition plays
    const eggKey = `0-idle`
    delete playedTransitions[eggKey]
  }

  // NEVER modify isTransitionIn - respect whatever value was passed in
  // This is critical for preserving egg state correctly

  // Set the state with the pet as-is
  setState('userPet', userPet)

  startAnimation()

  // Give the transition a chance to play
  await sleep(TICK_INTERVAL_MS * 2)

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
}) => {
  setState('basePetUri', basePetUri)

  if (userPet) {
    // Pass the pet object exactly as received
    addPetToPanel({ userPet })
  }

  // Track document visibility changes to reset transitions when tab becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Reset transitions when the tab becomes visible again
      // This helps with the case where the user switches away and back
      Object.keys(playedTransitions).forEach(
        (key) => delete playedTransitions[key]
      )
    }
  })

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', (event): void => {
    const { command, data } = event.data // The data that the extension sent
    switch (command) {
      case 'spawn-pet':
        // Clear played transitions when spawning a new pet
        Object.keys(playedTransitions).forEach(
          (key) => delete playedTransitions[key]
        )

        // For spawn-pet, always start fresh
        addPetToPanel({ userPet: data.userPet })
        break

      case 'update-pet':
        // Check if this is a significant state change (like level or pet type)
        const isNewPet =
          !state.userPet ||
          state.userPet.type !== data.userPet.type ||
          state.userPet.name !== data.userPet.name

        const isLevelChange =
          state.userPet && state.userPet.level !== data.userPet.level

        // Reset transition tracking for significant changes
        if (isNewPet || isLevelChange || data.userPet.isTransitionIn) {
          Object.keys(playedTransitions).forEach(
            (key) => delete playedTransitions[key]
          )
        }

        // Preserve position and direction but use all other properties from the update
        // This is critical for preserving the egg/hatched state when switching views
        const updatedPet = {
          ...data.userPet,
          leftPosition:
            state.userPet?.leftPosition || data.userPet.leftPosition,
          direction: state.userPet?.direction || data.userPet.direction,
        }
        addPetToPanel({ userPet: updatedPet })
        break
    }
  })
}
