import { useState } from 'react'
import Link from 'next/link'
import { FaSpinner } from 'react-icons/fa'
import { format, isValid, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { isEventEnded } from '@/lib/eventTiming'
import { toAbsoluteMediaUrl } from '@/lib/mediaUrl'
import { HOME_IMAGES } from '@/lib/homeImages'

export interface FormationsSectionProps {
  events?: any[]
  loading?: boolean
  onReserve?: (event: any) => void
}

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

function categoryMeta(category: any) {
  const k = strip(category)
  if (k.startsWith('conf')) return { label: 'CONFÉRENCE', fallback: HOME_IMAGES.eventFallbacks.conference }
  if (k.startsWith('form')) return { label: 'FORMATION', fallback: HOME_IMAGES.eventFallbacks.formation }
  if (k.startsWith('ateli') || k.startsWith('work')) return { label: 'ATELIER', fallback: HOME_IMAGES.eventFallbacks.atelier }
  if (k.startsWith('semin')) return { label: 'SÉMINAIRE', fallback: HOME_IMAGES.eventFallbacks.default }
  return { label: category ? String(category).toUpperCase() : 'ÉVÉNEMENT', fallback: HOME_IMAGES.eventFallbacks.default }
}

const COLORS = ['#0057FF', '#00C8FF', '#8844FF']

export default function FormationsSection({ events = [], loading = false, onReserve }: FormationsSectionProps) {
  const [active, setActive] = useState(0)
  const list = Array.isArray(events) ? events.slice(0, 3) : []

  return (
    <section id="evenements" className="premium-light-section" style={{ padding: '100px 0 120px', position: 'relative', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="glow-line glow-line-d2" style={{ width: '32px', height: '1px', background: '#2979FF' }} />
            <span className="glow-label glow-label-d2" style={{ fontFamily: 'Outfit', fontSize: '11px', letterSpacing: '0.22em', color: '#2979FF', textTransform: 'uppercase' }}>
              ÉVÉNEMENTS
            </span>
          </div>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', color: '#061631', lineHeight: 0.95, marginBottom: '16px' }}>
            Des opportunités pour<br />
            <span style={{ color: '#2979FF' }}>grandir ensemble.</span>
          </h2>
          <p style={{ fontFamily: 'Outfit', fontSize: '15px', color: 'rgba(6,22,49,0.62)', maxWidth: '480px', lineHeight: 1.65 }}>
            Réservez votre place aux prochaines conférences, formations et ateliers DiCe.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <FaSpinner className="animate-spin text-4xl text-[#2979FF]" />
          </div>
        ) : list.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(23,107,255,0.2)', borderRadius: '28px', padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Barlow Condensed', fontSize: '24px', fontWeight: 700, color: '#061631' }}>
              Aucun événement à venir pour le moment
            </p>
            <p style={{ fontFamily: 'Outfit', fontSize: '15px', color: 'rgba(6,22,49,0.62)', maxWidth: '400px', margin: '10px auto 0' }}>
              Revenez bientôt : de nouvelles conférences, formations et ateliers seront annoncés.
            </p>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {list.map((event, i) => (
                <EventCard key={event.id ?? i} event={event} index={i} active={active === i} onHover={() => setActive(i)} onReserve={onReserve} />
              ))}
            </div>

            {/* Carousel dots + CTA */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {list.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Aller à l'événement ${i + 1}`}
                    style={{
                      width: i === active ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === active ? '#0057FF' : 'rgba(0,65,145,0.18)',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>

              <Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200" style={{ fontFamily: 'Outfit', color: 'rgba(6,22,49,0.62)', textDecoration: 'none', letterSpacing: '0.04em' }}>
                <span onMouseEnter={(e) => (e.currentTarget.style.color = '#2979FF')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(6,22,49,0.62)')} className="flex items-center gap-2">
                  Voir tous les événements
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function EventCard({ event, index, active, onHover, onReserve }: { event: any, index: number, active: boolean, onHover: () => void, onReserve?: (event: any) => void }) {
  const { isAuthenticated } = useAuth()
  const { id, title, description, image_url, price = 0, currency = 'XAF', start_date, end_date, start_time, end_time, location, category, capacity, available_tickets, promotion } = event || {}

  const meta = categoryMeta(category)
  const color = COLORS[index % COLORS.length]

  const placesRestantes = available_tickets != null ? Number(available_tickets) : Math.max(0, Number(capacity || 0) - Number(event?.nb_inscrits || 0))
  const isFull = placesRestantes <= 0
  const isPast = isEventEnded(event)
  const canReserve = !isPast && !isFull

  const promoPct = Number(promotion?.pourcentage) || 0
  const hasPromoPrice = promotion?.prix_promo !== null && promotion?.prix_promo !== undefined && Number.isFinite(Number(promotion.prix_promo)) && Number(promotion.prix_promo) < Number(price)
  const hasPromotion = Boolean(promotion && (promoPct > 0 || hasPromoPrice))
  const finalPrice = hasPromotion ? (hasPromoPrice ? Number(promotion.prix_promo) : Math.round(Number(price) - (Number(price) * promoPct) / 100)) : Number(price)

  let badge = null
  if (hasPromotion && promoPct > 0) {
    const endRaw = promotion?.date_fin || promotion?.end_date || promotion?.valid_until
    const endD = parseDate(endRaw)
    const suffix = endD ? ` avant le ${format(endD, 'd MMM', { locale: fr }).replace(/\./g, '')}` : ''
    badge = `-${promoPct}%${suffix}`
  } else if (isFull) {
    badge = 'Complet'
  } else if (!isPast && (placesRestantes <= 15 || (Number(capacity) > 0 && placesRestantes / Number(capacity) <= 0.2))) {
    badge = 'Dernières places'
  }

  const startT = toHourLabel(normalizeTime(start_time, start_date))
  const endT = toHourLabel(normalizeTime(end_time, end_date || start_date))
  const timeLabel = startT && endT ? `${startT} — ${endT}` : startT || 'Horaire à confirmer'
  const priceText = Number(price) === 0 ? 'Gratuit' : `${formatAmount(finalPrice)} ${currencyLabel(currency)}`
  const fallbackImg = meta.fallback

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

  return (
    <div
      className={`event-premium-card ${active ? 'is-active' : ''}`}
      onMouseEnter={onHover}
      style={{
        background: active ? 'linear-gradient(145deg,#071B46,#102C68)' : 'linear-gradient(180deg, rgba(255,255,255,.88), rgba(242,249,255,.76))',
        backdropFilter: 'blur(12px)',
        border: active ? '2px solid #176BFF' : '2px solid rgba(23,107,255,0.48)',
        borderRadius: '28px',
        overflow: 'hidden',
        transition: 'all .55s cubic-bezier(.2,.8,.2,1)',
        transform: active ? 'translateY(-10px) scale(1.018)' : 'translateY(0) scale(1)',
        boxShadow: active ? '0 28px 60px rgba(23,107,255,.24), 0 0 28px rgba(23,107,255,.20)' : '0 14px 36px rgba(17,77,145,.10)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
        <img
          src={toAbsoluteMediaUrl(image_url) ?? fallbackImg}
          alt={title || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: active ? 'scale(1.04)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(5,23,58,0.78) 100%)' }} />
        {/* Event type badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '3px', background: `${color}22`, border: `1px solid ${color}80`, fontFamily: 'Outfit', fontSize: '10px', fontWeight: 600, letterSpacing: '0.16em', color: color === '#0057FF' ? '#7AADFF' : color, boxShadow: `0 0 6px ${color}50, 0 0 14px ${color}22`, textShadow: `0 0 6px ${color}90` }}>
          {meta.label}
        </div>
        {/* Promo badge */}
        {badge && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '3px', background: badge === 'Dernières places' || badge === 'Complet' ? 'rgba(255,80,80,0.15)' : 'rgba(0,200,80,0.15)', border: `1px solid ${badge === 'Dernières places' || badge === 'Complet' ? 'rgba(255,80,80,0.4)' : 'rgba(0,200,80,0.4)'}`, fontFamily: 'Outfit', fontSize: '10px', fontWeight: 600, color: badge === 'Dernières places' || badge === 'Complet' ? '#FF8080' : '#44FF99' }}>
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'Outfit', fontSize: '11px', letterSpacing: '0.14em', color: 'rgba(6,22,49,0.45)', marginBottom: '8px' }}>
          {formatDay(start_date)}
        </div>
        <h3 style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '22px', color: active ? '#FFFFFF' : '#061631', lineHeight: 1.15, marginBottom: '10px' }}>
          {title}
        </h3>
        <p className="line-clamp-3" style={{ fontFamily: 'Outfit', fontSize: '13px', color: active ? 'rgba(255,255,255,.82)' : 'rgba(6,22,49,0.60)', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
          {description}
        </p>

        {/* Meta info */}
        <div className="flex flex-col gap-2 mb-5" style={{ borderTop: '1px solid rgba(0,72,170,0.10)', paddingTop: '14px' }}>
          <MetaRow kind="pin" label={location || 'Lieu à confirmer'} active={active} />
          <MetaRow kind="clock" label={timeLabel} active={active} />
          <MetaRow kind="people" label={isFull ? 'Complet' : `${placesRestantes} places disponibles`} active={active} />
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(6,22,49,0.42)', marginBottom: '2px' }}>
              À PARTIR DE
            </div>
            <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '20px', color: active ? '#FFFFFF' : '#061631', transition: 'color .3s ease' }}>
              {priceText}
            </div>
          </div>
          <button onClick={handleReserve} disabled={!canReserve} style={{ fontFamily: 'Outfit', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', padding: '10px 18px', borderRadius: '3px', background: active ? 'linear-gradient(135deg, #176BFF, #8A4DFF)' : 'rgba(255,255,255,0.06)', color: active ? '#FFFFFF' : '#061631', border: 'none', cursor: canReserve ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease', opacity: canReserve ? 1 : 0.5 }}>
            {isPast ? 'Passé' : isFull ? 'Complet' : 'Réserver'}
          </button>
        </div>
      </div>
    </div>
  )
}

function MetaRow({ kind, label, active }: { kind: 'pin'|'clock'|'people'; label: string; active: boolean }) {
  const paths = kind === 'pin' ? <><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></> : kind === 'clock' ? <><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></> : <><circle cx="9" cy="9" r="3"/><circle cx="16" cy="10" r="2.4"/><path d="M3.5 19c.7-3.3 2.8-5 5.5-5s4.8 1.7 5.5 5M14 15c2.7-.4 4.8.9 5.5 3.5"/></>
  return (
    <div className="flex items-center gap-2">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? '#8FC8FF' : '#083B82'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
      <span className="line-clamp-1" style={{ fontFamily: 'Outfit', fontSize: '12px', color: active ? 'rgba(255,255,255,.78)' : 'rgba(6,22,49,.62)', transition: 'color .3s ease' }}>{label}</span>
    </div>
  )
}
