/**
 * Carte événement — DiCe (compacte)
 * Promo complète via popup « Détails de la promotion »
 * -> N'affiche que les champs de promotion réellement renseignés à la création/modification
 *
 * FIX (prod) :
 * - Le modal de promotion est rendu via un React Portal (document.body) pour ne jamais
 *   être piégé par un ancêtre avec `transform` (ex: conteneur de liste animé en framer-motion),
 *   ce qui causait la carte "disparaît/réapparaît" au scroll.
 * - Le scroll du body est verrouillé tant que le modal est ouvert, et restauré proprement
 *   à la fermeture / au démontage.
 *
 * Affichage planning :
 * - Date de début et date de fin affichées séparément (plus de condensé "{spanDays} j").
 * - Heure de début et heure de fin affichées séparément, sur toute la durée de l'événement.
 */
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaTicketAlt,
  FaTimes,
  FaUsers,
  FaVenusMars,
} from 'react-icons/fa'
import { format, differenceInCalendarDays, isValid, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { eventTimingLabel, eventTimingPhase, isEventEnded, timingOverlayClass } from '@/lib/eventTiming'
import { toAbsoluteMediaUrl } from '@/lib/mediaUrl'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

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
  if (!d) return 'Date à confirmer'
  return format(d, 'd MMM yyyy', { locale: fr })
}

function normalizeTime(value: any, fallbackDate: any) {
  if (value && /^\d{1,2}:\d{2}/.test(String(value))) {
    return String(value).slice(0, 5)
  }
  const d = parseDate(fallbackDate)
  if (d) return format(d, 'HH:mm')
  return null
}

function formatPrice(amount: any, currency = 'XAF') {
  const n = Number(amount)
  if (Number.isNaN(n)) return '—'
  try {
    return `${n.toLocaleString('fr-FR')} ${currency}`
  } catch {
    return `${n} ${currency}`
  }
}

function sexeLabel(sexe: any) {
  const map: Record<string, string> = {
    homme: 'Hommes',
    femme: 'Femmes',
  }
  return map[String(sexe || '').toLowerCase().trim()] || null
}

/**
 * Verrouille le scroll du body tant que `locked` est true.
 * Compense la largeur de la scrollbar pour éviter un "jump" de layout.
 */
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth
    const { overflow, paddingRight } = document.body.style

    document.body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [locked])
}

/**
 * Portail SSR-safe : ne rend rien côté serveur, monte dans document.body côté client.
 */
function ModalPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return createPortal(children, document.body)
}

