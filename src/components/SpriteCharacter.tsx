import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"

interface SpriteCharacterProps {
  width?: number
  height?: number
  backgroundColor?: number
  spritePath?: string // Path to your sprite image or spritesheet
}

export default function SpriteCharacter({
  width = 800,
  height = 500,
  backgroundColor = 0x1e1e1e,
  spritePath = "/your-sprite.png", // Replace with your sprite path
}: SpriteCharacterProps) {
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
        // Load your sprite image
        const texture = await PIXI.Assets.load(spritePath)
        const sprite = new PIXI.Sprite(texture)

        // Center the sprite
        sprite.anchor.set(0.5) // Set anchor to center
        sprite.x = width / 2
        sprite.y = height / 2

        // Optional: Scale the sprite
        sprite.scale.set(2) // Make it 2x bigger

        app.stage.addChild(sprite)

        // Simple animation: bobbing up and down
        let time = 0
        app.ticker.add((delta) => {
          time += delta.deltaTime * 0.05
          
          // Bobbing animation
          sprite.y = height / 2 + Math.sin(time) * 20
          
          // Optional: slight rotation
          sprite.rotation = Math.sin(time * 0.5) * 0.1
        })

      } catch (error) {
        console.error("Failed to load sprite:", error)
        
        // Fallback: create a simple placeholder
        const placeholder = new PIXI.Graphics()
          .circle(0, 0, 50)
          .fill(0xff6b9d)
        
        placeholder.x = width / 2
        placeholder.y = height / 2
        app.stage.addChild(placeholder)
        
        // Add text
        const text = new PIXI.Text({
          text: "Add your sprite at:\n" + spritePath,
          style: {
            fontSize: 16,
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
  }, [width, height, backgroundColor, spritePath])

  return <div ref={hostRef} />
}
