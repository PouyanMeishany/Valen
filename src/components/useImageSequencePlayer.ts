import { useState, useEffect, useRef } from 'react'

export interface UseImageSequencePlayerOptions {
  speed?: number
  loop?: boolean
  autoPlay?: boolean
  onComplete?: () => void
}

export const useImageSequencePlayer = (
  images: string[],
  options: UseImageSequencePlayerOptions = {}
) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(options.autoPlay ?? true)
  const intervalRef = useRef<number | null>(null)

  const speed = options.speed ?? 100
  const loop = options.loop ?? true

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
            if (options.onComplete) options.onComplete()
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
  }, [isPlaying, images.length, speed, loop, options])

  return {
    currentImage: images[currentIndex] || '',
    currentIndex,
    isPlaying,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    reset: () => {
      setCurrentIndex(0)
      setIsPlaying(options.autoPlay ?? true)
    },
    goToFrame: (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index)
      }
    }
  }
}
