"use client"

import { useEffect, useRef, useState } from "react"

// Cursor customizado com efeito magnético sutil: o anel acompanha o mouse com
// leve atraso (lerp) e cresce ao passar sobre elementos interativos
// (`a`, `button`, `[data-cursor-hover]`). Desativado automaticamente em
// touch/coarse pointers via CSS (`@media (hover: none)`) — ver theme.css.
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let frame: number

    function onMove(event: MouseEvent) {
      mouseX = event.clientX
      mouseY = event.clientY
      if (!active) setActive(true)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      }
    }

    function onOver(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (target.closest("a, button, [data-cursor-hover]")) {
        setHovering(true)
      }
    }

    function onOut(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (target.closest("a, button, [data-cursor-hover]")) {
        setHovering(false)
      }
    }

    function tick() {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      }
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseover", onOver)
    window.addEventListener("mouseout", onOut)
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onOver)
      window.removeEventListener("mouseout", onOut)
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="agencia-cursor-dot"
        data-hovering={hovering}
        style={{ opacity: active ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className="agencia-cursor-ring"
        data-hovering={hovering}
        style={{ opacity: active ? 1 : 0 }}
      />
    </>
  )
}
