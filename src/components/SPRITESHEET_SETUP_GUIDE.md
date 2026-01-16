# How to Use Your Multi-Animation Sprite Sheet

## 📋 Step-by-Step Setup

### Step 1: Save Your Sprite Sheet
1. Save your sprite sheet image to `/public/` folder
2. Name it something like `luffy-spritesheet.png` or `character.png`

### Step 2: Measure Frame Dimensions
Open your sprite sheet in an image editor and measure:
- **Frame Width**: Width of ONE character frame (e.g., 32px, 64px, 128px)
- **Frame Height**: Height of ONE character frame (e.g., 32px, 64px, 128px)

💡 All frames should be the same size in a grid layout.

### Step 3: Map Your Animations
Look at your sprite sheet and identify each animation by its row:

```
Row 0: Idle animation (8 frames)
Row 1: Walk animation (6 frames)
Row 2: Run animation (8 frames)
Row 3: Jump animation (10 frames)
Row 4: Attack animation (12 frames)
Row 5: Crouch animation (4 frames)
... etc
```

### Step 4: Create Animation Configuration

Based on YOUR specific sprite sheet, create an array like this:

```tsx
const myAnimations = [
  {
    name: 'idle',
    row: 0,           // Which row (0 = first row)
    startFrame: 0,    // Which column to start (usually 0)
    frameCount: 8,    // How many frames in this row
    speed: 0.1,       // 0.1 = slow, 0.3 = fast
    loop: true        // Should it repeat?
  },
  {
    name: 'walk',
    row: 1,
    startFrame: 0,
    frameCount: 6,
    speed: 0.15,
    loop: true
  },
  {
    name: 'run',
    row: 2,
    startFrame: 0,
    frameCount: 8,
    speed: 0.25,      // Faster for running
    loop: true
  },
  {
    name: 'jump',
    row: 3,
    startFrame: 0,
    frameCount: 10,
    speed: 0.2,
    loop: false       // Jump shouldn't loop
  },
  {
    name: 'attack',
    row: 4,
    startFrame: 0,
    frameCount: 12,
    speed: 0.3,       // Fast attack
    loop: false       // Attack once then stop
  },
]
```

### Step 5: Use the Component

```tsx
import MultiStateCharacter from './components/MultiStateCharacter'

<MultiStateCharacter
  spriteSheetPath="/your-spritesheet.png"
  frameWidth={64}        // YOUR measured width
  frameHeight={64}       // YOUR measured height
  animations={myAnimations}
  defaultAnimation="idle"
  scale={2}             // Make it bigger
/>
```

---

## 🎮 Keyboard Controls (Built-in)

- **1**: Play idle animation
- **2**: Play run animation
- **3**: Play jump animation
- **4**: Play attack animation
- **Arrow Left/A**: Run left
- **Arrow Right/D**: Run right
- **Space**: Jump

---

## 🔧 Advanced: Non-Uniform Sprite Sheets

If your animations are in different positions (not in neat rows):

```tsx
{
  name: 'special_attack',
  row: 5,
  startFrame: 3,    // Start at 4th column (0-indexed)
  frameCount: 7,
  speed: 0.25,
  loop: false
}
```

---

## 📊 Example for Your Luffy Sprite Sheet

Looking at your sprite sheet, here's a starter configuration:

```tsx
const luffyAnimations = [
  // Row 0: Standing/Idle
  { name: 'idle', row: 0, startFrame: 0, frameCount: 6, speed: 0.08, loop: true },
  
  // Row 1: Walking
  { name: 'walk', row: 1, startFrame: 0, frameCount: 8, speed: 0.15, loop: true },
  
  // Row 2: Running
  { name: 'run', row: 2, startFrame: 0, frameCount: 8, speed: 0.25, loop: true },
  
  // Row 3: Jumping
  { name: 'jump', row: 3, startFrame: 0, frameCount: 8, speed: 0.18, loop: false },
  
  // Row 4: Punching/Attacking
  { name: 'punch', row: 4, startFrame: 0, frameCount: 6, speed: 0.3, loop: false },
  
  // Row 5: Crouching
  { name: 'crouch', row: 5, startFrame: 0, frameCount: 4, speed: 0.12, loop: true },
  
  // Row 6: Gum-Gum Pistol or special attack
  { name: 'special', row: 6, startFrame: 0, frameCount: 10, speed: 0.25, loop: false },
  
  // Add more rows as needed...
]

<MultiStateCharacter
  spriteSheetPath="/luffy-spritesheet.png"
  frameWidth={48}    // Adjust based on your actual frame size
  frameHeight={48}   // Adjust based on your actual frame size
  animations={luffyAnimations}
  defaultAnimation="idle"
  scale={3}
/>
```

---

## 🎨 Customizing Animations Programmatically

You can trigger animations from code:

```tsx
// Add buttons to trigger animations
<button onClick={() => playAnimation('run')}>Run</button>
<button onClick={() => playAnimation('jump')}>Jump</button>
<button onClick={() => playAnimation('attack')}>Attack</button>
```

To expose the `playAnimation` function, you'll need to modify the component to use refs or callbacks.

---

## 🐛 Troubleshooting

### Problem: Only showing one frame or wrong frames
- **Check**: `frameWidth` and `frameHeight` are correct
- **Check**: Rows and frame counts match your sprite sheet
- **Check**: Image path is correct (`/public/image.png` → use `"/image.png"`)

### Problem: Animation too fast/slow
- **Fix**: Adjust `speed` value (0.05 = very slow, 0.5 = very fast)

### Problem: Character disappears after animation
- **Fix**: Set `loop: true` for repeating animations

### Problem: Frames are offset or cut off
- **Fix**: Make sure all frames are same size and aligned in a perfect grid

---

## 📏 Measuring Your Sprite Sheet

1. Open in any image editor
2. Measure the total width of the image
3. Count how many frames are in one row
4. Divide: `frameWidth = totalWidth / framesPerRow`
5. Do the same for height

Example:
- Image is 512px wide
- 8 frames per row
- Frame width = 512 / 8 = 64px

---

## 🚀 Quick Start

1. Put your sprite sheet in `/public/` as `/public/character.png`
2. Copy [ExampleUsage.tsx](ExampleUsage.tsx) to see a working example
3. Adjust the frame dimensions and animation mappings
4. Test with keyboard controls (1, 2, 3, 4 keys)

That's it! Your character will animate with multiple states.
