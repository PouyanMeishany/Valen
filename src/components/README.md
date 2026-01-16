# Interactive Rubber Arm Character - PixiJS v8

A modular, TypeScript-based 2D anime character with a procedurally animated "rubber arm" that follows your mouse cursor in real-time using PixiJS v8.

## Features

✅ **Real-time Mouse Tracking** - Arm smoothly follows cursor with easing  
✅ **Rubber Arm Physics** - Dynamic stretching and rotation (like Luffy from One Piece)  
✅ **Modular Architecture** - Easy to swap characters or create multiple instances  
✅ **PixiJS v8 Compatible** - Uses latest async initialization and Graphics API  
✅ **TypeScript Safe** - Full type safety throughout  
✅ **No Dependencies** - Pure browser-based rendering, no server-side canvas  
✅ **React Integration** - Clean component lifecycle with proper cleanup

## File Structure

```
components/
├── CharacterStage.tsx        # Main React component wrapper
├── createCharacter.ts         # Modular character factory & animation controller
├── types.ts                   # TypeScript interfaces and default config
└── README.md                  # This file
```

## Usage

### Basic Usage

```tsx
import CharacterStage from './components/CharacterStage'

function App() {
  return (
    <div>
      <CharacterStage />
    </div>
  )
}
```

### Custom Configuration

```tsx
<CharacterStage 
  width={1200} 
  height={700} 
  backgroundColor={0x2c3e50} 
/>
```

## Architecture

### 1. **CharacterStage.tsx**
React component that:
- Initializes PixiJS v8 app with async `app.init()`
- Sets up canvas container
- Creates character and animation controller
- Handles mouse input
- Cleans up on unmount

### 2. **createCharacter.ts**
Factory pattern for creating characters:
- `createCharacter()` - Builds body, arm hierarchy (shoulder → upper arm → forearm → hand)
- `RubberArmController` - Handles animation logic with smooth easing

### 3. **types.ts**
Configuration interface allowing you to customize:
- Body dimensions and color
- Arm lengths and colors
- Animation parameters (stretch limits, easing speed)

## Customization Examples

### Create a Different Character

```ts
import { CharacterConfig } from './components/types'

const customConfig: CharacterConfig = {
  body: {
    width: 100,
    height: 200,
    color: 0x00ff00, // Green body
    x: 400,
    y: 300,
  },
  arm: {
    shoulderOffset: { x: 50, y: -50 },
    upperArmLength: 120,
    forearmLength: 90,
    handRadius: 15,
    colors: {
      upperArm: 0x0000ff,
      forearm: 0x00ffff,
      hand: 0xffff00,
    },
  },
  animation: {
    baseLength: 200,
    maxStretch: 3.0,
    easing: 0.08, // Slower easing
  },
}

// Then pass to createCharacter()
const character = createCharacter(customConfig, app.stage)
```

### Multiple Characters

```ts
const character1 = createCharacter(config1, app.stage)
const character2 = createCharacter(config2, app.stage)

const controller1 = new RubberArmController(character1)
const controller2 = new RubberArmController(character2)

app.ticker.add(() => {
  controller1.update()
  controller2.update()
})
```

## Future Enhancements

- [ ] Add inverse kinematics (IK) for more realistic arm bending
- [ ] Implement object catching/grabbing
- [ ] Add full sprite sheet support
- [ ] Multiple joints (elbow bending)
- [ ] Physics-based collisions
- [ ] Animation state machine (idle, reaching, grabbing, etc.)
- [ ] Touch device support
- [ ] Add facial expressions
- [ ] Add body/legs animation

## PixiJS v8 Migration Notes

If upgrading from v7:
- `new PIXI.Application({ ... })` → `await app.init({ ... })`
- `app.view` → `app.canvas`
- `backgroundColor` → `background`
- `graphics.beginFill().drawRect().endFill()` → `graphics.rect().fill()`

## Performance Tips

- The animation runs at 60fps via `app.ticker`
- Easing factor (0.12) controls smoothness vs responsiveness
- Lower `maxStretch` reduces visual stretching
- For multiple characters, consider shared ticker instances

## License

Part of the Valen Valentine project 💝
