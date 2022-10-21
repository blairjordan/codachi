export class KeyStrokeVelocity {
  _periods: number
  _msPerPeriod: number
  _intervalId: NodeJS.Timeout | undefined = undefined

  _periodValues: number[] = []
  _currentPeriodKeystrokes = 0
  _velocity = 0
  _multiplier = 0
  _threshold = 0

  getMultipler() {
    return this._multiplier
  }

  constructor(
    periods: number = 6,
    msPerPeriod: number = 10_000,
    threshold: number = 5
  ) {
    this._periods = periods
    this._msPerPeriod = msPerPeriod
    this._threshold = threshold
    return this
  }

  reset() {
    this._velocity = 0
    this._multiplier = 0
  }

  addKeyPress() {
    if (!this._intervalId) {
      return
    }
    this._currentPeriodKeystrokes++
  }

  isThresholdExceeded() {
    return this._multiplier >= this._threshold
  }

  startWatch() {
    this._intervalId = setInterval(() => {
      if (this._periodValues.length >= this._periods) {
        this._periodValues.shift()
      }

      this._periodValues.push(this._currentPeriodKeystrokes)
      this._currentPeriodKeystrokes = 0
      this._velocity =
        this._periodValues.reduce((a, b) => a + b, 0) / this._periods

      this._multiplier = this._velocity / this._periods
    }, this._msPerPeriod)
  }

  endWatch() {
    if (this._intervalId) {
      clearInterval(this._intervalId)
    }
  }
}
