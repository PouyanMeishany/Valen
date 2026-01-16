import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"

interface Animation {
  name: string
  sheet: string // Name of the sprite sheet
  framewidth: number  // e.g., 56,
  frameheight: number
  row: number        // Which row in the sprite sheet (0-indexed)
  startFrame: number // Starting column (0-indexed)
  frameCount: number // How many frames in this animation
  speed: number      // Animation speed (0.1 = slow, 0.3 = fast)
  loop: boolean      // Should it loop?
  scale?: number     // Optional: Override character scale for this animation
}

interface MultiStateCharacterProps {
  width?: number
  height?: number
  backgroundColor?: number
  backgroundAlpha?: number  // 0 = fully transparent, 1 = fully opaque
  animations: Animation[] // Array of animation definitions
  defaultAnimation?: string
  scale?: number
}

export default function MultiStateCharacter({
  width = 800,
  height = 500,
  backgroundColor = 0x1e1e1e,
  backgroundAlpha = 1,
  animations,
  defaultAnimation = "idle",
  scale = 2,
}: MultiStateCharacterProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hostRef.current) return

    const initApp = async () => {
      const app = new PIXI.Application()
      
      await app.init({
        width,
        height,
        background: backgroundColor,
        backgroundAlpha: backgroundAlpha,
        antialias: true,
      })

      // Clear any existing canvas in the container first
      if (hostRef.current) {
        hostRef.current.innerHTML = ''
        hostRef.current.appendChild(app.canvas)
      }

      try {
        // Load all sprite sheets and create frames for each animation
        const animationFrames = new Map<string, PIXI.Texture[]>()
        const animationConfig = new Map<string, Animation>()
        
        // Load each animation's sprite sheet separately
        for (const anim of animations) {
          try {
            // Load the specific sprite sheet for this animation
            const texture = await PIXI.Assets.load(anim.sheet)
            const frames: PIXI.Texture[] = []
            
            // Build frames using this animation's specific frame dimensions
            for (let i = 0; i < anim.frameCount; i++) {
              const frame = new PIXI.Texture({
                source: texture.source,
                frame: new PIXI.Rectangle(
                  (anim.startFrame + i) * anim.framewidth,  // Use animation-specific width
                  anim.row * anim.frameheight,               // Use animation-specific height
                  anim.framewidth,
                  anim.frameheight
                )
              })
              frames.push(frame)
            }
            
            animationFrames.set(anim.name, frames)
            animationConfig.set(anim.name, anim)
          } catch (error) {
            console.error(`Failed to load sprite sheet for animation "${anim.name}":`, anim.sheet, error)
          }
        }

        // Create the animated sprite with default animation
        const defaultFrames = animationFrames.get(defaultAnimation) || animationFrames.values().next().value
        
        if (!defaultFrames || defaultFrames.length === 0) {
          throw new Error('No animation frames found')
        }
        
        const sprite = new PIXI.AnimatedSprite(defaultFrames)
        
        // Important: Keep anchor at bottom-center to prevent sliding
        // 0.5, 1.0 means center-horizontal, bottom-vertical
        sprite.anchor.set(0.5, 1.0)
        sprite.x = width / 2
        
        // Get the default animation's frame height for positioning
        const defaultAnimConfig = animationConfig.get(defaultAnimation)
        const defaultFrameHeight = defaultAnimConfig?.frameheight || 53
        sprite.y = height / 2 + (defaultFrameHeight * scale) / 2 // Adjust for bottom anchor
        
        sprite.scale.set(scale)
        sprite.loop = true
        sprite.animationSpeed = 0.15
        sprite.play()

        app.stage.addChild(sprite)

        // Track current animation and pressed keys
        let currentAnimationName = defaultAnimation
        const pressedKeys = new Set<string>()
        let isJumping = false // Track if character is currently jumping
        let isAttacking = false // Track if character is currently attacking
        
        // Movement settings
        const moveSpeed = 3 // Pixels per frame
        const leftBoundary = 50 // Don't go past left edge
        const rightBoundary = width - 50 // Don't go past right edge

        // Physics settings
        let velocityY = 0 // Vertical velocity for gravity
        const gravity = 0.5 // Gravity acceleration
        const jumpStrength = -15 // Jump velocity (negative = up) - increase for higher jumps
        const groundLevel = height - 50 // Floor level

        // Coin collection
        let coinsCollected = 0

        // Create platforms (thick white lines)
        const platforms: { x: number; y: number; width: number; height: number; graphics: PIXI.Graphics }[] = []
        
        // Ground platform
        const groundPlatform = new PIXI.Graphics()
        groundPlatform.rect(0, groundLevel, width, 10)
        groundPlatform.fill(0xffffff)
        app.stage.addChild(groundPlatform)
        platforms.push({ x: 0, y: groundLevel, width, height: 10, graphics: groundPlatform })

        // Add floating platforms
        const platformData = [
          { x: 150, y: height - 150, width: 200 },
          { x: 450, y: height - 250, width: 250 },
          { x: 800, y: height - 200, width: 200 },
          { x: width - 350, y: height - 180, width: 220 },
        ]

        platformData.forEach(data => {
          const platform = new PIXI.Graphics()
          platform.rect(data.x, data.y, data.width, 10)
          platform.fill(0xffffff)
          app.stage.addChild(platform)
          platforms.push({ x: data.x, y: data.y, width: data.width, height: 10, graphics: platform })
        })

        // Create coins (yellow circles)
        const coins: { x: number; y: number; graphics: PIXI.Graphics; collected: boolean }[] = []
        
        const coinPositions = [
          { x: 250, y: height - 200 },
          { x: 550, y: height - 300 },
          { x: 650, y: height - 300 },
          { x: 900, y: height - 250 },
          { x: width - 250, y: height - 230 },
          { x: 400, y: height - 100 },
        ]

        coinPositions.forEach(pos => {
          const coin = new PIXI.Graphics()
          coin.circle(0, 0, 15)
          coin.fill(0xffd700) // Gold color
          coin.x = pos.x
          coin.y = pos.y
          app.stage.addChild(coin)
          coins.push({ x: pos.x, y: pos.y, graphics: coin, collected: false })
        })

        // Score text
        const scoreText = new PIXI.Text({
          text: `Coins: ${coinsCollected}/${coins.length}`,
          style: {
            fontSize: 24,
            fill: 0xffd700,
            fontWeight: 'bold'
          }
        })
        scoreText.x = 20
        scoreText.y = 20
        app.stage.addChild(scoreText)

        // Function to change animation
        const playAnimation = (animName: string, forceLoop = false, onCompleteCallback?: () => void) => {
          const frames = animationFrames.get(animName)
          if (!frames) {
            console.warn(`Animation "${animName}" not found`)
            return
          }

          const anim = animationConfig.get(animName)
          if (!anim) return

          // Store current position and scale direction before changing animation
          const currentX = sprite.x
          const currentY = sprite.y
          const currentScaleX = sprite.scale.x
          const scaleDirection = currentScaleX >= 0 ? 1 : -1 // Preserve left/right facing
          
          sprite.textures = frames
          // Force loop if button is being held, otherwise use animation's loop setting
          sprite.loop = forceLoop || anim.loop
          sprite.animationSpeed = anim.speed
          
          // Apply animation-specific scale if provided, otherwise use default scale
          const animScale = anim.scale !== undefined ? anim.scale : scale
          sprite.scale.set(animScale * scaleDirection)
          
          // Clear any existing onComplete handler first
          sprite.onComplete = undefined
          
          // Set up completion callback BEFORE starting the animation
          if (onCompleteCallback && !sprite.loop) {
            console.log(`Setting up onComplete for "${animName}", loop=${sprite.loop}, frames=${frames.length}`)
            sprite.onComplete = () => {
              console.log(`Animation "${animName}" completed, firing callback`)
              onCompleteCallback()
              sprite.onComplete = undefined
            }
          } else {
            console.log(`Not setting onComplete for "${animName}": callback=${!!onCompleteCallback}, loop=${sprite.loop}`)
          }
          
          sprite.gotoAndPlay(0)
          
          // Restore position after animation change
          sprite.x = currentX
          sprite.y = currentY
          
          currentAnimationName = animName
        }

        // Handle key press
        const handleKeyDown = (e: KeyboardEvent) => {
          const key = e.key.toLowerCase()
          
          // Special handling for jump - don't use pressedKeys at all
          if (key === '3' || key === 'w') {
            if (isJumping) return // Block if already jumping
            
            isJumping = true
            velocityY = jumpStrength // Set upward velocity
            
            // Use timer-based cooldown instead of relying on animation completion
            setTimeout(() => {
              isJumping = false
            }, 1000) // 1 second cooldown
            
            // Jump plays once, then returns to run or idle
            playAnimation('jump', false, () => {
              // After jump completes, check if still moving
              const stillMoving = pressedKeys.has('arrowright') || pressedKeys.has('d') || 
                                 pressedKeys.has('arrowleft') || pressedKeys.has('a') || pressedKeys.has('2')
              if (stillMoving) {
                playAnimation('run', true) // Resume running
              } else {
                playAnimation('idle') // Go to idle if not moving
              }
            })
            return // Exit early, don't add to pressedKeys
          }
          
          // Special handling for attack - don't use pressedKeys at all
          if (key === '4' || key === 'l') {
            if (isAttacking) return // Block if already attacking
            
            isAttacking = true
            
            // Use timer-based cooldown instead of relying on animation completion
            setTimeout(() => {
              isAttacking = false
            }, 500) // 1 second cooldown
            
            // Check if character is currently moving
            const isMoving = pressedKeys.has('arrowright') || pressedKeys.has('d') || 
                            pressedKeys.has('arrowleft') || pressedKeys.has('a') || pressedKeys.has('2')
            
            // Check if moving - use running attack if moving, regular attack if stationary
            if (isMoving) {
              // Running attack plays once, then returns to run if still moving
              playAnimation('runningAttack', false, () => {
                // After running attack completes, check if still moving
                const stillMoving = pressedKeys.has('arrowright') || pressedKeys.has('d') || 
                                   pressedKeys.has('arrowleft') || pressedKeys.has('a') || pressedKeys.has('2')
                if (stillMoving) {
                  playAnimation('run', true) // Resume running
                } else {
                  playAnimation('idle') // Go to idle if stopped moving
                }
              })
            } else {
              // Standing attack plays once, then returns to idle
              playAnimation('attack', false, () => {
                playAnimation('idle')
              })
            }
            return // Exit early, don't add to pressedKeys
          }
          
          // Prevent repeat events when key is held
          if (pressedKeys.has(key)) return
          pressedKeys.add(key)

          // Check if character is currently moving
          const isMoving = pressedKeys.has('arrowright') || pressedKeys.has('d') || 
                          pressedKeys.has('arrowleft') || pressedKeys.has('a') || pressedKeys.has('2')

          switch(key) {
            case '1':
              playAnimation('idle')
              break
            case '2':
            case 'arrowright':
            case 'd':
              playAnimation('run', true) // Loop while held
              sprite.scale.x = -Math.abs(sprite.scale.x) // Face right
              break
            case 'arrowleft':
            case 'a':
              playAnimation('run', true) // Loop while held
              sprite.scale.x = Math.abs(sprite.scale.x) // Face left
              break
            case 'k': // K key for special animation
              // Play once and return to idle
                if(!isMoving){
                    playAnimation('blowup', false, () => {
                    playAnimation('idle')
                  })
                }
            break
          }
        }

        window.addEventListener('keydown', handleKeyDown)

        // Handle key release - return to idle when any action key is released
        const handleKeyUp = (e: KeyboardEvent) => {
          const key = e.key.toLowerCase()
          pressedKeys.delete(key)
          
          // Check if any movement keys are still pressed
          // Exclude jump ('3', 'w'), attack ('4', 'l'), and special ('k') since they auto-complete
          const movementKeys = ['arrowright', 'd', 'arrowleft', 'a', '2']
          const hasMovementKeyPressed = movementKeys.some(k => pressedKeys.has(k))
          
          // If no movement keys are pressed and not in a special animation, return to idle
          if (!hasMovementKeyPressed && 
              currentAnimationName !== 'idle' && 
              currentAnimationName !== 'blowup' && 
              currentAnimationName !== 'jump' &&
              currentAnimationName !== 'attack' &&
              currentAnimationName !== 'runningAttack') {
            playAnimation('idle')
          }
        }

        window.addEventListener('keyup', handleKeyUp)

        // Movement loop - update character position based on pressed keys
        app.ticker.add(() => {
          // Apply gravity
          velocityY += gravity
          sprite.y += velocityY

          // Check platform collisions
          let onGround = false
          
          for (const platform of platforms) {
            // Check if character is falling onto platform (with better collision detection)
            const previousY = sprite.y - velocityY // Where character was before gravity
            
            if (velocityY > 0 && // Falling down
                sprite.x + 20 > platform.x &&  // Add buffer for sprite width
                sprite.x - 20 < platform.x + platform.width && 
                previousY <= platform.y && // Was above platform
                sprite.y >= platform.y) {  // Now at or below platform
              
              sprite.y = platform.y // Land exactly on platform
              velocityY = 0
              onGround = true
              break
            }
          }

          // Prevent falling through floor
          if (sprite.y > groundLevel) {
            sprite.y = groundLevel
            velocityY = 0
            onGround = true
          }

          // Check coin collection
          coins.forEach(coin => {
            if (!coin.collected) {
              const distance = Math.sqrt(
                Math.pow(sprite.x - coin.x, 2) + 
                Math.pow(sprite.y - coin.y, 2)
              )
              
              if (distance < 40) { // Collection radius
                coin.collected = true
                coin.graphics.visible = false
                coinsCollected++
                scoreText.text = `Coins: ${coinsCollected}/${coins.length}`
              }
            }
          })

          // Horizontal movement
          // Move right
          if (pressedKeys.has('arrowright') || pressedKeys.has('d') || pressedKeys.has('2')) {
            if (sprite.x < rightBoundary) {
              sprite.x += moveSpeed
            }
          }
          
          // Move left
          if (pressedKeys.has('arrowleft') || pressedKeys.has('a')) {
            if (sprite.x > leftBoundary) {
              sprite.x -= moveSpeed
            }
          }
        })

        // Add instructions text
        // const instructions = new PIXI.Text({
        //   text: `Controls:\nL: Punch  Space: Jump  Arrow Keys/A/D: Run\n(Hold = Loop, Release = Idle)`,
        //   style: {
        //     fontSize: 16,
        //     fill: 0xffffff,
        //     align: 'center',
        //     fontFamily: 'Arial'
        //   }
        // })
        // instructions.anchor.set(0.5)
        // instructions.x = width / 2
        // instructions.y = 30
        // app.stage.addChild(instructions)

        // Optional: Auto-cycle through animations for demo
        // Uncomment to auto-cycle through animations:
        // app.ticker.add((delta) => {
        //   demoTime += delta.deltaTime
        //   if (demoTime > 180) { // Change animation every 3 seconds (180 frames)
        //     demoTime = 0
        //     demoIndex = (demoIndex + 1) % animations.length
        //     playAnimation(animations[demoIndex].name)
        //   }
        // })

        // Cleanup
        return () => {
          window.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('keyup', handleKeyUp)
          app.destroy(true, { children: true })
        }

      } catch (error) {
        console.error("Failed to load sprite sheet:", error)
        
        const errorText = new PIXI.Text({
          text: `Error loading sprite sheets.\nCheck console for details.`,
          style: {
            fontSize: 18,
            fill: 0xff6666,
            align: 'center'
          }
        })
        errorText.anchor.set(0.5)
        errorText.x = width / 2
        errorText.y = height / 2
        app.stage.addChild(errorText)
      }
    }

    initApp()
  }, [width, height, backgroundColor, animations, defaultAnimation, scale])

  return <div ref={hostRef} />
}