function PromotionModal({
  open,
  onClose,
  promotion,
  price,
  promoPrice,
  currency,
  eventTitle,
}: any) {
  useBodyScrollLock(open)

  if (!promotion) return null

  const pct = Number(promotion?.pourcentage) || 0

  // --- On ne considère QUE ce qui a été réellement renseigné ---
  const places = Number(promotion?.nombre)
  const hasPlaces =
    promotion?.nombre !== null &&
    promotion?.nombre !== undefined &&
    Number.isFinite(places) &&
    places > 0

  const days = Number(promotion?.duree)
  const hasDays =
    promotion?.duree !== null &&
    promotion?.duree !== undefined &&
    Number.isFinite(days) &&
    days > 0

  const sexeVal = String(promotion?.sexe || '').toLowerCase().trim()
  const hasSexe = sexeVal === 'homme' || sexeVal === 'femme'
  const sexeLbl = sexeLabel(sexeVal)

  const desc = promotion?.description?.trim() || ''
  const isDefaultDesc =
    desc.toLowerCase().startsWith('réduction de') ||
    desc.toLowerCase().startsWith('reduction de')
  const hasDescription = Boolean(desc) && !isDefaultDesc

  const finalPrice =
    promotion?.prix_promo != null ? promotion.prix_promo : promoPrice
  const savings = Math.max(0, Number(price) - Number(finalPrice))

  return (
    <ModalPortal>
      <AnimatePresence>
        {open ? (
          <div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={onClose}
            role="presentation"
          >
            <motion.div
              {...({
                role: 'dialog',
                'aria-modal': 'true',
                'aria-labelledby': 'promo-modal-title',
                className:
                  'max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-md sm:rounded-3xl',
              } as any)}
              initial={{ y: 36, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 36, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-[#FFB020] to-[#E89A00] px-5 pb-6 pt-5 text-white">
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
                      Offre promotionnelle
                    </p>
                    <h3
                      id="promo-modal-title"
                      className="mt-1 text-xl font-extrabold leading-snug"
                    >
                      −{pct}% sur cet événement
                    </h3>
                    {eventTitle ? (
                      <p className="mt-1 line-clamp-2 text-sm text-white/85">
                        {eventTitle}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-white/20 p-2 transition hover:bg-white/30"
                    aria-label="Fermer"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="space-y-4 px-5 py-5">
                {hasDescription ? (
                  <p className="rounded-2xl bg-[#FFF8EB] px-4 py-3 text-sm leading-relaxed text-[#0B1220]">
                    {promotion.description}
                  </p>
                ) : null}

                {hasPlaces || hasDays || hasSexe || pct > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {pct > 0 ? (
                      <div className="rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                          Remise
                        </p>
                        <p className="mt-1 text-lg font-extrabold text-[#B78103]">
                          −{pct}%
                        </p>
                      </div>
                    ) : null}

                    {hasPlaces ? (
                      <div className="rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                          Places promo
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-extrabold text-[#0B1220]">
                          <FaTicketAlt className="text-sm text-[#0A89F2]" />
                          {places}
                        </p>
                      </div>
                    ) : null}

                    {hasDays ? (
                      <div className="rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                          Durée
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-extrabold text-[#0B1220]">
                          <FaClock className="text-sm text-[#0A89F2]" />
                          {days} {days > 1 ? 'jours' : 'jour'}
                        </p>
                      </div>
                    ) : null}

                    {hasSexe ? (
                      <div className="rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                          Public
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-base font-extrabold text-[#0B1220]">
                          <FaVenusMars className="text-sm text-[#0A89F2]" />
                          {sexeLbl}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-[#E8EEF5] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#98A2B3]">
                    Tarif
                  </p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-extrabold tabular-nums text-[#0B9B6B]">
                      {formatPrice(finalPrice, currency)}
                    </span>
                    <span className="text-sm text-[#98A2B3] line-through">
                      {formatPrice(price, currency)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[#0B9B6B]">
                    Vous économisez {formatPrice(savings, currency)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl bg-[#0A89F2] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0770cc]"
                >
                  Compris
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </ModalPortal>
  )
}

export interface EventCardProps {
  event: any
  className?: string
  onReserve?: (event: any) => void
  showReserveButton?: boolean
  index?: number
}

export default function EventCard({
  event,
  className,
  onReserve,
  showReserveButton = true,
  index = 0,
}: EventCardProps) {
  const { isAuthenticated } = useAuth()
  const [imgError, setImgError] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)
  const [currentImg, setCurrentImg] = useState(0)

  const {
    id,
    title,
    description,
    image_url,
    price,
    currency = 'XAF',
    start_date,
    end_date,
    start_time,
    end_time,
    location,
    category,
    capacity,
    available_tickets,
    status,
    promotion,
  } = event

  const timingEvent = { end_date, start_date }
  const isPast = isEventEnded(timingEvent)
  const timingPhase = eventTimingPhase(timingEvent)
  const timingLabel = eventTimingLabel(timingEvent)

  const placesRestantes =
    available_tickets != null
      ? Number(available_tickets)
      : Math.max(0, Number(capacity || 0) - Number(event.nb_inscrits || 0))

  const isFull = placesRestantes <= 0
  const isPublished = !status || status === 'published'

  // Une promotion n'est considérée valide que si la réduction (%) a été renseignée
  // OU qu'un prix promo explicite (inférieur au prix normal) a été défini.
  const promoPct = Number(promotion?.pourcentage) || 0
  const hasPromoPrice =
    promotion?.prix_promo !== null &&
    promotion?.prix_promo !== undefined &&
    Number.isFinite(Number(promotion.prix_promo)) &&
    Number(promotion.prix_promo) < Number(price)
  const hasPromotion = Boolean(promotion && (promoPct > 0 || hasPromoPrice))

  const promoPrice = hasPromotion
    ? hasPromoPrice
      ? Number(promotion.prix_promo)
      : Math.round(Number(price) - (Number(price) * promoPct) / 100)
    : Number(price)

  const images = [image_url, image_url, image_url].filter(Boolean)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [images.length])

  const startT = normalizeTime(start_time, start_date)
  const endT = normalizeTime(end_time, end_date || start_date)

  const dayStart = parseDate(start_date)
  const dayEnd = parseDate(end_date)
  const spanDays =
    dayStart && dayEnd
      ? Math.max(1, differenceInCalendarDays(dayEnd, dayStart) + 1)
      : 1

  // Affichage explicite : la date de fin n'est montrée que si elle diffère
  // de la date de début (évite la redondance "12 juin 2026 → 12 juin 2026").
  const sameDay =
    dayStart && dayEnd
      ? formatDay(dayStart) === formatDay(dayEnd)
      : spanDays <= 1

  const canReserve = !isPast && !isFull

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

  if (!isPublished) return null

  const dayNum = dayStart ? format(dayStart, 'd') : '—'
  const monthLabel = dayStart ? format(dayStart, 'MMM', { locale: fr }) : ''

  return (
    <>
      <article className="event-listing-card" style={{ animationDelay: `${index * 0.12}s` }}>
        <div className="listing-media">
          <div className="listing-media-slider" style={{ transform: `translateX(-${currentImg * 100}%)` }}>
            {images.length > 0 && !imgError ? (
              images.map((imgUrl, i) => (
                <div key={i} className="listing-media-slide">
                  <img
                    src={toAbsoluteMediaUrl(imgUrl) ?? undefined}
                    alt={title || 'Événement DiCe'}
                    onError={() => setImgError(true)}
                  />
                </div>
              ))
            ) : (
              <div className="listing-media-slide" style={{ background: 'linear-gradient(to bottom right, rgba(10,137,242,0.2), #080E1E)' }} />
            )}
          </div>
          <span className="listing-type">{category || 'Événement'}</span>
          {hasPromotion && promoPct > 0 && <span className="listing-promo">−{promoPct}%</span>}
          
          {images.length > 1 && !imgError && (
            <div className="listing-dots">
              {images.map((_, i) => (
                <i key={i} className={currentImg === i ? 'active' : ''} />
              ))}
            </div>
          )}
        </div>
        
        <div className="listing-body">
          <div className="listing-date">
             {dayNum} {monthLabel} {dayStart ? format(dayStart, 'yyyy') : ''}
          </div>
          <h3>{title || 'Événement DiCe'}</h3>
          <p>{description || 'Découvrez notre prochain événement exceptionnel.'}</p>
          
          <div className="listing-meta">
            {location && (
              <span>⌖ <b>{location}</b></span>
            )}
            {(startT || endT) && (
              <span>◷ <b>{startT && endT ? `${startT} — ${endT}` : startT || endT}</b></span>
            )}
            <span>♙ <b>{isFull ? 'Complet' : `${placesRestantes} places`}</b></span>
          </div>
          
          <div className="listing-bottom">
            <div>
              <small>À PARTIR DE</small>
              <strong>{hasPromotion ? formatPrice(promoPrice, currency) : (Number(price) === 0 ? 'Gratuit' : formatPrice(price, currency))}</strong>
            </div>
            
            {showReserveButton ? (
              <button onClick={handleReserve} disabled={!canReserve}>
                {isPast ? 'Passé' : isFull ? 'Complet' : 'Réserver'} <span>→</span>
              </button>
            ) : (
              <button onClick={() => window.location.href = `/events/${id}`}>
                Voir <span>→</span>
              </button>
            )}
          </div>
        </div>
      </article>

      <PromotionModal
        open={promoOpen}
        onClose={() => setPromoOpen(false)}
        promotion={promotion}
        price={price}
        promoPrice={promoPrice}
        currency={currency}
        eventTitle={title}
      />
    </>
  )
}
