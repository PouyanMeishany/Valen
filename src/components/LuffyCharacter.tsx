import { memo } from 'react'
import MultiStateCharacter from './MultiStateCharacter'

/**
 * Ready-to-use configuration for your Luffy sprite sheet
 * 
 * INSTRUCTIONS:
 * 1. Save your sprite sheet image to: /public/luffy-spritesheet.png
 * 2. Measure ONE frame width and height in pixels (they should all be the same size)
 * 3. Update frameWidth and frameHeight below
 * 4. Adjust the animation definitions based on which row each animation is on
 * 5. Import this component in your App.tsx
 */

const LuffyCharacter = memo(function LuffyCharacter() {
  // Define all available animations
  // Count the rows from top to bottom (starting at 0)
  const luffyAnimations = [
    {
      name: 'idle',
      sheet: '/luffy-idle.png',
      framewidth: 39,
      frameheight: 55,
      row: 0,           // First row from top
      startFrame: 0,    // Start at first frame
      frameCount: 7,    // Count how many frames in this animation
      speed: 0.08,      // Slow idle animation
      loop: true        // Keep repeating
    },
    {
      name: 'walk',
      sheet: '/luffy-short-punch(56x53).png',
      framewidth: 56,
      frameheight: 53,
      row: 0,           // Second row
      startFrame: 0,
      frameCount: 7,
      speed: 0.15,
      loop: true
    },
    {
      name: 'run',
      sheet: '/luffy-running 228x54.png',
      framewidth: 228,
      frameheight: 54,
      row: 0,           // Third row
      startFrame: 0,
      frameCount: 5,
      speed: 0.15,      // Fast running animation
      loop: true
    },
    {
      name: 'jump',
      sheet: '/luffy-jump.png',
      framewidth: 266,
      frameheight: 102,
      row: 0,           // Fourth row
      startFrame: 0,
      frameCount: 11,
      speed: 0.18,
      loop: false       // Jump once, don't repeat
    },
    {
      name: 'attack',
      sheet: '/luffy-short-punch(56x53).png',
      framewidth: 56,
      frameheight: 53,
      row: 0,           // Fifth row
      startFrame: 0,
      frameCount: 7,
      speed: 0.3,       // Fast attack
      loop: false
    },
    {
      name: 'crouch',
      sheet: '/luffy-short-punch(56x53).png',
      framewidth: 56,
      frameheight: 53,
      row: 5,           // Sixth row
      startFrame: 0,
      frameCount: 7,
      speed: 0.12,
      loop: true
    },
    {
      name: 'runningAttack',
      sheet: '/luffy-attack.png',  // 🚧 TODO: Upload your running attack sprite sheet
      framewidth: 521,   // 🚧 TODO: Update with actual frame width
      frameheight: 62,  // 🚧 TODO: Update with actual frame height
      row: 0,
      startFrame: 0,
      frameCount: 8,    // 🚧 TODO: Update with actual frame count
      speed: 0.35,      // Fast running attack
      loop: false
    },
    {
      name: 'blowup',
      sheet: '/luffy-blowup.png',  // 🚧 TODO: Upload your running attack sprite sheet
      framewidth: 556,   // 🚧 TODO: Update with actual frame width
      frameheight: 66,  // 🚧 TODO: Update with actual frame height
      row: 0,
      startFrame: 0,
      frameCount: 11,    // 🚧 TODO: Update with actual frame count
      speed: 0.35,      // Fast running attack
      loop: false
    },
    // Add more animations for other rows as needed
    // Just count which row and how many frames
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
        animations={luffyAnimations}
        defaultAnimation="idle"
        scale={3}            // Make character 3x bigger
        width={window.innerWidth}  // Full page width
        height={window.innerHeight}  // Full screen height
        backgroundColor={0x00}  // Transparent background (will match page bg)
        backgroundAlpha={0}  // Fully transparent
      />
    </div>
  )
})

export default LuffyCharacter
