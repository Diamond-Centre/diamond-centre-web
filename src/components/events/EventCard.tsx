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
import Image from 'next/image'
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
      <motion.article
        {...({
          className: cn(
            'group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E8EEF5] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.045)] transition-shadow duration-300 hover:border-[#0A89F2]/30 hover:shadow-[0_14px_32px_rgba(10,137,242,0.12)]',
            className
          ),
        } as any)}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: Math.min(index * 0.04, 0.2),
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -3 }}
      >
        {/* Media — shorter */}
        <div className="relative h-40 shrink-0 overflow-hidden bg-[#0B1220]">
          {image_url && !imgError ? (
            <Image
              src={image_url}
              alt={title || 'Événement DiCe'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              onError={() => setImgError(true)}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A89F2] via-[#0870cc] to-[#003f8a]">
              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-2.5 left-2.5 flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-white text-[#0A89F2] shadow-md">
            <span className="text-base font-extrabold leading-none">{dayNum}</span>
            <span className="text-[9px] font-semibold uppercase text-[#667085]">
              {monthLabel}
            </span>
          </div>

          <div className="absolute left-2.5 top-2.5">
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold capitalize text-[#0B1220] shadow-sm">
              {category || 'Événement'}
            </span>
          </div>

          <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1.5">
            {hasPromotion && promoPct > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFB020] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                <FaTag className="text-[8px]" />−{promoPct}%
              </span>
            ) : null}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${timingOverlayClass(timingPhase)}`}>
              {timingLabel}
            </span>
            {!isPast && isFull ? (
              <span className="rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                Complet
              </span>
            ) : null}
          </div>
        </div>

        {/* Body — compact */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <h3 className="line-clamp-2 text-[0.95rem] font-bold leading-snug text-[#0B1220] transition-colors group-hover:text-[#0A89F2]">
            {title || 'Événement DiCe'}
          </h3>

          {description ? (
            <p className="line-clamp-1 text-sm text-[#667085]">{description}</p>
          ) : null}

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#667085]">
            {location ? (
              <span className="inline-flex max-w-full items-center gap-1 truncate">
                <FaMapMarkerAlt className="shrink-0 text-[10px] text-[#0A89F2]" />
                <span className="truncate">{location}</span>
              </span>
            ) : null}

            {/* Date de fin — affichée uniquement si différente de la date de début */}
            {!sameDay ? (
              <span className="inline-flex items-center gap-1">
                <FaCalendarAlt className="text-[10px] text-[#0A89F2]" />
                Fin : {formatDay(end_date)}
              </span>
            ) : null}

            {/* Heure de début / heure de fin */}
            {startT || endT ? (
              <span className="inline-flex items-center gap-1">
                <FaClock className="text-[10px] text-[#0A89F2]" />
                {startT && endT ? `${startT} – ${endT}` : startT || endT}
              </span>
            ) : null}

            <span className="inline-flex items-center gap-1">
              <FaUsers className="text-[10px] text-[#0A89F2]" />
              {isFull ? 'Complet' : `${placesRestantes} pl.`}
            </span>
          </div>

          {hasPromotion ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setPromoOpen(true)
              }}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#FFE2A8] bg-[#FFF8EB] px-3 py-1.5 text-xs font-semibold text-[#B78103] transition hover:bg-[#FFEFCC]"
            >
              <FaTag className="text-[10px]" />
              Détails de la promotion
              <FaArrowRight className="text-[9px]" />
            </button>
          ) : null}

          <div className="mt-auto border-t border-[#F0F2F5] pt-3">
            <div className="mb-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98A2B3]">
                Tarif
              </p>
              {hasPromotion ? (
                <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
                  <span className="text-lg font-extrabold tabular-nums text-[#0A89F2]">
                    {formatPrice(promoPrice, currency)}
                  </span>
                  <span className="text-xs text-[#98A2B3] line-through">
                    {formatPrice(price, currency)}
                  </span>
                </div>
              ) : (
                <p className="mt-0.5 text-lg font-extrabold tabular-nums text-[#0A89F2]">
                  {Number(price) === 0 ? 'Gratuit' : formatPrice(price, currency)}
                </p>
              )}
            </div>

            {showReserveButton ? (
              <button
                type="button"
                onClick={handleReserve}
                disabled={!canReserve}
                className={cn(
                  'inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition',
                  canReserve
                    ? 'bg-[#0A89F2] text-white shadow-[0_8px_20px_rgba(10,137,242,0.25)] hover:bg-[#0770cc]'
                    : 'cursor-not-allowed bg-[#F3F6FA] text-[#98A2B3]'
                )}
              >
                {isPast ? 'Passé' : isFull ? 'Complet' : 'Réserver'}
                {canReserve ? <FaTicketAlt className="text-xs" /> : null}
              </button>
            ) : (
              <Link
                href={`/events/${id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8EEF5] py-2.5 text-sm font-semibold text-[#0B1220] transition hover:border-[#0A89F2]/40 hover:text-[#0A89F2]"
              >
                Voir l'événement
                <FaArrowRight className="text-xs" />
              </Link>
            )}
          </div>
        </div>
      </motion.article>

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
