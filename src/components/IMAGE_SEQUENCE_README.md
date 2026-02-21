# Image Sequence Player

A modular React component for playing a sequence of images as an animation. Perfect for creating frame-by-frame animations, sprite sequences, or any scenario where you want to display images in sequence.

## Features

- ✨ Simple API - just pass an array of images
- ⚡ Configurable speed
- 🔄 Loop or play once
- 🎮 Built-in playback controls
- 🎯 AutoPlay option
- 🪝 Custom hook for advanced control
- 📱 Responsive design
- 🎨 Fully customizable styling

## Basic Usage

```tsx
import { ImageSequencePlayer } from './components/ImageSequencePlayer'

function App() {
  const images = [
    '/frame1.jpg',
    '/frame2.jpg',
    '/frame3.jpg',
    '/frame4.jpg',
  ]

  return (
    <ImageSequencePlayer 
      images={images}
      speed={100}
      loop={true}
      autoPlay={true}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | **required** | Array of image URLs to play in sequence |
| `speed` | `number` | `100` | Milliseconds per frame (lower = faster) |
| `loop` | `boolean` | `true` | Whether to loop the animation |
| `autoPlay` | `boolean` | `true` | Start playing immediately on mount |
| `onComplete` | `() => void` | `undefined` | Callback when sequence completes (only fires when loop is false) |
| `className` | `string` | `''` | Additional CSS class names |
| `style` | `React.CSSProperties` | `{}` | Inline styles for the container |

## Advanced Usage with Hook

For more control, use the `useImageSequencePlayer` hook:

```tsx
import { useImageSequencePlayer } from './components/ImageSequencePlayer'

function CustomPlayer() {
  const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg']
  
  const {
    currentImage,
    currentIndex,
    isPlaying,
    play,
    pause,
    reset,
    goToFrame
  } = useImageSequencePlayer(images, {
    speed: 200,
    loop: true,
    autoPlay: false
  })

  return (
    <div>
      <img src={currentImage} alt="Animation frame" />
      
      <div>
        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
        <button onClick={reset}>Reset</button>
        <button onClick={() => goToFrame(0)}>First Frame</button>
        <button onClick={() => goToFrame(images.length - 1)}>Last Frame</button>
      </div>
      
      <p>Current frame: {currentIndex + 1} / {images.length}</p>
    </div>
  )
}
```

## Examples

### Fast Looping Animation (Sprite Effect)
```tsx
<ImageSequencePlayer 
  images={spriteFrames}
  speed={50}      // 50ms per frame = 20 FPS
  loop={true}
  autoPlay={true}
/>
```

### Slow One-time Animation
```tsx
<ImageSequencePlayer 
  images={introSequence}
  speed={500}     // 500ms per frame = 2 FPS
  loop={false}
  autoPlay={true}
  onComplete={() => console.log('Intro finished!')}
/>
```

### Manual Control (No AutoPlay)
```tsx
<ImageSequencePlayer 
  images={tutorialSteps}
  speed={0}       // Speed doesn't matter when not auto-playing
  loop={false}
  autoPlay={false}
/>
```

### Custom Styled Player
```tsx
<ImageSequencePlayer 
  images={frames}
  speed={100}
  loop={true}
  autoPlay={true}
  className="my-custom-player"
  style={{
    maxWidth: '600px',
    margin: '0 auto',
    border: '2px solid #333'
  }}
/>
```

## Styling

The component comes with basic styling for the controls. You can customize it by:

1. **Using className prop**: Add your own CSS classes
2. **Using style prop**: Pass inline styles
3. **Targeting CSS classes**: Override the default `.image-sequence-player` and `.controls` classes

Example CSS:
```css
.my-custom-player img {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.my-custom-player .controls button {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
```

## Performance Tips

1. **Preload images**: Make sure your images are preloaded for smooth playback
2. **Optimize image size**: Use appropriately sized images (not too large)
3. **Use appropriate speed**: Balance between smoothness and performance
4. **Consider image format**: WebP or optimized JPG/PNG for best results

## Use Cases

- 🎬 Frame-by-frame animations
- 🎮 Game sprite animations
- 📖 Tutorial step-throughs
- 🎨 Product showcases (360° views)
- 📸 Stop-motion presentations
- 🖼️ Image galleries with auto-advance
- ⏱️ Loading animations
- 🎭 Animated illustrations

## Browser Support

Works in all modern browsers that support:
- React 16.8+ (Hooks)
- ES6+ features
- CSS3

## License

MIT
