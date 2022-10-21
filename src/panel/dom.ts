export class DOM {
  private _petImageSelector: string
  private _movementContainerSelector: string
  private _transitionContainerSelector: string
  private _transitionSelector: string

  private _movementContainerElement: HTMLElement | undefined
  private _petImageElement: HTMLImageElement | undefined
  private _transitionContainerElement: HTMLElement | undefined
  private _transitionImageElement: HTMLImageElement | undefined

  constructor({
    movementContainerSelector,
    petImageSelector,
    transitionContainerSelector,
    transitionSelector,
  }: {
    petImageSelector: string
    movementContainerSelector: string
    transitionContainerSelector: string
    transitionSelector: string
  }) {
    this._petImageSelector = petImageSelector
    this._movementContainerSelector = movementContainerSelector
    this._transitionContainerSelector = transitionContainerSelector
    this._transitionSelector = transitionSelector
  }

  protected getHTMLElement = <T>(elementName: string): T => {
    const htmlElement = document.getElementById(elementName) as unknown
    if (!htmlElement) {
      throw new Error(`Unable to locate element in DOM: ${elementName}`)
    }

    return htmlElement as T
  }

  getMovementSelector(): HTMLElement {
    if (!this._movementContainerElement) {
      this._movementContainerElement = this.getHTMLElement<HTMLElement>(
        this._movementContainerSelector
      )
    }
    return this._movementContainerElement
  }

  getPetImageSelector(): HTMLImageElement {
    if (!this._petImageElement) {
      this._petImageElement = this.getHTMLElement<HTMLImageElement>(
        this._petImageSelector
      )
    }
    return this._petImageElement
  }

  getTransitionSelector(): HTMLElement {
    if (!this._transitionContainerElement) {
      this._transitionContainerElement = this.getHTMLElement<HTMLElement>(
        this._transitionContainerSelector
      )
    }
    return this._transitionContainerElement
  }

  getTransitionImageSelector(): HTMLImageElement {
    if (!this._transitionImageElement) {
      this._transitionImageElement = this.getHTMLElement<HTMLImageElement>(
        this._transitionSelector
      )
    }
    return this._transitionImageElement
  }
}
