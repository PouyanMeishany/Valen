import MultiStateCharacter from './components/MultiStateCharacter'

// Define your animations based on your sprite sheet
// You'll need to count the rows and frames for each animation
const characterAnimations = [
  {
    name: 'idle',
    row: 0,           // First row (0-indexed)
    startFrame: 0,    // First frame in the row
    frameCount: 8,    // How many frames for idle animation
    speed: 0.1,       // Slow animation
    loop: true
  },
  {
    name: 'run',
    row: 1,           // Second row
    startFrame: 0,
    frameCount: 8,    // 8 frames of running
    speed: 0.2,       // Faster animation
    loop: true
  },
  {
    name: 'jump',
    row: 2,           // Third row
    startFrame: 0,
    frameCount: 6,    // 6 frames of jumping
    speed: 0.15,
    loop: false       // Don't loop jumping
  },
  {
    name: 'attack',
    row: 3,           // Fourth row
    startFrame: 0,
    frameCount: 10,   // 10 frames of attack
    speed: 0.25,      // Fast attack
    loop: false
  },
  // Add more animations as needed:
  // {
  //   name: 'crouch',
  //   row: 4,
  //   startFrame: 0,
  //   frameCount: 4,
  //   speed: 0.12,
  //   loop: true
  // },
]

function AppWithCharacter() {
  return (
    <div>
      <h1>Multi-State Character Animation</h1>
      
      <MultiStateCharacter
        spriteSheetPath="/luffy-spritesheet.png"  // Your sprite sheet path
        frameWidth={32}    // Width of each frame (measure in your image)
        frameHeight={32}   // Height of each frame (measure in your image)
        animations={characterAnimations}
        defaultAnimation="idle"
        scale={3}          // Make it 3x bigger
        width={800}
        height={500}
      />
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>How to set this up for your sprite sheet:</h3>
        <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>Save your sprite sheet image to <code>/public/</code> folder</li>
          <li>Measure the width and height of ONE frame in pixels</li>
          <li>Count which row each animation is on (starting from 0)</li>
          <li>Count how many frames are in each animation</li>
          <li>Update the animations array above with your data</li>
        </ol>
      </div>
    </div>
  )
}

export default AppWithCharacter
