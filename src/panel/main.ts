import {
  UserPet,
  setState,
  getPetAnimations,
  gifs,
  generatePet,
  transforms,
  DOM,
  state,
  PetAnimation,
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

const tick = ({ userPet }: { userPet: UserPet }) => {
  const { leftPosition, direction } = transforms[userPet.state].nextFrame({
    containerWidth:
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth,
    leftPosition: userPet.leftPosition,
    direction: userPet.direction,
    speed: userPet.speed,
    offset: getPetAnimations({ userPet }).animation.offset || 0,
  })

  userPet.leftPosition = leftPosition
  userPet.direction = direction

  // Apply transformation
  const movementContainer = dom.getMovementSelector()
  movementContainer.style.marginLeft = `${userPet.leftPosition}px`

  const petImageElement = dom.getPetImageSelector()
  petImageElement.style.transform = `scaleX(${userPet.direction})`

  if (userPet.isTransitionIn) {
    const { transition: animation } = getPetAnimations({
      userPet,
    })

    if (animation) {
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
  const { basePetUri } = state

  selector.src = `${basePetUri}/${gifs[animation.gif]}`
  selector.width = animation.width
  selector.style.minWidth = `${animation.width}px`
  selector.height = animation.height

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
  setState('userPet', userPet)
  startAnimation()

  // Give the transition a chance to play
  await sleep(TICK_INTERVAL_MS * 2)

  const { animation } = getPetAnimations({
    userPet,
  })

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
    }
  })
}
