import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"

export default function CharacterStage() {
  const containerRef = useRef(null)

  useEffect(() => {
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1e1e1e,
      antialias: true,
    })

    containerRef.current.appendChild(app.view)

    return () => {
      app.destroy(true, true)
    }
  }, [])

  return <div ref={containerRef} />
}