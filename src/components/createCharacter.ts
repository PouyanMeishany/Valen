import * as PIXI from "pixi.js"
import type { CharacterConfig } from "./types"

/**
 * Factory function to create a modular character with rubber arm
 * This makes it easy to swap out the character or add multiple characters
 */
export function createCharacter(config: CharacterConfig, stage: PIXI.Container) {
  // Create body
  const body = new PIXI.Graphics()
    .roundRect(
      -config.body.width / 2,
      -config.body.height / 2,
      config.body.width,
      config.body.height,
      20
    )
    .fill(config.body.color)
  
  body.x = config.body.x
  body.y = config.body.y
  stage.addChild(body)

  // Create shoulder joint
  const shoulder = new PIXI.Container()
  shoulder.x = config.arm.shoulderOffset.x
  shoulder.y = config.arm.shoulderOffset.y
  body.addChild(shoulder)

  // Create upper arm
  const upperArm = new PIXI.Graphics()
    .roundRect(0, -10, config.arm.upperArmLength, 20, 10)
    .fill(config.arm.colors.upperArm)
  shoulder.addChild(upperArm)

  // Create forearm
  const forearm = new PIXI.Graphics()
    .roundRect(0, -8, config.arm.forearmLength, 16, 8)
    .fill(config.arm.colors.forearm)
  forearm.x = config.arm.upperArmLength
  upperArm.addChild(forearm)

  // Create hand
  const hand = new PIXI.Graphics()
    .circle(config.arm.forearmLength, 0, config.arm.handRadius)
    .fill(config.arm.colors.hand)
  forearm.addChild(hand)

  return {
    body,
    shoulder,
    upperArm,
    forearm,
    hand,
    config,
  }
}

/**
 * Animation controller for the rubber arm effect
 */
export class RubberArmController {
  private currentRotation = 0
  private currentStretch = 1
  private config: CharacterConfig
  private shoulder: PIXI.Container
  private upperArm: PIXI.Graphics
  public mouse = { x: 400, y: 300 }

  constructor(character: ReturnType<typeof createCharacter>) {
    this.config = character.config
    this.shoulder = character.shoulder
    this.upperArm = character.upperArm
    this.mouse.x = character.body.x
    this.mouse.y = character.body.y
  }

  /**
   * Update arm position and rotation to follow target
   */
  update() {
    const shoulderGlobal = this.shoulder.getGlobalPosition()
    const dx = this.mouse.x - shoulderGlobal.x
    const dy = this.mouse.y - shoulderGlobal.y
    
    const targetRotation = Math.atan2(dy, dx)
    const distance = Math.sqrt(dx * dx + dy * dy)
    const targetStretch = Math.min(
      distance / this.config.animation.baseLength,
      this.config.animation.maxStretch
    )

    // Smooth easing
    this.currentRotation +=
      (targetRotation - this.currentRotation) * this.config.animation.easing
    this.currentStretch +=
      (targetStretch - this.currentStretch) * this.config.animation.easing

    this.shoulder.rotation = this.currentRotation
    this.upperArm.scale.x = this.currentStretch
  }

  /**
   * Set target position for the arm to reach
   */
  setTarget(x: number, y: number) {
    this.mouse.x = x
    this.mouse.y = y
  }
}
