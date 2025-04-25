export class Xp {
  private _periods: number
  private _msPerPeriod: number
  private _intervalId: NodeJS.Timeout | undefined = undefined

  private _periodValues: number[] = []
  private _currentPeriodKeystrokes = 0
  private _velocity = 0
  private _multiplier = 0

  getMultiplier(): number {
    return this._multiplier
  }

  constructor(periods = 6, msPerPeriod = 10000) {
    this._periods = periods
    this._msPerPeriod = msPerPeriod
  }

  onKeyPress(): void {
    this._currentPeriodKeystrokes++
  }

  startWatch(): void {
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

  endWatch(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId)
    }
  }
}
