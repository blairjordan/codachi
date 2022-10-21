import {
  UserPet,
  setState,
  getPetAnimations,
  gifs,
  generatePet,
  transforms,
  DOM,
  state,
  Animation,
} from './'
import { initializeState } from './state'
import { ContextTransform } from './types'

const defaultState = {
  userPet: generatePet({ name: 'unknown', type: 'unknown' }),
  basePetUri: '',
}

initializeState(defaultState)

const dom = new DOM({
  movementContainerSelector: 'movement-container',
  petImageSelector: 'pet',
  transitionSelector: 'transition',
  transitionContainerSelector: 'transition-container',
  buffSelector: 'buff',
  buffContainerSelector: 'buff-container',
})

const TICK_INTERVAL_MS = 100
const BUFF_TIMEOUT_MS = 30_000
const BUFF_COUNTDOWN_INTERVAL_MS = 1_000

const tick = ({ userPet }: { userPet: UserPet }) => {
  const animations = getPetAnimations({ userPet })

  const { leftPosition, direction } = transforms[userPet.state].nextFrame({
    containerWidth:
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth,
    leftPosition: userPet.leftPosition,
    direction: userPet.direction,
    speed: userPet.speed,
    offset: animations.pet.offset || 0,
  })

  const hasChangedDirection = userPet.direction !== direction

  userPet.leftPosition = leftPosition
  userPet.direction = direction

  // Apply transformation
  const movementContainer = dom.getMovementSelector()
  movementContainer.style.marginLeft = `${userPet.leftPosition}px`

  const petImageElement = dom.getPetImageSelector()
  petImageElement.style.transform = `scaleX(${userPet.direction})`

  // ☁ Transition effect
  if (userPet.isTransitionIn) {
    const { transition: animation } = animations
    if (animation) {
      // Fix the transition container in-place
      const transitionContainer = dom.getTransitionSelector()
      transitionContainer.style.marginLeft = `${userPet.leftPosition}px`

      setImage({
        container: dom.getTransitionSelector(),
        selector: dom.getTransitionImageSelector(),
        animation,
      })
      state.userPet.isTransitionIn = false
    }
  }

  // ✨ Buff effect
  const isApplyBuff = !userPet.buffCountdownTimerMs && userPet.isApplyBuff
  const isReapplyBuffAnimation =
    !userPet.buffCountdownTimerMs && userPet.isApplyBuff

  if (isApplyBuff || isReapplyBuffAnimation) {
    const { buff: animation } = animations
    if (animation) {
      setImage({
        container: dom.getBuffSelector(),
        selector: dom.getBuffImageSelector(),
        animation,
        userPetContext: userPet,
        contextTransforms: animation.contextTransforms,
      })
    }

    userPet.isApplyBuff = false
  }
  if (isApplyBuff) {
    userPet.buffCountdownTimerMs = BUFF_TIMEOUT_MS

    const buffIntervalTimeout = setInterval(() => {
      console.log(`countdown: ${userPet.buffCountdownTimerMs}`)
      userPet.buffCountdownTimerMs -= BUFF_COUNTDOWN_INTERVAL_MS

      if (userPet.buffCountdownTimerMs <= 0) {
        // Expired ⏰
        clearInterval(buffIntervalTimeout)
        dom.getBuffImageSelector().style.display = 'none'
      }
    }, BUFF_COUNTDOWN_INTERVAL_MS)
  }
}

const setImage = ({
  container,
  selector,
  animation,
  userPetContext,
  contextTransforms,
}: {
  container: HTMLElement
  selector: HTMLImageElement
  animation: Animation
  userPetContext?: UserPet
  contextTransforms?: ContextTransform[]
}) => {
  const { basePetUri } = state

  let animationWithTransforms = { ...animation }

  if (userPetContext && contextTransforms) {
    contextTransforms.map((contextTransform) => {
      const transform = contextTransform({ userPetContext })
      animationWithTransforms = {
        ...animationWithTransforms,
        ...transform,
      }
    })
  }
  selector.src = `${basePetUri}/${gifs[animationWithTransforms.gif]}`
  selector.style.minWidth = `${animationWithTransforms.width}px`
  selector.style.display = 'inline'
  selector.width = animationWithTransforms.width || 64
  selector.height = animationWithTransforms.height || 64

  const positionProp = animation.isFixedPosition ? 'left' : 'marginLeft'

  container.style[positionProp] = animationWithTransforms.offset
    ? `${animationWithTransforms.offset}px`
    : 'auto'
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
  setState('userPet', userPet)
  startAnimation()

  // Give the transition a chance to play
  await sleep(TICK_INTERVAL_MS * 2)

  const { pet: animation } = getPetAnimations({
    userPet,
  })

  dom.getBuffImageSelector().style.display = 'none'
  setImage({
    selector: dom.getPetImageSelector(),
    animation,
    container: dom.getMovementSelector(),
  })
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
    addPetToPanel({ userPet })
  }

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', (event): void => {
    const { command, data } = event.data // The data that the extension sent
    switch (command) {
      case 'spawn-pet':
        addPetToPanel({ userPet: data.userPet })
        break

      case 'update-pet':
        addPetToPanel({
          userPet: {
            ...data.userPet,
            leftPosition: state.userPet.leftPosition,
            direction: state.userPet.direction,
          },
        })
        break
      case 'buff-pet':
        state.userPet.isApplyBuff = true
        break
    }
  })
}
