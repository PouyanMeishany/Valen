import * as PIXI from 'pixi.js'

export interface Animation {
  name: string
  sheet: string
  framewidth: number
  frameheight: number
  row: number
  startFrame: number
  frameCount: number
  speed: number
  loop: boolean
  scale?: number
}

export class AnimationManager {
  private sprite: PIXI.AnimatedSprite
  private animationFrames: Map<string, PIXI.Texture[]>
  private animationConfig: Map<string, Animation>
  private currentAnimationName: string
  private defaultScale: number

  constructor(sprite: PIXI.AnimatedSprite, defaultAnimation: string, defaultScale: number) {
    this.sprite = sprite
    this.currentAnimationName = defaultAnimation
    this.defaultScale = defaultScale
    this.animationFrames = new Map()
    this.animationConfig = new Map()
  }

  /**
   * Load all animation sprite sheets and create frames
   */
  async loadAnimations(animations: Animation[]): Promise<void> {
    for (const anim of animations) {
      try {
        const texture = await PIXI.Assets.load(anim.sheet)
        const frames: PIXI.Texture[] = []
        
        for (let i = 0; i < anim.frameCount; i++) {
          const frame = new PIXI.Texture({
            source: texture.source,
            frame: new PIXI.Rectangle(
              (anim.startFrame + i) * anim.framewidth,
              anim.row * anim.frameheight,
              anim.framewidth,
              anim.frameheight
            )
          })
          frames.push(frame)
        }
        
        this.animationFrames.set(anim.name, frames)
        this.animationConfig.set(anim.name, anim)
      } catch (error) {
        console.error(`Failed to load sprite sheet for animation "${anim.name}":`, anim.sheet, error)
      }
    }
  }

  /**
   * Get frames for a specific animation
   */
  getFrames(animationName: string): PIXI.Texture[] | undefined {
    return this.animationFrames.get(animationName)
  }

  /**
   * Get the first available animation frames
   */
  getDefaultFrames(): PIXI.Texture[] {
    return this.animationFrames.values().next().value || []
  }

  /**
   * Play a specific animation
   * @param animName - Name of the animation to play
   * @param forceLoop - Force the animation to loop regardless of config
   * @param onCompleteCallback - Callback to execute when animation completes
   */
  play(animName: string, forceLoop = false, onCompleteCallback?: () => void): void {
    const frames = this.animationFrames.get(animName)
    if (!frames) {
      console.warn(`Animation "${animName}" not found`)
      return
    }

    const anim = this.animationConfig.get(animName)
    if (!anim) return

    // Store current position and scale direction
    const currentX = this.sprite.x
    const currentY = this.sprite.y
    const currentScaleX = this.sprite.scale.x
    const scaleDirection = currentScaleX >= 0 ? 1 : -1
    
    this.sprite.textures = frames
    this.sprite.loop = forceLoop || anim.loop
    this.sprite.animationSpeed = anim.speed
    
    // Apply animation-specific scale or default
    const animScale = anim.scale !== undefined ? anim.scale : this.defaultScale
    this.sprite.scale.x = animScale * scaleDirection
    this.sprite.scale.y = animScale
    
    // Clear existing onComplete handler
    this.sprite.onComplete = undefined
    
    // Set up completion callback
    if (onCompleteCallback && !this.sprite.loop) {
      this.sprite.onComplete = () => {
        onCompleteCallback()
        this.sprite.onComplete = undefined
      }
    }
    
    this.sprite.gotoAndPlay(0)
    
    // Restore position
    this.sprite.x = currentX
    this.sprite.y = currentY
    
    this.currentAnimationName = animName
  }

  /**
   * Get the currently playing animation name
   */
  getCurrentAnimation(): string {
    return this.currentAnimationName
  }

  /**
   * Flip sprite direction
   * @param facingRight - true to face right, false to face left
   */
  setDirection(facingRight: boolean): void {
    const absScale = Math.abs(this.sprite.scale.x)
    this.sprite.scale.x = facingRight ? -absScale : absScale
  }
}
