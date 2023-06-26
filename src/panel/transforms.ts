import { Transforms, NextFrameOpts, Direction } from './'

export const transforms: Transforms = {
  idle: {
    nextFrame: ({ direction, offset }: NextFrameOpts) => ({
      direction,
      leftPosition: offset,
    }),
  },
  sleeping: {
    nextFrame: ({ direction, leftPosition }: NextFrameOpts) => ({
      direction,
      leftPosition,
    }),
  },
  walking: {
    nextFrame: ({
      containerWidth,
      leftPosition: oldLeftPosition,
      direction: oldDirection,
      speed,
    }: // offset,
    NextFrameOpts) => {
      const direction =
        oldLeftPosition >= containerWidth - speed - 150
          ? Direction.left
          : oldLeftPosition <= 0 + speed
          ? Direction.right
          : oldDirection

      const leftPosition =
        direction === Direction.right
          ? oldLeftPosition + speed
          : oldLeftPosition - speed

      return {
        direction,
        leftPosition,
      }
    },
  },
}
