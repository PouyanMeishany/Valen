import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"
import { Platform } from "./game/Platform"
import { Coin } from "./game/Coin"
import { Bomb } from "./game/Bomb"
import { PowerUpSpawner } from "./game/PowerUpSpawner"
import { GameCharacter } from "./game/GameCharacter"
import { ScoreDisplay } from "./game/ScoreDisplay"
import { HealthBar } from "./game/HealthBar"
import { PowerUpDisplay } from "./game/PowerUpDisplay"
import { AnimationManager, type Animation } from "./game/AnimationManager"

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
  height = 5000,
  backgroundColor = 0x1e1e1e,
  backgroundAlpha = 1,
  animations,
  defaultAnimation = "idle",
  scale = 20,
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
        // Set canvas to allow pointer events to pass through when needed
        app.canvas.style.display = 'block'
        hostRef.current.appendChild(app.canvas)
      }

      try {
        // First, load all animations to get frames
        const tempAnimManager = new AnimationManager(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          null as any, // Temporary, will be replaced
          defaultAnimation, 
          scale
        )
        await tempAnimManager.loadAnimations(animations)
        
        // Get default animation frames
        const defaultFrames = tempAnimManager.getFrames(defaultAnimation) || tempAnimManager.getDefaultFrames()
        
        if (!defaultFrames || defaultFrames.length === 0) {
          throw new Error('No animation frames found')
        }
        
        // Now create the sprite with actual frames
        const sprite = new PIXI.AnimatedSprite(defaultFrames)
        
        // Setup sprite properties
        sprite.anchor.set(0.5, 1.0) // Bottom-center anchor
        sprite.x = width / 2
        sprite.scale.set(scale)
        sprite.loop = true
        sprite.animationSpeed = 0.15
        sprite.play()

        // Game configuration
        const groundLevel = height - 50
        const leftBoundary = 50
        const rightBoundary = width - 50
        
        sprite.y = groundLevel
        app.stage.addChild(sprite)

        // Create the actual animation manager with the real sprite
        const animManager = new AnimationManager(sprite, defaultAnimation, scale)
        await animManager.loadAnimations(animations)

        // Initialize game character
        const character = new GameCharacter(sprite, groundLevel, leftBoundary, rightBoundary)

        // Create platforms
        const platforms: Platform[] = []
        
        // Ground platform
        platforms.push(new Platform(0, groundLevel, width, 10, app.stage))

        // Floating platforms
        const platformData = [
          { x: 150, y: height - 150, width: 200 },
          { x: 450, y: height - 250, width: 250 },
          { x: 800, y: height - 200, width: 200 },
          { x: width - 350, y: height - 180, width: 220 },
        ]

        platformData.forEach(data => {
          platforms.push(new Platform(data.x, data.y, data.width, 10, app.stage))
        })

        // ============================================
        // DIFFICULTY SCALING CONFIGURATION
        // ============================================
        const difficultyConfig = {
          startGravity: 0.3,
          maxGravity: 0.8,
          startMaxSpeed: 5,
          maxMaxSpeed: 12,
          startHeartCount: 6,
          maxHeartCount: 15,
          startCharacterSpeed: 3,
          maxCharacterSpeed: 7,
          rampUpDuration: 120000, // 2 minutes to reach max difficulty
        }
        const gameStartTime = Date.now()
        let lastHeartCheckTime = Date.now()
        // ============================================

        // Create coins (hearts that fall from the top)
        const coins: Coin[] = []
        let currentHeartTarget = difficultyConfig.startHeartCount
        
        // Create hearts starting at the top with random X positions
        for (let i = 0; i < difficultyConfig.startHeartCount; i++) {
          const randomX = leftBoundary + Math.random() * (rightBoundary - leftBoundary)
          const startY = -30 - (i * 100) // Stagger the initial positions
          coins.push(new Coin(randomX, startY, app.stage, height))
        }

        // Create score display with high score
        const scoreDisplay = new ScoreDisplay(difficultyConfig.startHeartCount, app.stage, 20, 20, width)

        // Create health bar (10 hearts like Minecraft)
        const healthBar = new HealthBar(10, app.stage)

        // Create power up display (shown below health bar)
        const powerUpDisplay = new PowerUpDisplay(20, 90, app.stage)

        // ============================================
        // BOMB CONFIGURATION
        // Adjust bomb frequency here
        // ============================================
        const bombConfig = {
          count: 3,            // Number of bombs falling at once
          staggerDistance: 150 // Vertical spacing between bombs (smaller = more frequent)
        }
        // ============================================

        // Create bombs
        const bombs: Bomb[] = []
        
        // Create bombs starting at the top with random X positions
        for (let i = 0; i < bombConfig.count; i++) {
          const randomX = leftBoundary + Math.random() * (rightBoundary - leftBoundary)
          const startY = -30 - (i * bombConfig.staggerDistance)
          bombs.push(new Bomb(randomX, startY, app.stage, height))
        }

        // ============================================
        // POWERUP SPAWN CONFIGURATION
        // Adjust spawn intervals here (in milliseconds)
        // ============================================
        const powerUpSpawner = new PowerUpSpawner(app.stage, height, leftBoundary, rightBoundary)
        
        // Speed Boost: spawns every 30 seconds
        powerUpSpawner.addPowerUpType('speed_boost', 30000)
        
        // Add more powerup types here in the future:
        // powerUpSpawner.addPowerUpType('jump_boost', 45000)
        // powerUpSpawner.addPowerUpType('invincibility', 60000)
        // ============================================

        // Function to change animation
        const playAnimation = (animName: string, forceLoop = false, onCompleteCallback?: () => void) => {
          animManager.play(animName, forceLoop, onCompleteCallback)
        }

        // Track game state
        let isInvulnerable = false
        let isBlinking = false
        let blinkTimer = 0
        const blinkDuration = 1000 // 1 second of blinking
        const blinkSpeed = 100 // Switch every 100ms
        let objectsFrozen = false // New flag to freeze falling objects
        let deathSequencePlaying = false // Track if death animation sequence is playing

        // ============================================
        // DEATH ANIMATION SEQUENCE
        // Customize this sequence to create your own choreography!
        // ============================================
        const playDeathSequence = () => {
          if (deathSequencePlaying) return
          deathSequencePlaying = true
          
          console.log('[Death Sequence] Starting...')
          
          // Example sequence: Walk right, then blow up
          // You can customize this however you want!
          
          // Step 1: Face right and walk
          animManager.setDirection(true)
          playAnimation('run', true)
          
          // Step 2: Move character to the right over time
          const walkDuration = 2000 // 2 seconds
          const walkSpeed = 3
          const walkStartTime = Date.now()
          
          const walkInterval = setInterval(() => {
            if (Date.now() - walkStartTime >= walkDuration) {
              clearInterval(walkInterval)
              
              // Step 3: Stop and play blow up animation
              console.log('[Death Sequence] Playing blow up!')
              playAnimation('blowup', false, () => {
                console.log('[Death Sequence] Complete! Player regains control.')
                // Re-enable player control
                deathSequencePlaying = false
                // Return to idle animation
                playAnimation('idle', true)
              })
            } else {
              // Continue walking right
              if (sprite.x < width - 50) {
                sprite.x += walkSpeed
              }
            }
          }, 16) // ~60fps
    
        }
        // ============================================

        // Handle key press
        const handleKeyDown = (e: KeyboardEvent) => {
          // Block input during death sequence
          if (deathSequencePlaying) return
          
          const key = e.key.toLowerCase()
          
          // Jump handler
          if (key === '3' || key === 'w') {
            if (!character.jump()) return
            
            playAnimation('jump', false, () => {
              const stillMoving = character.isMoving()
              if (stillMoving) {
                playAnimation('run', true)
              } else {
                playAnimation('idle')
              }
            })
            return
          }
          
          // Attack handler
          if (key === '4' || key === 'l') {
            if (!character.attack()) return
            
            const isMoving = character.isMoving()
            
            if (isMoving) {
              playAnimation('runningAttack', false, () => {
                const stillMoving = character.isMoving()
                if (stillMoving) {
                  playAnimation('run', true)
                } else {
                  playAnimation('idle')
                }
              })
            } else {
              playAnimation('attack', false, () => {
                playAnimation('idle')
              })
            }
            return
          }
          
          // Prevent repeat events when key is held
          if (character.hasKey(key)) return
          character.addKey(key)

          const isMoving = character.isMoving()

          switch(key) {
            case '1':
              playAnimation('idle')
              break
            case '2':
            case 'arrowright':
            case 'd':
              playAnimation('run', true)
              animManager.setDirection(true) // Face right
              break
            case 'arrowleft':
            case 'a':
              playAnimation('run', true)
              animManager.setDirection(false) // Face left
              break
            case 'k': // K key for special animation
              if(!isMoving){
                playAnimation('blowup', false, () => {
                  playAnimation('idle')
                })
              }
              break
          }
        }

        window.addEventListener('keydown', handleKeyDown)

        // Handle key release
        const handleKeyUp = (e: KeyboardEvent) => {
          const key = e.key.toLowerCase()
          character.removeKey(key)
          
          const movementKeys = ['arrowright', 'd', 'arrowleft', 'a', '2']
          const hasMovementKeyPressed = movementKeys.some(k => character.hasKey(k))
          
          const currentAnim = animManager.getCurrentAnimation()
          if (!hasMovementKeyPressed && 
              currentAnim !== 'idle' && 
              currentAnim !== 'blowup' && 
              currentAnim !== 'jump' &&
              currentAnim !== 'attack' &&
              currentAnim !== 'runningAttack') {
            playAnimation('idle')
          }
        }

        window.addEventListener('keyup', handleKeyUp)

        // Game loop - update physics and check collisions
        app.ticker.add(() => {
          // Check if character died - freeze objects and trigger death sequence
          if (healthBar.isDead() && !objectsFrozen) {
            objectsFrozen = true
            console.log('[MultiStateCharacter] Health depleted - clearing screen and starting death sequence')
            
            // Clear all coins from screen
            coins.forEach(coin => {
              coin.destroy()
            })
            coins.length = 0
            
            // Clear all bombs from screen
            bombs.forEach(bomb => {
              bomb.destroy()
            })
            bombs.length = 0
            
            // Clear all powerups from screen
            powerUpSpawner.destroy()
            
            // Trigger the death animation sequence
            playDeathSequence()
          }

          // Always update character physics and movement (even when dead)
          character.update(platforms)

          // Update difficulty based on time (only if not frozen)
          if (!objectsFrozen) {
            const elapsedTime = Date.now() - gameStartTime
            const progress = Math.min(elapsedTime / difficultyConfig.rampUpDuration, 1)
            
            const currentGravity = difficultyConfig.startGravity + 
              (difficultyConfig.maxGravity - difficultyConfig.startGravity) * progress
            const currentMaxSpeed = difficultyConfig.startMaxSpeed + 
              (difficultyConfig.maxMaxSpeed - difficultyConfig.startMaxSpeed) * progress
            const currentCharacterSpeed = difficultyConfig.startCharacterSpeed +
              (difficultyConfig.maxCharacterSpeed - difficultyConfig.startCharacterSpeed) * progress
            
            // Calculate current target heart count
            currentHeartTarget = Math.floor(
              difficultyConfig.startHeartCount + 
              (difficultyConfig.maxHeartCount - difficultyConfig.startHeartCount) * progress
            )
            
            // Add new hearts if we need more (check every 5 seconds)
            if (Date.now() - lastHeartCheckTime > 5000 && coins.length < currentHeartTarget) {
              const heartsToAdd = currentHeartTarget - coins.length
              for (let i = 0; i < heartsToAdd; i++) {
                const randomX = leftBoundary + Math.random() * (rightBoundary - leftBoundary)
                const startY = -30 - (i * 100)
                coins.push(new Coin(randomX, startY, app.stage, height))
              }
              lastHeartCheckTime = Date.now()
            }
            
            // Apply difficulty to all coins and bombs
            coins.forEach(coin => coin.setDifficulty(currentGravity, currentMaxSpeed))
            bombs.forEach(bomb => bomb.setDifficulty(currentGravity, currentMaxSpeed))
            
            // Apply character speed scaling
            character.setBaseSpeed(currentCharacterSpeed)
          }

          // Only update falling objects if not frozen
          if (!objectsFrozen) {
            // Update and check hearts
            coins.forEach(coin => {
              coin.update()
              
              // Check collection (only if not already collected)
              if (!coin.collected && coin.checkCollection(sprite)) {
                scoreDisplay.increment()
              }
              
              // Respawn if off screen (whether collected or just fell off)
              if (coin.isOffScreen()) {
                const randomX = leftBoundary + Math.random() * (rightBoundary - leftBoundary)
                coin.reset(randomX)
              }
            })

            // Update and check bombs
            bombs.forEach(bomb => {
              bomb.update()
              
              // Check collision (only if not already hit and not invulnerable)
              if (!isInvulnerable && !bomb.hit && bomb.checkCollision(sprite)) {
                healthBar.takeDamage()
                // Start blinking effect
                isBlinking = true
                blinkTimer = Date.now()
              }
              
              // Respawn if off screen
              if (bomb.isOffScreen()) {
                const randomX = leftBoundary + Math.random() * (rightBoundary - leftBoundary)
                bomb.reset(randomX)
              }
            })

            // Update powerup spawner (handles spawning and updating powerups)
            powerUpSpawner.update()
            
            // Check powerup collection
            powerUpSpawner.getPowerUps().forEach(powerup => {
              if (!powerup.collected && powerup.checkCollection(sprite)) {
                powerup.applyEffect(character)
                // Activate/reset display timer
                powerUpDisplay.activate('⚡ Speed Boost', 10000)
              }
            })
          }

          // Handle blinking effect (always runs, even when objects are frozen)
          if (isBlinking) {
            const elapsed = Date.now() - blinkTimer
            
            if (elapsed >= blinkDuration) {
              // Stop blinking
              isBlinking = false
              sprite.alpha = 1
            } else {
              // Blink by alternating opacity
              const cycle = Math.floor(elapsed / blinkSpeed) % 2
              sprite.alpha = cycle === 0 ? 0.3 : 1
            }
          }

          // Update power up display timer (always runs)
          powerUpDisplay.update()
        })

        // Cleanup
        return () => {
          window.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('keyup', handleKeyUp)
          
          // Cleanup game entities
          platforms.forEach(platform => platform.destroy())
          coins.forEach(coin => coin.destroy())
          bombs.forEach(bomb => bomb.destroy())
          powerUpSpawner.destroy()
          scoreDisplay.destroy()
          healthBar.destroy()
          powerUpDisplay.destroy()
          
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
  }, [width, height, backgroundColor, backgroundAlpha, animations, defaultAnimation, scale])

  return (
    <div style={{ position: 'relative', width: `${width}px`, height: `${height}px` }}>
      <div ref={hostRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  )
}
