/**
 * Événements à venir — refonte DiCe
 * Mêmes props / mêmes données que l'ancienne version (events, loading, onReserve).
 * Carte blanche par défaut, bleu foncé uniquement au survol (souris ou focus clavier),
 * pagination par points, entrée animée GSAP ScrollTrigger.
 */
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { FaSpinner } from 'react-icons/fa'
import { FiArrowRight, FiClock, FiMapPin, FiUsers } from 'react-icons/fi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { format, isValid, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { isEventEnded } from '@/lib/eventTiming'
import { toAbsoluteMediaUrl } from '@/lib/mediaUrl'
import { HOME_IMAGES } from '@/lib/homeImages'
import SafeImage from '@/components/home/SafeImage'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface FormationsSectionProps {
  events?: any[]
  loading?: boolean
  onReserve?: (event: any) => void
}

/* ------------------------------------------------------------------ */
/* Helpers (mêmes règles que EventCard)                               */
/* ------------------------------------------------------------------ */

function parseDate(value: any) {
  if (!value) return null
  if (value instanceof Date) return isValid(value) ? value : null
  const iso = parseISO(String(value))
  if (isValid(iso)) return iso
  const d = new Date(value)
  return isValid(d) ? d : null
}

function formatDay(value: any) {
  const d = parseDate(value)
  if (!d) return 'DATE À CONFIRMER'
  return format(d, 'd MMM yyyy', { locale: fr }).replace(/\./g, '').toUpperCase()
}

function normalizeTime(value: any, fallbackDate: any) {
  if (value && /^\d{1,2}:\d{2}/.test(String(value))) return String(value).slice(0, 5)
  const d = parseDate(fallbackDate)
  return d ? format(d, 'HH:mm') : null
}

const toHourLabel = (t: string | null) => (t ? t.replace(':', 'h') : null)

function currencyLabel(currency: any) {
  const c = String(currency || 'XAF').toUpperCase()
  return c === 'XAF' || c === 'XOF' ? 'FCFA' : c
}

function formatAmount(amount: any) {
  const n = Number(amount)
  if (Number.isNaN(n)) return '—'
  try {
    return n.toLocaleString('fr-FR')
  } catch {
    return String(n)
  }
}

const strip = (s: any) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

type Tone = 'blue' | 'cyan' | 'violet'

function categoryMeta(category: any): { label: string; tone: Tone; fallback: string } {
  const k = strip(category)
  if (k.startsWith('conf'))
    return { label: 'CONFÉRENCE', tone: 'blue', fallback: HOME_IMAGES.eventFallbacks.conference }
  if (k.startsWith('form'))
    return { label: 'FORMATION', tone: 'cyan', fallback: HOME_IMAGES.eventFallbacks.formation }
  if (k.startsWith('ateli') || k.startsWith('work'))
    return { label: 'ATELIER', tone: 'violet', fallback: HOME_IMAGES.eventFallbacks.atelier }
  if (k.startsWith('semin'))
    return { label: 'SÉMINAIRE', tone: 'cyan', fallback: HOME_IMAGES.eventFallbacks.default }
  return {
    label: category ? String(category).toUpperCase() : 'ÉVÉNEMENT',
    tone: 'blue',
    fallback: HOME_IMAGES.eventFallbacks.default,
  }
}

const TONE_CLASSES: Record<Tone, string> = {
  blue: 'border-[#2f6dff]/70 bg-[#2f6dff]/10 text-[#4f8dff]',
  cyan: 'border-[#22d3ee]/70 bg-[#22d3ee]/10 text-[#22d3ee]',
  violet: 'border-[#8b5cf6]/70 bg-[#8b5cf6]/10 text-[#8b5cf6]',
}

/* ------------------------------------------------------------------ */
/* Carte                                                              */
/* ------------------------------------------------------------------ */

