/**
 * Game entities and managers for the Multi-State Character game
 * 
 * This module exports all game-related classes following OOP principles:
 * - Platform: Manages platform entities and collision detection
 * - Coin: Handles coin entities and collection logic
 * - Bomb: Handles bomb entities and damage logic
 * - PowerUp: Base class for powerup entities
 * - SpeedBoost: Speed increase powerup
 * - GameCharacter: Controls character physics, movement, and input
 * - ScoreDisplay: Manages score UI display
 * - HealthBar: Manages health UI with Minecraft-style hearts
 * - AnimationManager: Handles sprite animation loading and playback
 */

export { Platform } from './Platform'
export { Coin } from './Coin'
export { Bomb } from './Bomb'
export { PowerUp } from './PowerUp'
export type { PowerUpType } from './PowerUp'
export { SpeedBoost } from './SpeedBoost'
export { PowerUpSpawner } from './PowerUpSpawner'
export { GameCharacter } from './GameCharacter'
export { ScoreDisplay } from './ScoreDisplay'
export { HealthBar } from './HealthBar'
export { PowerUpDisplay } from './PowerUpDisplay'
export { GameOverScreen, type GameStats } from './GameOverScreen'
export { AnimationManager, type Animation } from './AnimationManager'
