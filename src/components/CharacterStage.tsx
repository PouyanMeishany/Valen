import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"
import { createCharacter, RubberArmController } from "./createCharacter"
import { defaultCharacterConfig } from "./types"

interface CharacterStageProps {
  width?: number
  height?: number
  backgroundColor?: number
}

export default function CharacterStage({
  width = 800,
  height = 500,
  backgroundColor = 0x1e1e1e,
}: CharacterStageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hostRef.current) return

    const initApp = async () => {
      // Initialize PixiJS app (v8 async pattern)
      const app = new PIXI.Application()
      
      await app.init({
        width,
        height,
        background: backgroundColor,
        antialias: true,
      })

      hostRef.current?.appendChild(app.canvas)

      // Create character using modular factory
      const character = createCharacter(defaultCharacterConfig, app.stage)
      
      // Create animation controller
      const controller = new RubberArmController(character)

      // Setup mouse tracking
      app.stage.eventMode = "static"
      app.stage.hitArea = app.screen

      app.stage.on("pointermove", (e: PIXI.FederatedPointerEvent) => {
        controller.setTarget(e.global.x, e.global.y)
      })

      // Animation loop
      app.ticker.add(() => {
        controller.update()
      })

      // Cleanup on unmount
      return () => {
        app.destroy(true, { children: true })
      }
    }

    initApp()
  }, [width, height, backgroundColor])

  return <div ref={hostRef} />
}