function HomeEventCard({
  event,
  active,
  onHover,
  onLeave,
  onReserve,
}: {
  event: any
  active: boolean
  onHover: () => void
  onLeave: () => void
  onReserve?: (event: any) => void
}) {
  const { isAuthenticated } = useAuth()

  const {
    id,
    title,
    description,
    image_url,
    price = 0,
    currency = 'XAF',
    start_date,
    end_date,
    start_time,
    end_time,
    location,
    category,
    capacity,
    available_tickets,
    promotion,
  } = event || {}

  const meta = categoryMeta(category)

  const placesRestantes =
    available_tickets != null
      ? Number(available_tickets)
      : Math.max(0, Number(capacity || 0) - Number(event?.nb_inscrits || 0))
  const isFull = placesRestantes <= 0
  const isPast = isEventEnded(event)
  const canReserve = !isPast && !isFull

  const promoPct = Number(promotion?.pourcentage) || 0
  const hasPromoPrice =
    promotion?.prix_promo !== null &&
    promotion?.prix_promo !== undefined &&
    Number.isFinite(Number(promotion.prix_promo)) &&
    Number(promotion.prix_promo) < Number(price)
  const hasPromotion = Boolean(promotion && (promoPct > 0 || hasPromoPrice))
  const finalPrice = hasPromotion
    ? hasPromoPrice
      ? Number(promotion.prix_promo)
      : Math.round(Number(price) - (Number(price) * promoPct) / 100)
    : Number(price)

  // Badge (haut droite) : promo > complet > dernières places
  let badge: { text: string; className: string } | null = null
  if (hasPromotion && promoPct > 0) {
    const endRaw = promotion?.date_fin || promotion?.end_date || promotion?.valid_until
    const endD = parseDate(endRaw)
    const suffix = endD
      ? ` avant le ${format(endD, 'd MMM', { locale: fr }).replace(/\./g, '')}`
      : ''
    badge = {
      text: `-${promoPct}%${suffix}`,
      className: 'border-[#22e07a]/60 bg-[#0d3b26]/70 text-[#22e07a]',
    }
  } else if (isFull) {
    badge = { text: 'Complet', className: 'border-[#ff5a5a]/60 bg-[#3b1418]/60 text-[#ff6b6b]' }
  } else if (
    !isPast &&
    (placesRestantes <= 15 || (Number(capacity) > 0 && placesRestantes / Number(capacity) <= 0.2))
  ) {
    badge = {
      text: 'Dernières places',
      className: 'border-[#ff5a5a]/60 bg-[#3b1418]/40 text-[#ff6b6b]',
    }
  }

  const startT = toHourLabel(normalizeTime(start_time, start_date))
  const endT = toHourLabel(normalizeTime(end_time, end_date || start_date))
  const timeLabel = startT && endT ? `${startT} — ${endT}` : startT || 'Horaire à confirmer'

  const handleReserve = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver')
      return
    }
    if (onReserve) {
      onReserve(event)
      return
    }
    window.location.href = `/events/${id}`
  }

  const priceText = Number(price) === 0 ? 'Gratuit' : `${formatAmount(finalPrice)} ${currencyLabel(currency)}`

  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      className={`relative flex min-h-[551px] flex-col overflow-hidden rounded-[22px] border-[1.5px] transition-all duration-500 ease-out ${
        active
          ? 'border-[#176bff] bg-[linear-gradient(180deg,#0b2255_0%,#0e2861_100%)] shadow-[0_0_0_1px_rgba(23,107,255,0.25),0_30px_70px_-22px_rgba(23,107,255,0.6)]'
          : 'border-[#88b4fe] bg-[linear-gradient(180deg,#f3f9fe_0%,#e9f4fc_100%)] shadow-[0_24px_50px_-34px_rgba(20,80,160,0.35)]'
      }`}
    >
      {/* Image */}
      <div className="relative h-[210px] w-full shrink-0 overflow-hidden bg-[linear-gradient(135deg,#0a1e52,#123a8f)]">
        <SafeImage
          src={toAbsoluteMediaUrl(image_url) ?? undefined}
          fallbackSrc={meta.fallback}
          alt={title || ''}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            active ? 'scale-105' : 'scale-100'
          }`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            active
              ? 'bg-[linear-gradient(180deg,rgba(6,26,69,0.35),rgba(6,26,69,0.55))] opacity-100'
              : 'opacity-0'
          }`}
        />
        <span
          className={`absolute left-3 top-3 rounded-[3px] border px-[10px] py-[5px] text-[10.5px] font-semibold uppercase tracking-[0.2em] backdrop-blur-[2px] ${TONE_CLASSES[meta.tone]}`}
        >
          {meta.label}
        </span>
        {badge && (
          <span
            className={`absolute right-3 top-3 rounded-[3px] border px-[10px] py-[5px] text-[10.5px] font-semibold tracking-[0.02em] ${badge.className}`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {/* Corps */}
      <div className="flex flex-1 flex-col px-[21px] pb-[26px] pt-[20px]">
        <p
          className={`text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-500 ${
            active ? 'text-[#5f7fc0]/70' : 'text-[#8a94a6]'
          }`}
        >
          {formatDay(start_date)}
        </p>

        <h3
          className={`mt-[10px] font-barlow text-[22px] font-bold leading-[25px] transition-colors duration-500 ${
            active ? 'text-white' : 'text-[#0a1330]'
          }`}
        >
          {id ? (
            <Link href={`/events/${id}`} className="hover:underline decoration-1 underline-offset-4">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        <p
          className={`mt-[10px] line-clamp-2 min-h-[42px] text-[13px] leading-[21px] transition-colors duration-500 ${
            active ? 'text-white/70' : 'text-[#667085]'
          }`}
        >
          {description}
        </p>

        <div className="flex-1" />

        <ul
          className={`mt-5 space-y-[9px] border-t pt-[18px] text-[12.5px] transition-colors duration-500 ${
            active ? 'border-white/15 text-[#cfdcff]' : 'border-[#0a1330]/10 text-[#4a5a75]'
          }`}
        >
          <li className="flex items-center gap-3">
            <FiMapPin className={`shrink-0 text-[14px] ${active ? 'text-[#7ea6ff]' : 'text-[#0b3a8f]'}`} />
            <span className="line-clamp-1">{location || 'Lieu à confirmer'}</span>
          </li>
          <li className="flex items-center gap-3">
            <FiClock className={`shrink-0 text-[14px] ${active ? 'text-[#7ea6ff]' : 'text-[#0b3a8f]'}`} />
            <span>{timeLabel}</span>
          </li>
          <li className="flex items-center gap-3">
            <FiUsers className={`shrink-0 text-[14px] ${active ? 'text-[#7ea6ff]' : 'text-[#0b3a8f]'}`} />
            <span>
              {isFull ? 'Complet' : `${placesRestantes} place${placesRestantes > 1 ? 's' : ''} disponible${placesRestantes > 1 ? 's' : ''}`}
            </span>
          </li>
        </ul>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.16em] ${
                active ? 'text-[#5f7fc0]/70' : 'text-[#8a94a6]'
              }`}
            >
              À partir de
            </p>
            <p
              className={`mt-1 font-barlow text-[21px] font-bold leading-none transition-colors duration-500 ${
                active ? 'text-white' : 'text-[#0a1330]'
              }`}
            >
              {priceText}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReserve}
            disabled={!canReserve}
            className={`h-[38px] rounded-[4px] px-[18px] text-[13px] font-semibold tracking-[0.02em] transition-all duration-300 disabled:cursor-not-allowed ${
              active
                ? 'bg-[linear-gradient(90deg,#2d65ff,#7352ff)] text-white shadow-[0_10px_24px_-10px_rgba(80,90,255,0.9)] hover:brightness-110 disabled:opacity-50'
                : 'bg-white/60 text-[#0a1330] hover:bg-white disabled:opacity-50'
            }`}
          >
            {isPast ? 'Passé' : isFull ? 'Complet' : 'Réserver'}
          </button>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                            */
/* ------------------------------------------------------------------ */

export default function FormationsSection({
  events = [],
  loading = false,
  onReserve,
}: FormationsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  const list = useMemo(() => (Array.isArray(events) ? events.slice(0, 3) : []), [events])

  // Aucune carte n'est "active" (bleu foncé) au chargement : toutes restent
  // dans leur état blanc par défaut. Seul le survol (ou le focus clavier)
  // d'une carte la fait passer en bleu foncé.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Entrées animées (identiques dans l'esprit à l'ancienne version)
  useEffect(() => {
    if (loading) return undefined

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          }
        )
      }
      if (gridRef.current && list.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.16,
            ease: 'power4.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading, list.length])

  return (
    <section
      id="evenements"
      ref={sectionRef}
      className="dice-light relative overflow-hidden py-[104px] font-outfit md:pb-[120px]"
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-6">
        {/* En-tête */}
        <div ref={headerRef}>
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-[#2f6dff]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2f6dff]">
              Événements
            </span>
          </div>

          <h2
            className="mt-[26px] font-barlow font-bold leading-[0.95] tracking-[-0.005em] text-[#0a1330]"
            style={{ fontSize: 'var(--dice-h2-events)' }}
          >
            Des opportunités pour
            <br />
            <span className="text-[#2979ff]">grandir ensemble.</span>
          </h2>

          <p className="mt-5 max-w-[500px] text-[15px] leading-[25px] text-[#5b6b85]">
            Réservez votre place aux prochaines conférences, formations et ateliers DiCe.
          </p>
        </div>

        {/* Contenu */}
        <div className="mt-16">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <FaSpinner className="animate-spin text-4xl text-[#2f6dff]" />
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-[22px] border-[1.5px] border-[#88b4fe] bg-white/60 px-6 py-20 text-center backdrop-blur">
              <p className="font-barlow text-2xl font-bold text-[#0a1330]">
                Aucun événement à venir pour le moment
              </p>
              <p className="mx-auto mt-2 max-w-md text-[14px] text-[#5b6b85]">
                Revenez bientôt : de nouvelles conférences, formations et ateliers seront annoncés.
              </p>
            </div>
          ) : (
            <>
              <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {list.map((event: any, i: number) => (
                  <HomeEventCard
                    key={event.id ?? i}
                    event={event}
                    active={i === hoveredIndex}
                    onHover={() => setHoveredIndex(i)}
                    onLeave={() => setHoveredIndex((prev) => (prev === i ? null : prev))}
                    onReserve={onReserve}
                  />
                ))}
              </div>

              <div className="mt-[43px] flex items-center justify-between">
                <div className="flex items-center gap-2" role="tablist" aria-label="Événements">
                  {list.map((event: any, i: number) => (
                    <button
                      key={event.id ?? i}
                      type="button"
                      role="tab"
                      aria-selected={i === hoveredIndex}
                      aria-label={`Événement ${i + 1}`}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex((prev) => (prev === i ? null : prev))}
                      onFocus={() => setHoveredIndex(i)}
                      onBlur={() => setHoveredIndex((prev) => (prev === i ? null : prev))}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        i === hoveredIndex ? 'w-7 bg-[#0a5cff]' : 'w-2 bg-[#a9c3e8] hover:bg-[#7ea6ff]'
                      }`}
                    />
                  ))}
                </div>

                <Link
                  href="/events"
                  className="group inline-flex items-center gap-2 text-[14px] font-medium text-[#3b4a66] transition-colors hover:text-[#0a5cff]"
                >
                  Voir tous les événements
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
