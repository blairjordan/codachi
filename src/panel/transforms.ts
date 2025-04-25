import { Direction } from './'
import type { NextFrameOpts, Transforms } from './'

export const transforms: Transforms = {
  idle: {
    nextFrame: ({ direction, offset, scale }: NextFrameOpts) => ({
      direction,
      leftPosition: offset,
      scale,
    }),
  },
  walking: {
    nextFrame: ({
      containerWidth,
      leftPosition: oldLeftPosition,
      direction: oldDirection,
      speed,
      scale,
    }: NextFrameOpts) => {
      // Detect if we're in explorer view mode (set in extension.ts)
      const isExplorerView =
        typeof window !== 'undefined' &&
        (window as Window & { isExplorerView?: boolean }).isExplorerView ===
          true

      // Use different boundaries based on view type
      const rightMargin = isExplorerView ? 60 : 80
      const leftMargin = isExplorerView ? -15 : speed

      // Determine direction based on position
      const direction =
        oldLeftPosition >= containerWidth - speed - rightMargin
          ? Direction.left
          : oldLeftPosition <= leftMargin
          ? Direction.right
          : oldDirection

      // Update position based on direction
      const leftPosition =
        direction === Direction.right
          ? oldLeftPosition + speed
          : oldLeftPosition - speed

      return {
        direction,
        leftPosition,
        scale,
      }
    },
  },
}

export const walking = (
  containerWidth: number,
  speed: number,
  leftPosition: number,
  direction: Direction
): { leftPosition: number; direction: Direction } => {
  // Check if we're in explorer view mode
  const isExplorerView =
    typeof window !== 'undefined' &&
    (window as Window & { isExplorerView?: boolean }).isExplorerView === true

  // Use different margins for explorer view
  const leftMargin = isExplorerView ? -15 : speed
  const rightMargin = isExplorerView ? 85 : 150

  // Calculate effective width
  const effectiveWidth = containerWidth - rightMargin

  // Determine direction based on position and boundaries
  let newDirection = direction
  if (leftPosition >= effectiveWidth) {
    newDirection = Direction.left
  } else if (leftPosition <= leftMargin) {
    newDirection = Direction.right
  }

  // Update position based on direction
  let newLeftPosition: number
  if (newDirection === Direction.right) {
    newLeftPosition = leftPosition + speed
  } else {
    newLeftPosition = leftPosition - speed
  }

  return {
    leftPosition: newLeftPosition,
    direction: newDirection,
  }
}
