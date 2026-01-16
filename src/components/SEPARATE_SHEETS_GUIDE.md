# Separate Sprite Sheets Per Animation Guide

## ✨ New Structure

Each animation now has its own sprite sheet with custom frame dimensions!

## 📝 Animation Configuration

```tsx
const animations = [
  {
    name: 'idle',
    sheet: '/luffy-idle.png',       // Path to this animation's sprite sheet
    framewidth: 56,                  // Width of frames in THIS sprite sheet
    frameheight: 53,                 // Height of frames in THIS sprite sheet
    row: 0,                          // Which row (if multiple rows in sheet)
    startFrame: 0,                   // Starting column
    frameCount: 7,                   // Number of frames
    speed: 0.18,                     // Animation speed
    loop: true                       // Should it loop?
  },
  {
    name: 'run',
    sheet: '/luffy-run.png',        // Different sprite sheet
    framewidth: 64,                  // Different frame width!
    frameheight: 60,                 // Different frame height!
    row: 0,
    startFrame: 0,
    frameCount: 8,
    speed: 0.25,
    loop: true
  },
  // ... more animations
]
```

## 🎯 Benefits

✅ **Each animation can have different frame sizes**
✅ **Easier to update individual animations**
✅ **Mix and match from different sources**
✅ **Better organization**

## 📂 File Structure Example

```
public/
├── luffy-idle.png          (56x53 frames, 7 frames)
├── luffy-run.png           (64x60 frames, 8 frames)
├── luffy-jump.png          (70x80 frames, 10 frames)
├── luffy-attack.png        (80x70 frames, 12 frames)
└── luffy-crouch.png        (50x40 frames, 4 frames)
```

## 🔧 How It Works

1. **Component loads each sprite sheet separately** when initialized
2. **Extracts frames using animation-specific dimensions**
3. **Stores frames in a Map** for quick switching
4. **Character stays anchored at bottom-center** to prevent sliding

## 💡 Tips

### For Single Row Sprite Sheets
If each animation file has just one row of frames:
```tsx
{
  name: 'walk',
  sheet: '/walk.png',
  framewidth: 64,
  frameheight: 64,
  row: 0,              // Always 0 for single-row sheets
  startFrame: 0,       // Start at first frame
  frameCount: 6,       // Count the frames
  speed: 0.15,
  loop: true
}
```

### For Multi-Row Sprite Sheets
If one file has multiple animations in different rows:
```tsx
{
  name: 'attack1',
  sheet: '/attacks.png',
  framewidth: 80,
  frameheight: 70,
  row: 0,              // First row
  startFrame: 0,
  frameCount: 8,
  speed: 0.3,
  loop: false
},
{
  name: 'attack2',
  sheet: '/attacks.png',    // Same file
  framewidth: 80,
  frameheight: 70,
  row: 1,                   // Second row
  startFrame: 0,
  frameCount: 10,
  speed: 0.25,
  loop: false
}
```

### Starting Mid-Row
If your animation starts partway through a row:
```tsx
{
  name: 'special',
  sheet: '/moves.png',
  framewidth: 100,
  frameheight: 100,
  row: 2,              // Third row
  startFrame: 5,       // Skip first 5 frames
  frameCount: 8,       // Use frames 5-12
  speed: 0.2,
  loop: false
}
```

## 🐛 Troubleshooting

### Problem: Animation not loading
- Check file path is correct (`/public/file.png` → use `"/file.png"`)
- Check console for load errors
- Verify file exists in `/public/` folder

### Problem: Frames look cut off or overlapping
- Verify `framewidth` and `frameheight` are correct
- Measure one frame in your image editor
- Make sure all frames in that sheet are the same size

### Problem: Wrong frames showing
- Check `row` number (starts at 0)
- Check `startFrame` (starts at 0)
- Check `frameCount` matches actual frames

### Problem: Character "sliding" between animations
- This is normal if different animations have different frame sizes
- The anchor is at bottom-center, so feet stay planted
- Adjust sprite positions in your sprite sheets to minimize this

## 🚀 Usage

```tsx
import MultiStateCharacter from './components/MultiStateCharacter'

<MultiStateCharacter
  animations={myAnimations}
  defaultAnimation="idle"
  scale={3}
  width={800}
  height={500}
/>
```

That's it! Each animation loads from its own file with custom dimensions.
