import { memo } from 'react'
import MultiStateCharacter from './MultiStateCharacter'

/**
 * Ready-to-use configuration for your Zorro sprite sheet
 * 
 * INSTRUCTIONS:
 * 1. Save your sprite sheet images to /public/ folder (e.g., /public/zorro-idle.png)
 * 2. Measure ONE frame width and height in pixels for each animation
 * 3. Update framewidth and frameheight below for each animation
 * 4. Update frameCount based on how many frames each animation has
 * 5. Import this component in your App.tsx
 */

const ZorroCharacter = memo(function ZorroCharacter() {
  // Define all available animations
  const zorroAnimations = [
    {
      name: 'idle',
      sheet: '/zoro-big-attack.png',
      framewidth: 270,
      frameheight: 202,
      row: 0,
      startFrame: 0,
      frameCount: 13,
      speed: 0.12,
      loop: true
    },
    {
      name: 'walk',
      sheet: '/zoro-animation-3.png',  
      framewidth: 270,
      frameheight: 202,
      row: 0,
      startFrame: 0,
      frameCount: 21,
      speed: 0.15,
      loop: true
    },
    {
      name: 'run',
      sheet: '/zoro-run.png',
      framewidth: 270,   // Update if different sprite sheet
      frameheight: 202,  // Update if different sprite sheet
      row: 0,
      startFrame: 0,
      frameCount: 6,
      speed: 0.15,
      loop: true
    },
    {
      name: 'jump',
      sheet: '/zorro-jump.png',
      framewidth: 270,   // Update if different sprite sheet
      frameheight: 202,  // Update if different sprite sheet
      row: 0,
      startFrame: 0,
      frameCount: 10,
      speed: 0.18,
      loop: false
    },
    {
      name: 'attack',
      sheet: '/zoro-animation-3.png',
      framewidth: 270,   // Same as idle since same sprite sheet
      frameheight: 202,  // Same as idle since same sprite sheet
      row: 0,
      startFrame: 0,
      frameCount: 6,
      speed: 0.3,
      loop: false
    },
    {
      name: 'crouch',
      sheet: '/zoro-animation-3.png',
      framewidth: 270,   // Same as idle since same sprite sheet
      frameheight: 202,  // Same as idle since same sprite sheet
      row: 0,
      startFrame: 0,
      frameCount: 4,
      speed: 0.12,
      loop: true
    },
    {
      name: 'runningAttack',
      sheet: '/zoro-big-attack.png',
      framewidth: 270,   // Same as idle since same sprite sheet
      frameheight: 202,  // Same as idle since same sprite sheet
      row: 0,
      startFrame: 0,
      frameCount: 8,
      speed: 0.35,
      loop: false
    },
    {
      name: 'blowup',
      sheet: '/zoro-big-attack.png',
      framewidth: 2000,   // Same as idle since same sprite sheet
      frameheight: 75,  // Same as idle since same sprite sheet
      row: 0,
      startFrame: 0,
      frameCount: 13,
      speed: 0.35,
      scale: 3,
      loop: false
    },
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      pointerEvents: 'none',  // Allow clicks to pass through to buttons below
      zIndex: 999999  // On top of everything
    }}>
      <MultiStateCharacter
        animations={zorroAnimations}
        defaultAnimation="idle"
        scale={0.5}          // Smaller scale since Zorro frames are much larger (270x202 vs Luffy's 39x55)
        width={window.innerWidth}  // Full page width
        height={400}         // Height for bottom section
        backgroundColor={0xffffff}  // Transparent background (will match page bg)
        backgroundAlpha={0}  // Fully transparent
      />
    </div>
  )
})

export default ZorroCharacter
