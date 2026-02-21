import { useState, useEffect, useRef } from 'react'

export interface ImageSequencePlayerProps {
  images: string[]
  speed?: number // milliseconds per frame, default 100ms
  loop?: boolean // whether to loop the animation, default true
  autoPlay?: boolean // whether to start playing immediately, default true
  onComplete?: () => void // callback when sequence completes (only fires when loop is false)
  className?: string
  style?: React.CSSProperties
}

export const ImageSequencePlayer = ({
  images,
  speed = 100,
  loop = true,
  autoPlay = true,
  onComplete,
  className = '',
  style = {}
}: ImageSequencePlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isPlaying || images.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        
        if (nextIndex >= images.length) {
          if (loop) {
            return 0
          } else {
            setIsPlaying(false)
            if (onComplete) onComplete()
            return prevIndex
          }
        }
        
        return nextIndex
      })
    }, speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, images.length, speed, loop, onComplete])

  if (images.length === 0) {
    return <div className={className} style={style}>No images provided</div>
  }

  return (
    <div className={`image-sequence-player ${className}`} style={style}>
      <img 
        src={images[currentIndex]} 
        alt={`Frame ${currentIndex + 1} of ${images.length}`}
        style={{ 
          width: '100vw', 
          height: '100vh', 
          objectFit: 'contain', 
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0
        }}
      />
      {/* <div className="controls" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {!isPlaying ? (
          <button onClick={play}>▶ Play</button>
        ) : (
          <button onClick={pause}>⏸ Pause</button>
        )}
        <button onClick={reset}>↻ Reset</button>
        <span style={{ padding: '0.5rem' }}>
          Frame: {currentIndex + 1} / {images.length}
        </span>
      </div> */}
    </div>
  )
}
