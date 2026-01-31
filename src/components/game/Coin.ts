import * as PIXI from 'pixi.js'

export class Coin {
  private graphics: PIXI.Graphics
  public x: number
  public y: number
  private _collected: boolean = false
  private fallSpeed: number = 0
  private gravity: number = 0.3
  private maxFallSpeed: number = 5
  private readonly screenHeight: number

  constructor(x: number, y: number, stage: PIXI.Container, screenHeight: number) {
    this.x = x
    this.y = y
    this.screenHeight = screenHeight
    
    this.graphics = new PIXI.Graphics()
    this.drawPixelatedHeart()
    this.graphics.x = x
    this.graphics.y = y
    stage.addChild(this.graphics)
  }

  /**
   * Set difficulty by adjusting gravity and max fall speed
   */
  setDifficulty(gravity: number, maxFallSpeed: number): void {
    this.gravity = gravity
    this.maxFallSpeed = maxFallSpeed
  }

  /**
   * Draw a pixelated heart shape for 8-bit aesthetic
   */
  private drawPixelatedHeart(): void {
    const pixelSize = 3 // Size of each "pixel" block
    const scale = 1.5 // Overall scale of the heart
    
    // 8-bit heart pattern (1 = filled, 0 = empty)
    // Each row represents pixels from left to right
    const heartPattern = [
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]

    // Center the heart
    const offsetX = -(heartPattern[0].length * pixelSize * scale) / 2
    const offsetY = -(heartPattern.length * pixelSize * scale) / 2

    // Draw the heart pixel by pixel
    for (let row = 0; row < heartPattern.length; row++) {
      for (let col = 0; col < heartPattern[row].length; col++) {
        if (heartPattern[row][col] === 1) {
          const x = offsetX + col * pixelSize * scale
          const y = offsetY + row * pixelSize * scale
          
          // Main red color with slight variation for texture
          const baseColor = 0xff0033 // Bright red
          const darkRed = 0xcc0022    // Darker red for shading
          
          // Add some texture variation (checkerboard-like pattern)
          const isDark = (row + col) % 2 === 0
          const color = isDark ? darkRed : baseColor
          
          this.graphics.rect(x, y, pixelSize * scale, pixelSize * scale)
          this.graphics.fill(color)
        }
      }
    }
  }

  get collected(): boolean {
    return this._collected
  }

  /**
   * Update heart position (falling behavior)
   */
  update(): void {
    // Continue falling even when collected so it can respawn
    // Apply gravity
    this.fallSpeed += this.gravity
    if (this.fallSpeed > this.maxFallSpeed) {
      this.fallSpeed = this.maxFallSpeed
    }

    this.y += this.fallSpeed
    this.graphics.y = this.y
  }

  /**
   * Check if the heart has fallen off screen
   */
  isOffScreen(): boolean {
    return this.y > this.screenHeight + 50
  }

  /**
   * Reset heart to top of screen at a random X position
   */
  reset(newX: number): void {
    this.x = newX
    this.y = -30
    this.fallSpeed = 0
    this._collected = false
    this.graphics.visible = true
    this.graphics.x = this.x
    this.graphics.y = this.y
  }

  /**
   * Check if the sprite is close enough to collect this coin
   * @param sprite - The sprite to check distance with
   * @param collectionRadius - How close the sprite needs to be
   * @returns true if coin was just collected
   */
  checkCollection(sprite: PIXI.AnimatedSprite, collectionRadius: number = 40): boolean {
    if (this._collected) return false
    
    // Account for sprite anchor being at bottom (0.5, 1.0)
    // Calculate the sprite's visual center position
    const spriteHeight = sprite.height
    const spriteCenterY = sprite.y - spriteHeight / 2 // Move up from feet to center
    
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

  private collect(): void {
    this._collected = true
    this.graphics.visible = false
  }

  destroy(): void {
    this.graphics.destroy()
  }
}
