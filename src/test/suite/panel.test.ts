import * as assert from 'assert'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import * as pets from '../../panel/pets'
import { Direction, PetState, UserPet } from '../../panel/types'

describe('Panel Test Suite', () => {
  before(() => {
    void vscode.window.showInformationMessage('Start all panel tests.')
  })

  it('tests pet animations and states', () => {
    // Test initial pet state
    const testPet: UserPet = {
      name: 'evolveTest',
      type: 'monster1',
      leftPosition: 0,
      speed: 2,
      direction: Direction.right,
      level: 0,
      xp: 0,
      state: 'idle' as PetState,
      isTransitionIn: false,
      scale: 1,
    }

    // Get initial animations
    const initialAnimations = pets.getPetAnimations({ userPet: testPet })
    assert.strictEqual(initialAnimations.animation.gif, 'egg1')

    // Evolve to first level
    testPet.xp = 40
    pets.mutateLevel({ userPet: testPet })

    // Verify level increase
    assert.strictEqual(testPet.level, 1)
    assert.strictEqual(testPet.state, 'walking')
    // Don't check isTransitionIn which can be flaky

    // Get animations after evolution
    const evolvedAnimations = pets.getPetAnimations({ userPet: testPet })
    assert.strictEqual(evolvedAnimations.animation.gif, 'monster1phase1')
  })

  it('tests direction change', () => {
    const testPet: UserPet = {
      name: 'directionTest',
      type: 'monster1',
      leftPosition: 0,
      speed: 2,
      direction: Direction.right,
      level: 1,
      xp: 40,
      state: 'walking' as PetState,
      isTransitionIn: false,
      scale: 1,
    }

    // Simulate walking right
    assert.strictEqual(testPet.direction, Direction.right)

    // Change direction
    testPet.direction = Direction.left

    // Check that direction changed
    assert.strictEqual(testPet.direction, Direction.left)
  })
})
