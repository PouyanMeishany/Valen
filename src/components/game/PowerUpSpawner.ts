import * as PIXI from 'pixi.js'
import { PowerUp } from './PowerUp'
import { SpeedBoost } from './SpeedBoost'

interface PowerUpConfig {
  type: 'speed_boost' // Can add more types later
  spawnInterval: number // Time in milliseconds between spawns
  lastSpawnTime: number
}

export class PowerUpSpawner {
  private configs: PowerUpConfig[] = []
  private activePowerUps: PowerUp[] = []
  private stage: PIXI.Container
  private screenHeight: number
  private leftBoundary: number
  private rightBoundary: number

  constructor(
    stage: PIXI.Container,
    screenHeight: number,
    leftBoundary: number,
    rightBoundary: number
  ) {
    this.stage = stage
    this.screenHeight = screenHeight
    this.leftBoundary = leftBoundary
    this.rightBoundary = rightBoundary
  }

  /**
   * Add a powerup type to spawn on a timer
   * @param type - Type of powerup
   * @param spawnInterval - Time in milliseconds between spawns
   */
  addPowerUpType(type: 'speed_boost', spawnInterval: number): void {
    console.log(`[PowerUpSpawner] Added ${type} with spawn interval: ${spawnInterval}ms (${spawnInterval / 1000}s)`)
    this.configs.push({
      type,
      spawnInterval,
      lastSpawnTime: Date.now() // Start timer immediately
    })
  }

  /**
   * Update spawner - checks if it's time to spawn new powerups
   */
  update(): void {
    const currentTime = Date.now()

    this.configs.forEach(config => {
      const timeSinceLastSpawn = currentTime - config.lastSpawnTime

      if (timeSinceLastSpawn >= config.spawnInterval) {
        console.log(`[PowerUpSpawner] Spawning ${config.type} (${(timeSinceLastSpawn / 1000).toFixed(1)}s since last spawn)`)
        this.spawnPowerUp(config.type)
        config.lastSpawnTime = currentTime
      }
    })

    // Update all active powerups
    this.activePowerUps.forEach(powerup => {
      powerup.update()

      // Remove if off screen
      if (powerup.isOffScreen()) {
        this.removePowerUp(powerup)
      }
    })
  }

  /**
   * Spawn a new powerup
   */
  private spawnPowerUp(type: 'speed_boost'): void {
    const randomX = this.leftBoundary + Math.random() * (this.rightBoundary - this.leftBoundary)
    const startY = -30

    let powerup: PowerUp

    switch (type) {
      case 'speed_boost':
        powerup = new SpeedBoost(randomX, startY, this.stage, this.screenHeight)
        console.log(`[PowerUpSpawner] ⚡ Speed Boost spawned at x=${Math.round(randomX)}`)
        break
      default:
        return
    }

    this.activePowerUps.push(powerup)
    console.log(`[PowerUpSpawner] Active powerups: ${this.activePowerUps.length}`)
  }

  /**
   * Remove and destroy a powerup
   */
  private removePowerUp(powerup: PowerUp): void {
    const index = this.activePowerUps.indexOf(powerup)
    if (index > -1) {
      this.activePowerUps.splice(index, 1)
      powerup.destroy()
      console.log(`[PowerUpSpawner] Powerup removed (off screen). Active powerups: ${this.activePowerUps.length}`)
    }
  }

  /**
   * Get all active powerups
   */
  getPowerUps(): PowerUp[] {
    return this.activePowerUps
  }

  /**
   * Reset spawner - clear all active powerups and reset spawn timers
   */
  reset(): void {
    // Remove all active powerups
    this.activePowerUps.forEach(powerup => powerup.destroy())
    this.activePowerUps = []
    
    // Reset spawn timers for all configured types
    this.configs.forEach(config => {
      config.lastSpawnTime = Date.now()
    })
    
    console.log('[PowerUpSpawner] Reset complete - all powerups cleared')
  }

  /**
   * Clean up all powerups
   */
  destroy(): void {
    this.activePowerUps.forEach(powerup => powerup.destroy())
    this.activePowerUps = []
    this.configs = []
  }
}
