import * as PIXI from 'pixi.js'

export class Platform {
  private graphics: PIXI.Graphics
  public readonly x: number
  public readonly y: number
  public readonly width: number
  public readonly height: number

  constructor(x: number, y: number, width: number, height: number, stage: PIXI.Container) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    
    this.graphics = new PIXI.Graphics()
    this.graphics.rect(x, y, width, height)
    this.graphics.fill(0xffffff)
    stage.addChild(this.graphics)
  }

  /**
   * Check if a sprite is colliding with this platform
   * @param sprite - The sprite to check collision with
   * @param velocityY - The sprite's vertical velocity
   * @returns true if collision detected
   */
  checkCollision(sprite: PIXI.AnimatedSprite, velocityY: number): boolean {
    const previousY = sprite.y - velocityY
    const spriteBuffer = 20 // Buffer for sprite width
    
    return (
      velocityY > 0 && // Falling down
      sprite.x + spriteBuffer > this.x &&
      sprite.x - spriteBuffer < this.x + this.width && 
      previousY <= this.y &&
      sprite.y >= this.y
    )
  }

  destroy(): void {
    this.graphics.destroy()
  }
}
