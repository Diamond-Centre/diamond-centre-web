/**
 * <img> tolérant aux échecs : essaie `src` (chaîne OU tableau de candidats),
 * puis `fallbackSrc`, puis se masque (le fond en dégradé du parent reste
 * visible, jamais d'icône d'image cassée).
 */
'use client'

import { useEffect, useMemo, useState } from 'react'

export default function SafeImage({
  src = '',
  fallbackSrc = '',
  alt = '',
  className = '',
  style = undefined,
  eager = false,
}) {
  const key = JSON.stringify([src, fallbackSrc])
  const candidates = useMemo(
    () => [].concat(src || [], fallbackSrc || []).filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  )
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [key])

  const current = candidates[index]
  if (!current) return null

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
      onError={() => setIndex((i) => i + 1)}
    />
  )
}