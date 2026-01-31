import * as PIXI from 'pixi.js'

export class Bomb {
  private text: PIXI.Text
  public x: number
  public y: number
  private _hit: boolean = false
  private fallSpeed: number = 0
  private gravity: number = 0.3
  private maxFallSpeed: number = 5
  private readonly screenHeight: number

  constructor(x: number, y: number, stage: PIXI.Container, screenHeight: number) {
    this.x = x
    this.y = y
    this.screenHeight = screenHeight
    
    // Use bomb emoji
    this.text = new PIXI.Text({
      text: '💣',
      style: {
        fontSize: 30,
      }
    })
    this.text.anchor.set(0.5, 0.5)
    this.text.x = x
    this.text.y = y
    stage.addChild(this.text)
  }

  /**
   * Set difficulty by adjusting gravity and max fall speed
   */
  setDifficulty(gravity: number, maxFallSpeed: number): void {
    this.gravity = gravity
    this.maxFallSpeed = maxFallSpeed
  }

  get hit(): boolean {
    return this._hit
  }

  /**
   * Update bomb position (falling behavior)
   */
  update(): void {
    // Continue falling even when hit so it can respawn
    this.fallSpeed += this.gravity
    if (this.fallSpeed > this.maxFallSpeed) {
      this.fallSpeed = this.maxFallSpeed
    }

    this.y += this.fallSpeed
    this.text.y = this.y
  }

  /**
   * Check if the bomb has fallen off screen
   */
  isOffScreen(): boolean {
    return this.y > this.screenHeight + 50
  }

  /**
   * Check collision with sprite
   */
  checkCollision(sprite: PIXI.AnimatedSprite, collisionRadius: number = 40): boolean {
    if (this._hit) return false
    
    // Account for sprite anchor being at bottom (0.5, 1.0)
    const spriteHeight = sprite.height
    const spriteCenterY = sprite.y - spriteHeight / 2
    
    const distance = Math.sqrt(
      Math.pow(sprite.x - this.x, 2) + 
      Math.pow(spriteCenterY - this.y, 2)
    )
    
    if (distance < collisionRadius) {
      this.explode()
      return true
    }
    return false
  }

  /**
   * Mark bomb as hit and hide it
   */
  private explode(): void {
    this._hit = true
    this.text.visible = false
  }

  /**
   * Reset bomb to top of screen at a random X position
   */
  reset(newX: number, newY: number = -30): void {
    this.x = newX
    this.y = newY
    this.fallSpeed = 0
    this._hit = false
    this.text.visible = true
    this.text.x = this.x
    this.text.y = this.y
  }

  destroy(): void {
    this.text.destroy()
  }
}
