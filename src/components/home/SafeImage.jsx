/**
 * <img> tolérant aux échecs : essaie `src`, puis `fallbackSrc`, puis se masque
 * (le fond en dégradé du parent reste visible, jamais d'icône d'image cassée).
 */
'use client'

import { useEffect, useState } from 'react'

export default function SafeImage({
  src = '',
  fallbackSrc = '',
  alt = '',
  className = '',
  style = undefined,
  eager = false,
}) {
  const [current, setCurrent] = useState(src || fallbackSrc)
  const [failed, setFailed] = useState(!(src || fallbackSrc))

  useEffect(() => {
    const next = src || fallbackSrc
    setCurrent(next)
    setFailed(!next)
  }, [src, fallbackSrc])

  if (failed || !current) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      style={style}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) {
          setCurrent(fallbackSrc)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}