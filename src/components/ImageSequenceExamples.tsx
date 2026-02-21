import { ImageSequencePlayer } from './ImageSequencePlayer'
import { useImageSequencePlayer } from './useImageSequencePlayer'

// Example 1: Basic usage
export const BasicExample = () => {
  const images = [
    '/frame1.jpg',
    '/frame2.jpg',
    '/frame3.jpg',
  ]

  return (
    <ImageSequencePlayer 
      images={images}
      speed={150}
      loop={true}
      autoPlay={true}
    />
  )
}

// Example 2: Slow animation with no loop
export const SlowNonLoopingExample = () => {
  const images = [
    '/intro1.png',
    '/intro2.png',
    '/intro3.png',
    '/intro4.png',
  ]

  return (
    <ImageSequencePlayer 
      images={images}
      speed={500}
      loop={false}
      autoPlay={true}
      onComplete={() => console.log('Animation completed!')}
    />
  )
}

// Example 3: Fast looping animation
export const FastLoopingExample = () => {
  const images = [
    '/sprite1.png',
    '/sprite2.png',
    '/sprite3.png',
    '/sprite4.png',
    '/sprite5.png',
  ]

  return (
    <ImageSequencePlayer 
      images={images}
      speed={50}
      loop={true}
      autoPlay={true}
    />
  )
}

// Example 4: Using the hook for custom control
export const CustomControlExample = () => {
  const images = [
    '/custom1.jpg',
    '/custom2.jpg',
    '/custom3.jpg',
  ]

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
    <div style={{ textAlign: 'center' }}>
      <img 
        src={currentImage} 
        alt={`Frame ${currentIndex + 1}`}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
      />
      
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {!isPlaying ? (
          <button onClick={play}>▶ Play</button>
        ) : (
          <button onClick={pause}>⏸ Pause</button>
        )}
        <button onClick={reset}>↻ Reset</button>
        <button onClick={() => goToFrame(0)}>⏮ First</button>
        <button onClick={() => goToFrame(images.length - 1)}>⏭ Last</button>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        Frame: {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

// Example 5: Multiple animations side by side
export const MultipleAnimationsExample = () => {
  const animation1 = ['/anim1-1.jpg', '/anim1-2.jpg', '/anim1-3.jpg']
  const animation2 = ['/anim2-1.jpg', '/anim2-2.jpg', '/anim2-3.jpg']

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h3>Animation 1</h3>
        <ImageSequencePlayer 
          images={animation1}
          speed={100}
          loop={true}
          autoPlay={true}
        />
      </div>
      <div>
        <h3>Animation 2</h3>
        <ImageSequencePlayer 
          images={animation2}
          speed={200}
          loop={true}
          autoPlay={true}
        />
      </div>
    </div>
  )
}
