'use client'

import React, { useEffect, useRef } from 'react'

const Star = ({ x, y, size, opacity }: { x: number; y: number; size: number; opacity: number }) => (
  <div
    className="absolute rounded-full bg-white"
    style={{
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: opacity,
    }}
  />
)

export default function StarsAnimation() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const createStar = () => {
      const x = Math.random() * canvas.clientWidth
      const y = Math.random() * canvas.clientHeight
      const size = Math.random() * 2 + 1
      const speed = Math.random() * 0.5 + 0.1
      const opacity = Math.random() * 0.8 + 0.2
      return { x, y, size, speed, opacity }
    }

    const initStars = () => {
      starsRef.current = Array.from({ length: 100 }, createStar)
    }

    const animateStars = () => {
      starsRef.current = starsRef.current.map(star => {
        star.y += star.speed
        if (star.y > canvas.clientHeight) {
          star.y = 0
        }
        return star
      })
      setStars([...starsRef.current])
    }

    initStars()
    const intervalId = setInterval(animateStars, 50)

    return () => clearInterval(intervalId)
  }, [])

  const [stars, setStars] = React.useState<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([])

  return (
    <div ref={canvasRef} className="fixed h-48 inset-0 overflow-hidden">
      {stars.map((star, index) => (
        <Star key={index} x={star.x} y={star.y} size={star.size} opacity={star.opacity} />
      ))}
    </div>
  )
}

