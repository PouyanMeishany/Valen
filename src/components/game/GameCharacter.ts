import * as PIXI from 'pixi.js'
import { Platform } from './Platform'

export class GameCharacter {
  public sprite: PIXI.AnimatedSprite
  private velocityY: number = 0
  private isJumping: boolean = false
  private isAttacking: boolean = false
  
  // Physics constants
  private readonly gravity: number = 0.5
  private readonly jumpStrength: number = -15
  private readonly baseMoveSpeed: number = 3
  private currentMoveSpeed: number = 3
  private speedBoostActive: boolean = false
  private speedBoostTimeout?: ReturnType<typeof setTimeout>
  
  // Boundaries
  private readonly leftBoundary: number
  private readonly rightBoundary: number
  private readonly groundLevel: number
  
  // Input tracking
  private pressedKeys: Set<string> = new Set()
  
  constructor(
    sprite: PIXI.AnimatedSprite,
    groundLevel: number,
    leftBoundary: number,
    rightBoundary: number
  ) {
    this.sprite = sprite
    this.groundLevel = groundLevel
    this.leftBoundary = leftBoundary
    this.rightBoundary = rightBoundary
    
    // Position sprite on ground
    this.sprite.y = groundLevel
  }

  /**
   * Add a pressed key to the tracking set
   */
  addKey(key: string): void {
    this.pressedKeys.add(key)
  }

  /**
   * Remove a key from the tracking set
   */
  removeKey(key: string): void {
    this.pressedKeys.delete(key)
  }

  /**
   * Check if a key is currently pressed
   */
  hasKey(key: string): boolean {
    return this.pressedKeys.has(key)
  }

  /**
   * Attempt to make the character jump
   * @returns true if jump was initiated, false if already jumping
   */
  jump(): boolean {
    if (this.isJumping) return false
    
    this.isJumping = true
    this.velocityY = this.jumpStrength
    
    setTimeout(() => {
      this.isJumping = false
    }, 1000)
    
    return true
  }

  /**
   * Attempt to make the character attack
   * @returns true if attack was initiated, false if already attacking
   */
  attack(): boolean {
    if (this.isAttacking) return false
    
    this.isAttacking = true
    
    setTimeout(() => {
      this.isAttacking = false
    }, 500)
    
    return true
  }

  /**
   * Check if character is currently moving
   */
  isMoving(): boolean {
    return this.pressedKeys.has('arrowright') || 
           this.pressedKeys.has('d') || 
           this.pressedKeys.has('arrowleft') || 
           this.pressedKeys.has('a') || 
           this.pressedKeys.has('2')
  }

  /**
   * Apply speed boost powerup
   * @param multiplier - Speed multiplier (e.g., 2 = double speed)
   * @param duration - Duration in milliseconds
   */
  applySpeedBoost(multiplier: number, duration: number): void {
    // Always allow - this resets the timer if already active
    this.speedBoostActive = true
    this.currentMoveSpeed = this.baseMoveSpeed * multiplier
    
    // Clear any existing timeout
    if (this.speedBoostTimeout) {
      clearTimeout(this.speedBoostTimeout)
    }
    
    // Set new timeout
    this.speedBoostTimeout = setTimeout(() => {
      this.currentMoveSpeed = this.baseMoveSpeed
      this.speedBoostActive = false
      this.speedBoostTimeout = undefined
    }, duration)
  }

  /**
   * Set base movement speed (for difficulty scaling)
   */
  setBaseSpeed(speed: number): void {
    // @ts-ignore - Allow modifying readonly for difficulty scaling
    this.baseMoveSpeed = speed
    // Update current speed if no speed boost is active
    if (!this.speedBoostActive) {
      this.currentMoveSpeed = speed
    }
  }

  /**
   * Check if speed boost is currently active
   */
  hasSpeedBoost(): boolean {
    return this.speedBoostActive
  }

  /**
   * Update character physics and position
   * @param platforms - Array of platforms to check collision with
   */
  update(platforms: Platform[]): void {
    // Apply gravity
    this.velocityY += this.gravity
    this.sprite.y += this.velocityY

    // Check platform collisions
    for (const platform of platforms) {
      if (platform.checkCollision(this.sprite, this.velocityY)) {
        this.sprite.y = platform.y
        this.velocityY = 0
        break
      }
    }

    // Floor collision
    if (this.sprite.y > this.groundLevel) {
      this.sprite.y = this.groundLevel
      this.velocityY = 0
    }

    // Horizontal movement - right
    if (this.pressedKeys.has('arrowright') || this.pressedKeys.has('d') || this.pressedKeys.has('2')) {
      if (this.sprite.x < this.rightBoundary) {
        this.sprite.x += this.currentMoveSpeed
      }
    }
    
    // Horizontal movement - left
    if (this.pressedKeys.has('arrowleft') || this.pressedKeys.has('a')) {
      if (this.sprite.x > this.leftBoundary) {
        this.sprite.x -= this.currentMoveSpeed
      }
    }
  }

  /**
   * Get the pressed keys set (read-only access)
   */
  getPressedKeys(): ReadonlySet<string> {
    return this.pressedKeys
  }
}
