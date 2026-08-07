'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCertificate,
  FaDownload,
  FaEye,
  FaMapMarkerAlt,
  FaSearch,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'

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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A89F2] to-[#0057C2] px-6 pb-7 pt-5 text-white">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-white/75">
                {cert.template?.title || 'Certificat de formation'}
              </p>
              <h3 className="mt-1 text-lg font-bold leading-snug">
                {cert.formation_title || 'Formation DiCe'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
              aria-label="Fermer"
            >
              <FaTimes />
            </button>
          </div>
          <p className="font-mono text-xs text-white/80">{cert.code}</p>
        </div>

        <div className="space-y-3 px-6 py-6 text-sm">
          <div className="rounded-2xl border border-[#E8EEF5] p-4">
            <p className="text-[11px] text-[#98A2B3]">Participant</p>
            <p className="mt-0.5 font-semibold text-[#0B1220]">
              {cert.recipient_name || '—'}
            </p>
            <p className="text-xs text-[#667085]">{cert.recipient_email}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#F3F6FA] p-3">
              <p className="text-[11px] text-[#98A2B3]">Début</p>
              <p className="mt-0.5 font-semibold text-[#0B1220]">
                {formatDate(cert.start_date)}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F3F6FA] p-3">
              <p className="text-[11px] text-[#98A2B3]">Fin</p>
              <p className="mt-0.5 font-semibold text-[#0B1220]">
                {formatDate(cert.end_date)}
              </p>
            </div>
          </div>

          {cert.location ? (
            <p className="flex items-start gap-2 text-[#667085]">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-[#0A89F2]" />
              <span>
                <span className="block text-[11px] text-[#98A2B3]">Lieu</span>
                <span className="font-medium text-[#0B1220]">{cert.location}</span>
              </span>
            </p>
          ) : null}

          <p className="text-xs text-[#98A2B3]">
            Délivré le {formatDate(cert.issued_at)}
            {cert.issuer_name ? ` · ${cert.issuer_name}` : ''}
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              disabled={previewing}
              onClick={() => onPreview(cert)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A89F2] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0770cc] disabled:opacity-60"
            >
              {previewing ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaEye />
              )}
              Voir le certificat
            </button>
            <button
              type="button"
              disabled={downloading}
              onClick={() => onDownload(cert)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E8EEF5] py-3.5 text-sm font-semibold text-[#0B1220] transition hover:border-[#0A89F2]/40 hover:text-[#0A89F2] disabled:opacity-60"
            >
              {downloading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaDownload />
              )}
              Télécharger le PDF
            </button>
          </div>
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
    <div className="space-y-7">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A89F2]">
            Formations
          </p>
          <h1 className="mt-1 text-[2rem] font-extrabold tracking-tight text-[#0B1220]">
            Mes certificats
          </h1>
          <p className="mt-1 max-w-md text-[#667085]">
            Attestations délivrées pour vos formations DiCe réussies.
          </p>
        </div>
        {!loading && !error ? (
          <div className="rounded-[18px] border border-[#E8EEF5] bg-white px-4 py-3 text-right shadow-[0_6px_20px_rgba(11,18,32,0.04)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#98A2B3]">
              Total
            </p>
            <p className="text-2xl font-extrabold tabular-nums text-[#0B1220]">
              {certificates.length}
            </p>
          </div>
        ) : null}
      </motion.header>

      {!loading && certificates.length > 0 ? (
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par formation ou code…"
            className="w-full rounded-2xl border border-[#E8EEF5] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0A89F2]/40 focus:ring-2 focus:ring-[#0A89F2]/15"
          />
        </div>
      ) : null}

      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-[28px] border border-[#E8EEF5] bg-white text-[#667085]">
          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
          Chargement des certificats…
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-700">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="relative overflow-hidden rounded-[28px] border border-[#E8EEF5] bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(10,137,242,0.1),_transparent_55%)]" />
          <div className="relative px-6 py-14 text-center sm:py-16">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3FE] text-[#0A89F2]">
              <FaCertificate className="text-xl" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0B1220]">
              {search ? 'Aucun résultat' : 'Aucun certificat'}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#667085]">
              {search
                ? 'Essayez un autre terme de recherche.'
                : 'Vos certificats apparaîtront ici après validation d’une formation.'}
            </p>
            {!search ? (
              <Link
                href="/events"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#0A89F2] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(10,137,242,0.28)] transition hover:bg-[#0770cc]"
              >
                Voir les formations
                <FaArrowRight className="text-xs" />
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((cert, i) => (
            <motion.li
              key={cert.id || cert.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.2) }}
            >
              <button
                type="button"
                onClick={() => setSelected(cert)}
                className="group flex w-full overflow-hidden rounded-[22px] border border-[#E8EEF5] bg-white text-left shadow-[0_8px_24px_rgba(11,18,32,0.04)] transition hover:border-[#0A89F2]/30 hover:shadow-[0_14px_32px_rgba(10,137,242,0.1)]"
              >
                <div className="flex w-[72px] shrink-0 flex-col items-center justify-center bg-[#E8F3FE] text-[#0A89F2]">
                  <FaCertificate className="text-xl" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#E8F8F1] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B9B6B]">
                      Validé
                    </span>
                    <span className="font-mono text-[11px] text-[#98A2B3]">
                      {cert.code}
                    </span>
                  </div>
                  <h2 className="truncate text-[15px] font-semibold text-[#0B1220] group-hover:text-[#0A89F2]">
                    {cert.formation_title || 'Formation'}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#667085]">
                    <span className="inline-flex items-center gap-1.5">
                      <FaCalendarAlt className="text-[10px] text-[#0A89F2]" />
                      {formatDate(cert.issued_at)}
                    </span>
                    {cert.location ? (
                      <span className="inline-flex max-w-full items-center gap-1.5 truncate">
                        <FaMapMarkerAlt className="shrink-0 text-[10px] text-[#0A89F2]" />
                        <span className="truncate">{cert.location}</span>
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="hidden items-center pr-4 text-[#CBD5E1] transition group-hover:text-[#0A89F2] sm:flex">
                  <FaArrowRight className="text-xs" />
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      )}

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
