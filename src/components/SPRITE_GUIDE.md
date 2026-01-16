# How to Use Your Own 2D Sprite with Animations

This guide shows you how to replace the procedural character with your own 2D sprite and add animations.

## Option 1: Single Static Sprite (Simple Image)

Use `SpriteCharacter.tsx` for a single image with simple animations (bobbing, rotation, etc.)

### Usage:
```tsx
import SpriteCharacter from './components/SpriteCharacter'

<SpriteCharacter 
  spritePath="/your-character.png"
  width={800}
  height={500}
/>
```

### Where to Put Your Sprite:
1. **In `public/` folder**: `/public/character.png` → use `spritePath="/character.png"`
2. **In `src/assets/`**: Import it first:
```tsx
import mySprite from './assets/character.png'
<SpriteCharacter spritePath={mySprite} />
```

### Built-in Animations:
- Bobbing up/down
- Slight rotation
- Easy to customize in the ticker

---

## Option 2: Animated Sprite Sheet

Use `AnimatedSpriteCharacter.tsx` for frame-by-frame animations (walk cycles, idle animations, etc.)

### What's a Sprite Sheet?
A single image containing multiple frames of animation laid out in a grid:

```
[Frame 1][Frame 2][Frame 3][Frame 4]
```

### Usage:
```tsx
import AnimatedSpriteCharacter from './components/AnimatedSpriteCharacter'

<AnimatedSpriteCharacter 
  spriteSheetPath="/character-walk.png"
/>
```

### Configure Your Sprite Sheet:
Open `AnimatedSpriteCharacter.tsx` and update these values:

```ts
const frameWidth = 64   // Width of each frame in pixels
const frameHeight = 64  // Height of each frame in pixels  
const numFrames = 8     // Total number of frames
```

### Animation Settings:
- `animationSpeed`: `0.1` = slower, `0.5` = faster
- `loop`: `true` for continuous animation
- `scale`: Make sprite bigger/smaller

---

## Option 3: Multiple Animation States

Create different animations (idle, walk, jump) using Spine or JSON sprite sheets:

```tsx
// Load sprite atlas (JSON + PNG)
await PIXI.Assets.load('/character.json')
const sheet = PIXI.Assets.cache.get('/character.json')

// Create animations from named frames
const idleFrames = [
  sheet.textures['idle_01.png'],
  sheet.textures['idle_02.png'],
  sheet.textures['idle_03.png'],
]

const walkFrames = [
  sheet.textures['walk_01.png'],
  sheet.textures['walk_02.png'],
  sheet.textures['walk_03.png'],
  sheet.textures['walk_04.png'],
]

const sprite = new PIXI.AnimatedSprite(idleFrames)
sprite.play()

// Switch animations
function playWalk() {
  sprite.textures = walkFrames
  sprite.play()
}
```

---

## Creating Sprite Sheets

### Tools to Create Sprite Sheets:
1. **TexturePacker** - https://www.codeandweb.com/texturepacker
2. **Shoebox** - http://renderhjs.net/shoebox/
3. **Aseprite** - https://www.aseprite.org/ (for pixel art)
4. **Piskel** - https://www.piskelapp.com/ (free online)

### Manual Creation:
Use any image editor (Photoshop, GIMP, etc.) and arrange frames horizontally or in a grid.

Example layout for 4 frames (64x64 each):
```
Total image: 256x64 pixels
[Frame1][Frame2][Frame3][Frame4]
  64px    64px    64px    64px
```

---

## Supported Image Formats

PixiJS supports:
- PNG (with transparency ✓)
- JPG
- WebP
- SVG
- GIF (but use sprite sheets for better performance)

---

## Example: Replace CharacterStage with Your Sprite

In your [App.tsx](../App.tsx):

```tsx
// Remove or comment out:
// import CharacterStage from './components/CharacterStage'

// Add:
import SpriteCharacter from './components/SpriteCharacter'

// Then use:
<SpriteCharacter spritePath="/my-valentine.png" />
```

---

## Custom Animations Examples

### Floating Animation:
```ts
app.ticker.add((delta) => {
  time += delta.deltaTime * 0.05
  sprite.y = baseY + Math.sin(time) * 15
})
```

### Pulse/Scale Animation:
```ts
app.ticker.add((delta) => {
  time += delta.deltaTime * 0.1
  const scale = 1 + Math.sin(time) * 0.1
  sprite.scale.set(scale)
})
```

### Rotation:
```ts
app.ticker.add((delta) => {
  sprite.rotation += 0.01 * delta.deltaTime
})
```

### Move on Path:
```ts
const path = [
  { x: 100, y: 200 },
  { x: 700, y: 200 },
  { x: 700, y: 400 },
  { x: 100, y: 400 },
]
let currentPoint = 0

app.ticker.add((delta) => {
  const target = path[currentPoint]
  const dx = target.x - sprite.x
  const dy = target.y - sprite.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance < 5) {
    currentPoint = (currentPoint + 1) % path.length
  } else {
    sprite.x += (dx / distance) * 2 * delta.deltaTime
    sprite.y += (dy / distance) * 2 * delta.deltaTime
  }
})
```

---

## Need Help?

1. Check the PixiJS v8 docs: https://pixijs.com/8.x/guides
2. Sprite examples: https://pixijs.com/8.x/examples/sprite/basic
3. AnimatedSprite: https://pixijs.com/8.x/examples/sprite/animated-sprite

---

## Quick Reference: File Locations

```
Valen/
├── public/
│   └── your-sprite.png        ← Put sprites here (use "/your-sprite.png")
├── src/
│   ├── assets/
│   │   └── your-sprite.png    ← Or here (import it first)
│   └── components/
│       ├── SpriteCharacter.tsx         ← Single image + simple animation
│       ├── AnimatedSpriteCharacter.tsx ← Sprite sheet animations
│       └── CharacterStage.tsx          ← Original rubber arm
```
