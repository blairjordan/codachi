export class Xp {
  _periods: number
  _msPerPeriod: number
  _intervalId: NodeJS.Timeout | undefined = undefined

  _periodValues: number[] = []
  _currentPeriodKeystrokes = 0
  _velocity = 0
  _multiplier = 0

  getMultipler() {
    return this._multiplier
  }

  constructor(periods: number = 6, msPerPeriod: number = 10000) {
    this._periods = periods
    this._msPerPeriod = msPerPeriod
  }

  onKeyPress() {
    this._currentPeriodKeystrokes++
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
