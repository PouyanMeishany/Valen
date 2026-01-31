import * as PIXI from 'pixi.js'
import type { GameCharacter } from './GameCharacter'

export type PowerUpType = 'speed_boost' // | 'jump_boost' | 'invincibility'

export abstract class PowerUp {
  protected text: PIXI.Text
  public x: number
  public y: number
  private _collected: boolean = false
  private _destroyed: boolean = false
  private fallSpeed: number = 0
  private readonly gravity: number = 0.25
  private readonly maxFallSpeed: number = 1
  private readonly screenHeight: number
  public readonly type: PowerUpType

  constructor(
    x: number, 
    y: number, 
    stage: PIXI.Container, 
    screenHeight: number,
    emoji: string,
    type: PowerUpType
  ) {
    this.x = x
    this.y = y
    this.screenHeight = screenHeight
    this.type = type
    
    this.text = new PIXI.Text({
      text: emoji,
      style: {
        fontSize: 35,
      }
    })
    this.text.anchor.set(0.5, 0.5)
    this.text.x = x
    this.text.y = y
    stage.addChild(this.text)
  }

  get collected(): boolean {
    return this._collected
  }

  /**
   * Update powerup position (falling behavior)
   */
  update(): void {
    // Don't update if collected, destroyed, or if text doesn't exist
    if (this._collected || this._destroyed || !this.text) return
    
    this.fallSpeed += this.gravity
    if (this.fallSpeed > this.maxFallSpeed) {
      this.fallSpeed = this.maxFallSpeed
    }

    this.y += this.fallSpeed
    this.text.y = this.y
  }

  /**
   * Check if the powerup has fallen off screen
   */
  isOffScreen(): boolean {
    return this.y > this.screenHeight + 50
  }

  /**
   * Check collision with sprite
   */
  checkCollection(sprite: PIXI.AnimatedSprite, collectionRadius: number = 40): boolean {
    if (this._collected || this._destroyed || !this.text) return false
    
    const spriteHeight = sprite.height
    const spriteCenterY = sprite.y - spriteHeight / 2
    
    const distance = Math.sqrt(
      Math.pow(sprite.x - this.x, 2) + 
      Math.pow(spriteCenterY - this.y, 2)
    )
    
    if (distance < collectionRadius) {
      this.collect()
      return true
    }
    return false
  }

  /**
   * Mark powerup as collected and hide it
   */
  private collect(): void {
    this._collected = true
    if (this.text) {
      this.text.visible = false
    }
  }

  /**
   * Reset powerup to top of screen at a random X position
   */
  reset(newX: number): void {
    if (this._destroyed || !this.text) return
    
    this.x = newX
    this.y = -30
    this.fallSpeed = 0
    this._collected = false
    this.text.visible = true
    this.text.x = this.x
    this.text.y = this.y
  }

  /**
   * Abstract method to apply powerup effect
   */
  abstract applyEffect(character: GameCharacter): void

  /**
   * Abstract method to get effect duration in milliseconds
   */
  abstract getDuration(): number

  destroy(): void {
    this._destroyed = true
    if (this.text) {
      this.text.destroy()
      this.text = null!
    }
  }
}
