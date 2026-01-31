import * as PIXI from 'pixi.js'

export class HealthBar {
  private container: PIXI.Container
  private hearts: PIXI.Graphics[] = []
  private maxHealth: number
  private currentHealth: number

  constructor(maxHealth: number, stage: PIXI.Container, x: number = 20, y: number = 60) {
    this.maxHealth = maxHealth
    this.currentHealth = maxHealth
    
    this.container = new PIXI.Container()
    this.container.x = x
    this.container.y = y
    stage.addChild(this.container)
    
    // Create hearts
    for (let i = 0; i < maxHealth; i++) {
      const heart = this.drawMinecraftHeart(i * 25, 0)
      this.hearts.push(heart)
      this.container.addChild(heart)
    }
  }

  /**
   * Draw a Minecraft-style pixelated heart
   */
  private drawMinecraftHeart(x: number, y: number): PIXI.Graphics {
    const heart = new PIXI.Graphics()
    const pixelSize = 2
    
    // Minecraft heart pattern (8x7)
    const pattern = [
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 2, 2, 1, 1, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ]

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] > 0) {
          const px = x + col * pixelSize
          const py = y + row * pixelSize
          
          // 1 = dark red border, 2 = bright red fill
          const color = pattern[row][col] === 1 ? 0x990000 : 0xff0000
          
          heart.rect(px, py, pixelSize, pixelSize)
          heart.fill(color)
        }
      }
    }
    
    return heart
  }

  /**
   * Draw a grey/empty heart (when health is lost)
   */
  private drawEmptyHeart(x: number, y: number): PIXI.Graphics {
    const heart = new PIXI.Graphics()
    const pixelSize = 2
    
    // Same pattern but grey
    const pattern = [
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 2, 2, 1, 1, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ]

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] > 0) {
          const px = x + col * pixelSize
          const py = y + row * pixelSize
          
          // Grey colors for empty hearts
          const color = pattern[row][col] === 1 ? 0x555555 : 0x888888
          
          heart.rect(px, py, pixelSize, pixelSize)
          heart.fill(color)
        }
      }
    }
    
    return heart
  }

  /**
   * Decrease health by 1
   */
  takeDamage(): void {
    if (this.currentHealth > 0) {
      this.currentHealth--
      this.updateDisplay()
    }
  }

  /**
   * Heal by specified amount (defaults to full heal)
   */
  heal(amount?: number): void {
    console.log('[HealthBar] heal() called - before:', this.currentHealth, 'maxHealth:', this.maxHealth, 'amount:', amount)
    if (amount === undefined) {
      this.currentHealth = this.maxHealth
    } else {
      this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth)
    }
    console.log('[HealthBar] heal() called - after:', this.currentHealth, 'isDead:', this.isDead())
    this.updateDisplay()
  }

  /**
   * Update the heart display based on current health
   */
  private updateDisplay(): void {
    // Remove old hearts
    this.hearts.forEach(heart => heart.destroy())
    this.hearts = []
    
    // Redraw hearts (red for health, grey for lost health)
    for (let i = 0; i < this.maxHealth; i++) {
      const heart = i < this.currentHealth 
        ? this.drawMinecraftHeart(i * 25, 0)
        : this.drawEmptyHeart(i * 25, 0)
      this.hearts.push(heart)
      this.container.addChild(heart)
    }
  }

  /**
   * Get current health
   */
  getHealth(): number {
    return this.currentHealth
  }

  /**
   * Check if character is dead
   */
  isDead(): boolean {
    const dead = this.currentHealth <= 0
    if (dead) {
      console.log('[HealthBar] isDead() returning true - currentHealth:', this.currentHealth)
    }
    return dead
  }

  destroy(): void {
    this.hearts.forEach(heart => heart.destroy())
    this.container.destroy()
  }
}
