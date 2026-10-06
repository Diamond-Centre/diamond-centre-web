'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { FaDownload, FaEye, FaSpinner, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import LoadError from '@/components/ui/LoadError'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}


function CertificateDetail({
  cert,
  onClose,
  onDownload,
  onPreview,
  downloading,
  previewing,
}) {
  if (!cert) return null

  return (
    <div className="ec-modal" onClick={onClose} role="presentation">
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="ec-modal-panel"
      >
        <div className="ec-modal-head">
          <div>
            <p className="ec-eyebrow">{cert.template?.title || 'Certificat de formation'}</p>
            <h3>{cert.formation_title || 'Formation DiCe'}</h3>
            <p className="ec-tile-text" style={{ fontFamily: 'ui-monospace, monospace', marginTop: 10 }}>
              {cert.code}
            </p>
          </div>
          <button type="button" onClick={onClose} className="ec-modal-close" aria-label="Fermer">
            <FaTimes />
          </button>
        </div>

        <div className="ec-modal-body">
          <div className="ec-tile">
            <p className="ec-tile-label">Participant</p>
            <p className="ec-tile-value">{cert.recipient_name || '—'}</p>
            <p className="ec-tile-text">{cert.recipient_email}</p>
          </div>

          <div className="ec-tiles2">
            <div className="ec-tile">
              <p className="ec-tile-label">Début</p>
              <p className="ec-tile-value">{formatDate(cert.start_date)}</p>
            </div>
            <div className="ec-tile">
              <p className="ec-tile-label">Fin</p>
              <p className="ec-tile-value">{formatDate(cert.end_date)}</p>
            </div>
          </div>

          {cert.location ? (
            <div className="ec-tile">
              <p className="ec-tile-label">Lieu</p>
              <p className="ec-tile-value">{cert.location}</p>
            </div>
          ) : null}

          <p className="ec-modal-note">
            Délivré le {formatDate(cert.issued_at)}
            {cert.issuer_name ? ` · ${cert.issuer_name}` : ''}
          </p>

          <button
            type="button"
            disabled={previewing}
            onClick={() => onPreview(cert)}
            className="ec-btn ec-btn--sky"
            style={{ width: '100%' }}
          >
            {previewing ? <FaSpinner className="animate-spin" /> : <FaEye />}
            Voir le certificat
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={() => onDownload(cert)}
            className="ec-btn ec-btn--dark"
            style={{ width: '100%', height: 50, borderRadius: 14 }}
          >
            {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
            Télécharger le PDF
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function CertificatePreview({ cert, html, loading, error, onClose, onDownload, downloading }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[#0B1220]/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Aperçu du certificat"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0B1220] px-4 py-3 text-white sm:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-white/55">
            Aperçu
          </p>
          <p className="truncate text-sm font-semibold">
            {cert?.formation_title || 'Certificat DiCe'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={downloading || !cert}
            onClick={() => cert && onDownload(cert)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/15 disabled:opacity-50"
          >
            {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/10 p-2.5 transition hover:bg-white/15"
            aria-label="Fermer l’aperçu"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-stretch justify-center p-3 sm:p-6">
        <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#F4F7FB] shadow-2xl">
          {loading ? (
            <div className="flex flex-1 items-center justify-center gap-2 py-24 text-[#667085]">
              <FaSpinner className="animate-spin text-[#0A89F2]" />
              Chargement de l’aperçu…
            </div>
          ) : error ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#0A89F2] px-4 py-2 text-sm font-semibold text-white"
              >
                Fermer
              </button>
            </div>
          ) : (
            <iframe
              title={`Certificat ${cert?.code || ''}`}
              srcDoc={html}
              className="h-[min(78vh,900px)] w-full flex-1 border-0 bg-white"
              sandbox="allow-same-origin allow-modals"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [preview, setPreview] = useState(null) // { cert, html } | null
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const token = auth.getToken()
        if (!token) {
          throw new Error('Session expirée — reconnectez-vous')
        }
        const list = await api.getMyCertificates(token)
        if (!cancelled) {
          setCertificates(list)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Impossible de charger vos certificats')
          setCertificates([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return certificates
    return certificates.filter((c) => {
      const hay = [
        c.formation_title,
        c.code,
        c.recipient_name,
        c.location,
        c.template?.title,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [certificates, search])

  const handleDownload = async (cert) => {
    try {
      setDownloading(true)
      const token = auth.getToken()
      await api.downloadMyCertificatePdf(cert.code, token)
      toast.success('Téléchargement démarré')
    } catch (err) {
      toast.error(err.message || 'Téléchargement impossible')
    } finally {
      setDownloading(false)
    }
  }

  const openPreview = async (cert) => {
    try {
      setPreviewing(true)
      setPreviewLoading(true)
      setPreviewError(null)
      setPreview({ cert, html: '' })
      setSelected(null)

      const token = auth.getToken()
      const html = await api.getMyCertificateHtml(cert.code, token)
      setPreview({ cert, html })
    } catch (err) {
      setPreviewError(err.message || 'Impossible de charger l’aperçu')
      toast.error(err.message || 'Aperçu impossible')
    } finally {
      setPreviewing(false)
      setPreviewLoading(false)
    }
  }

  const closePreview = () => {
    setPreview(null)
    setPreviewError(null)
  }

  return (
    <div>
      <section
        className="ec-card ec-card--pad"
      >
        {/* image en verre : défile en continu dans la zone qui lui est réservée */}
        <div className="ec-folder" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/espace-client/glass-folder.jpg" alt="" draggable={false} />
        </div>

        <div className="ec-card-head">
          <div>
            <p className="ec-eyebrow">Formations</p>
            <h1 className="ec-card-title">Mes certificats</h1>
            <p className="ec-card-sub">
              Attestations délivrées pour vos formations DiCe réussies.
            </p>
          </div>
          {!loading && !error ? (
            <div className="ec-stat ec-stat--total">
              <small>Total</small>
              <strong>{certificates.length}</strong>
            </div>
          ) : null}
        </div>

        {!loading && certificates.length > 0 ? (
          <label className="ec-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par formation ou code…"
            />
          </label>
        ) : (
          <div style={{ height: 40 }} />
        )}

        {loading ? (
          <div className="ec-loading">
            <FaSpinner className="animate-spin" />
            Chargement des certificats…
          </div>
        ) : error ? (
          <LoadError onRetry={() => window.location.reload()} />
        ) : filtered.length === 0 ? (
          <div className="ec-empty">
            <div className="ec-empty-ico" aria-hidden="true">✦</div>
            <h3>{search ? 'Aucun résultat' : 'Aucun certificat'}</h3>
            <p>
              {search
                ? 'Essayez un autre terme de recherche.'
                : 'Vos certificats apparaîtront ici après validation d’une formation.'}
            </p>
            {!search ? (
              <Link href="/events" className="ec-btn ec-btn--sky">
                Voir les formations →
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className="ec-list ec-list--loose">
            {filtered.map((cert) => (
              <li key={cert.id || cert.code}>
                <button
                  type="button"
                  onClick={() => setSelected(cert)}
                  className="ec-item ec-cert"
                >
                  <span className="ec-item-icon" aria-hidden="true">✦</span>
                  <span className="ec-item-body">
                    <span className="ec-cert-top">
                      <span className="ec-pill ec-pill--ok">Validé</span>
                      <span>{cert.code}</span>
                    </span>
                    <span className="ec-item-title">
                      {cert.formation_title || 'Formation'}
                    </span>
                    <span className="ec-item-meta" style={{ margin: 0, display: 'flex', flexWrap: 'wrap', columnGap: 18 }}>
                      <span><span aria-hidden="true">▦</span> {formatDate(cert.issued_at)}</span>
                      {cert.location ? (
                        <span><span aria-hidden="true">⌖</span> {cert.location}</span>
                      ) : null}
                    </span>
                  </span>
                  <span className="ec-item-arrow" aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AnimatePresence>
        {selected ? (
          <CertificateDetail
            cert={selected}
            onClose={() => setSelected(null)}
            downloading={downloading}
            previewing={previewing}
            onDownload={handleDownload}
            onPreview={openPreview}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CertificatePreview
              cert={preview.cert}
              html={preview.html}
              loading={previewLoading}
              error={previewError}
              onClose={closePreview}
              onDownload={handleDownload}
              downloading={downloading}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
