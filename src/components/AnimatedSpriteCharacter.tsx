import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"

interface AnimatedSpriteCharacterProps {
  width?: number
  height?: number
  backgroundColor?: number
  spriteSheetPath?: string
}

/**
 * Component for sprite sheet animations (multiple frames in one image)
 * For example: character-walk.png with frames laid out horizontally
 */
export default function AnimatedSpriteCharacter({
  width = 800,
  height = 500,
  backgroundColor = 0x1e1e1e,
  spriteSheetPath = "/character-spritesheet.png",
}: AnimatedSpriteCharacterProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hostRef.current) return

    const initApp = async () => {
      const app = new PIXI.Application()
      
      await app.init({
        width,
        height,
        background: backgroundColor,
        antialias: true,
      })

      hostRef.current?.appendChild(app.canvas)

      try {
        // Load sprite sheet
        const texture = await PIXI.Assets.load(spriteSheetPath)
        
        // Method 1: If you have individual frame files
        // const frames = [
        //   await PIXI.Assets.load('/frame1.png'),
        //   await PIXI.Assets.load('/frame2.png'),
        //   await PIXI.Assets.load('/frame3.png'),
        // ]
        
        // Method 2: If you have a sprite sheet (frames in one image)
        // You need to define how to slice it
        const frameWidth = 64  // Width of each frame
        const frameHeight = 64 // Height of each frame
        const numFrames = 4    // Number of frames in the animation
        
        const frames: PIXI.Texture[] = []
        for (let i = 0; i < numFrames; i++) {
          const frame = new PIXI.Texture({
            source: texture.source,
            frame: new PIXI.Rectangle(
              i * frameWidth, // x position
              0,              // y position
              frameWidth,     // width
              frameHeight     // height
            )
          })
          frames.push(frame)
        }

        // Create animated sprite
        const animatedSprite = new PIXI.AnimatedSprite(frames)
        
        // Configure animation
        animatedSprite.anchor.set(0.5)
        animatedSprite.x = width / 2
        animatedSprite.y = height / 2
        animatedSprite.scale.set(3) // Scale up
        animatedSprite.animationSpeed = 0.1 // Speed of animation (0.1 = slower)
        animatedSprite.loop = true
        animatedSprite.play()

        app.stage.addChild(animatedSprite)

        // Optional: Add movement or other animations
        let direction = 1
        app.ticker.add((delta) => {
          // Move left and right
          animatedSprite.x += direction * 2 * delta.deltaTime
          
          // Flip direction at edges
          if (animatedSprite.x > width - 50 || animatedSprite.x < 50) {
            direction *= -1
            animatedSprite.scale.x *= -1 // Flip sprite horizontally
          }
        })

      } catch (error) {
        console.error("Failed to load sprite sheet:", error)
        
        // Fallback: create animated placeholder
        const frames: PIXI.Texture[] = []
        
        // Create simple animated shapes as frames
        for (let i = 0; i < 4; i++) {
          const graphics = new PIXI.Graphics()
            .circle(0, 0, 30 + i * 5)
            .fill(0xff6b9d)
          
          const texture = app.renderer.generateTexture(graphics)
          frames.push(texture)
        }
        
        const placeholder = new PIXI.AnimatedSprite(frames)
        placeholder.anchor.set(0.5)
        placeholder.x = width / 2
        placeholder.y = height / 2
        placeholder.animationSpeed = 0.15
        placeholder.loop = true
        placeholder.play()
        
        app.stage.addChild(placeholder)
        
        // Add instruction text
        const text = new PIXI.Text({
          text: "Add your sprite sheet at:\n" + spriteSheetPath + "\n\nUpdate frameWidth, frameHeight,\nand numFrames in the code",
          style: {
            fontSize: 14,
            fill: 0xffffff,
            align: 'center'
          }
        })
        text.anchor.set(0.5)
        text.x = width / 2
        text.y = height / 2 + 80
        app.stage.addChild(text)
      }

      return () => {
        app.destroy(true, { children: true })
      }
    }

    initApp()
  }, [width, height, backgroundColor, spriteSheetPath])

  return <div ref={hostRef} />
}
