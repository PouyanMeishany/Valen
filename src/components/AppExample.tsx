// Example of how to integrate CharacterStage into your App.tsx

import CharacterStage from './CharacterStage'

function AppWithCharacter() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <h1>Interactive Rubber Arm Character</h1>
      <p>Move your mouse over the canvas to make the character reach for it!</p>
      
      {/* The character canvas */}
      <CharacterStage />
      
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <h3>Features:</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>Arm stretches dynamically toward cursor</li>
          <li>Smooth rotation and easing</li>
          <li>Built with PixiJS v8</li>
          <li>Fully modular and customizable</li>
        </ul>
      </div>
    </div>
  )
}

export default AppWithCharacter
