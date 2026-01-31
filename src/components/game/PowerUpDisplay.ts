import * as PIXI from 'pixi.js'

export class PowerUpDisplay {
  private container: PIXI.Container
  private nameText: PIXI.Text
  private timerText: PIXI.Text
  private isActive: boolean = false
  private endTime: number = 0

  constructor(x: number, y: number, stage: PIXI.Container) {
    this.container = new PIXI.Container()
    this.container.x = x
    this.container.y = y
    this.container.visible = false // Hidden by default

    // Power up name text
    this.nameText = new PIXI.Text({
      text: '',
      style: {
        fontSize: 16,
        fill: 0xffaa00,
        fontWeight: 'bold'
      }
    })
    this.nameText.x = 0
    this.nameText.y = 0

    // Timer text
    this.timerText = new PIXI.Text({
      text: '',
      style: {
        fontSize: 14,
        fill: 0xffffff
      }
    })
    this.timerText.x = 0
    this.timerText.y = 20

    this.container.addChild(this.nameText)
    this.container.addChild(this.timerText)
    stage.addChild(this.container)
  }

  /**
   * Activate a power up display
   * @param name - Display name of the power up
   * @param duration - Duration in milliseconds
   */
  activate(name: string, duration: number): void {
    this.endTime = Date.now() + duration
    this.isActive = true
    this.container.visible = true
    this.nameText.text = name
    this.update()
  }

  /**
   * Update the timer display
   */
  update(): void {
    if (!this.isActive) return

    const remainingMs = this.endTime - Date.now()
    
    if (remainingMs <= 0) {
      this.deactivate()
      return
    }

    const seconds = Math.ceil(remainingMs / 1000)
    this.timerText.text = `${seconds}s`
  }

  /**
   * Deactivate and hide the power up display
   */
  private deactivate(): void {
    this.isActive = false
    this.container.visible = false
    this.nameText.text = ''
    this.timerText.text = ''
  }

  /**
   * Public method to hide/reset the display
   */
  hide(): void {
    this.deactivate()
  }

  /**
   * Check if a power up is currently active
   */
  get active(): boolean {
    return this.isActive
  }

  destroy(): void {
    this.container.destroy({ children: true })
  }
}
