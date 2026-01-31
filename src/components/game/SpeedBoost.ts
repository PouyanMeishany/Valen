import * as PIXI from 'pixi.js'
import { PowerUp } from './PowerUp'
import { GameCharacter } from './GameCharacter'

export class SpeedBoost extends PowerUp {
  private readonly speedMultiplier: number = 2 // Double the speed
  private readonly duration: number = 10000 // 10 seconds

  constructor(x: number, y: number, stage: PIXI.Container, screenHeight: number) {
    super(x, y, stage, screenHeight, '⚡', 'speed_boost')
  }

  /**
   * Apply speed boost effect to character
   */
  applyEffect(character: GameCharacter): void {
    character.applySpeedBoost(this.speedMultiplier, this.duration)
  }

  /**
   * Get the duration of the speed boost effect
   */
  getDuration(): number {
    return this.duration
  }
}
