/**
 * Création d'événement — design DiCe premium
 */
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaArrowLeft, FaSave, FaImage, FaTimes, FaUpload, FaTag,
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaCheck,
} from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import toast from 'react-hot-toast'
import LocationPicker from '@/components/maps/LocationPicker'

const CATEGORIES = [
  { id: 'conference', label: 'Conférence' },
  { id: 'formation', label: 'Formation' },
  { id: 'seminaire', label: 'Séminaire' },
  { id: 'atelier', label: 'Atelier' },
  { id: 'webinaire', label: 'Webinaire' },
]

const inputClass =
  'w-full px-4 py-3 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] text-sm text-[#0B1220] placeholder:text-[#98A2B3] focus:ring-2 focus:ring-[#0A89F2]/25 focus:border-[#0A89F2] focus:bg-white outline-none transition-colors'

const labelClass = 'block text-xs font-bold uppercase tracking-wide text-[#667085] mb-1.5'

function formatPreviewDate(value) {
  if (!value) return 'Date à définir'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Date à définir'
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Section({ icon: Icon, title, subtitle, children, accent = false }) {
  return (
    <section
      className={`rounded-[24px] border p-5 sm:p-6 shadow-[0_8px_24px_rgba(11,18,32,0.04)] ${accent
          ? 'border-[#F5D48A] bg-gradient-to-br from-[#FFF8E8] to-white'
          : 'border-[#E8EEF5] bg-white'
        }`}
    >
      <div className="flex items-start gap-3 mb-5">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${accent ? 'bg-[#FFF4DE] text-[#B78103]' : 'bg-[#E8F3FE] text-[#0A89F2]'
            }`}
        >
          <Icon />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-[#0B1220] tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-[#667085] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

export default function CreateEvent() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [hasPromotion, setHasPromotion] = useState(false)
  const [promotion, setPromotion] = useState({
    nombre: '',
    sexe: 'tous',
    pourcentage: '',
    duree: '',
    description: '',
  })
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'XAF',
    start_date: '',
    end_date: '',
    start_time: '09:00',
    end_time: '17:00',
    location: '',
    latitude: null,
    longitude: null,
    category: 'conference',
    capacity: '50',
  })

  useEffect(() => {
    const token = auth.getToken()
    if (!token) router.push('/auth/login')
  }, [router])

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const promoPrice = useMemo(() => {
    const price = Number(form.price)
    const pct = Number(promotion.pourcentage)
    if (!(price > 0) || !(pct > 0) || !hasPromotion) return null
    return Math.round(price * (1 - pct / 100))
  }, [form.price, promotion.pourcentage, hasPromotion])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image')
      return
    }
    // Keep under ~1.5MB: Vercel request body limit (~4.5MB) and data-URL storage
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 1,5 Mo (limite hébergement)")
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = () => {
    if (!form.title.trim() || form.title.trim().length < 3) {
      return 'Le titre doit contenir au moins 3 caractères'
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      return 'La description doit contenir au moins 10 caractères'
    }
    if (!form.start_date || !form.end_date) return 'Les dates sont requises'
    if (new Date(form.end_date) < new Date(form.start_date)) {
      return 'La date de fin doit être après la date de début'
    }
    if (!form.location.trim()) return 'Le lieu est requis'
    if (!(Number(form.capacity) >= 1)) return 'La capacité minimale est 1'
    if (Number(form.price) < 0 || form.price === '') return 'Le prix est requis'
    if (hasPromotion) {
      const nombre = Number(promotion.nombre)
      const pourcentage = Number(promotion.pourcentage)
      const duree = Number(promotion.duree)
      if (!(nombre > 0 && pourcentage > 0 && pourcentage <= 100 && duree > 0)) {
        return 'Promotion incomplete : places, % (1–100) et durée sont requis'
      }
    }
    return null
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      toast.error(validationError)
      setError(validationError)
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      if (!token) {
        toast.error('Vous devez être connecté')
        setLoading(false)
        return
      }

      let finalImageUrl = ''
      if (imageFile) {
        setUploading(true)
        try {
          const uploadResult = await api.uploadImage(imageFile, token)
          finalImageUrl = uploadResult.url || uploadResult.image_url || ''
          //toast.success('Image téléchargée')
        } catch (err) {
          toast.error(err.message || "Erreur lors de l'upload de l'image")
          setUploading(false)
          setLoading(false)
          return
        } finally {
          setUploading(false)
        }
      }

      const formattedData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        currency: form.currency || 'XAF',
        start_date: form.start_date,
        end_date: form.end_date,
        start_time: form.start_time || '09:00',
        end_time: form.end_time || '17:00',
        location: form.location.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
        category: form.category,
        capacity: Number(form.capacity),
        image_url: finalImageUrl,
        status: 'published',
        hasPromotion,
        promotion: hasPromotion
          ? {
            nombre: Number(promotion.nombre),
            sexe: promotion.sexe || 'tous',
            pourcentage: Number(promotion.pourcentage),
            duree: Number(promotion.duree),
            description: promotion.description || '',
          }
          : undefined,
      }

      await api.createEvent(formattedData, token)
      toast.success('Événement publié avec succès')
        router.push('/admin/events')
    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const categoryLabel =
    CATEGORIES.find((c) => c.id === form.category)?.label || form.category

  return (
    <div className="relative -m-6 min-h-full pb-28">
      <div className="relative p-6 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-start gap-3">
        <button
              type="button"
          onClick={() => router.back()}
              className="mt-1 p-2.5 rounded-2xl border border-[#E8EEF5] bg-white text-[#667085] hover:bg-[#F3F6FA] transition-colors"
              aria-label="Retour"
        >
              <FaArrowLeft />
        </button>
        <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A89F2] mb-1">
                Diamond Centre
              </p>
              <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0B1220] tracking-tight">
                Nouvel événement
              </h1>
              <p className="text-[#667085] text-sm mt-1">
                Publiez une conférence, formation ou atelier sur la page publique.
              </p>
            </div>
          </div>
          <Link
            href="/admin/events"
            className="text-sm font-semibold text-[#0A89F2] hover:underline self-start sm:self-auto"
          >
            Voir la liste
          </Link>
      </div>

      {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
          <div className="space-y-5">
            {/* General */}
            <Section
              icon={FaCalendarAlt}
              title="Informations générales"
              subtitle="Titre, catégorie et description visibles par le public"
            >
              <div className="space-y-4">
            <div>
                  <label className={labelClass}>Titre *</label>
              <input
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    placeholder="Ex. Formation Full-Stack JavaScript"
                    className={inputClass}
                required
              />
            </div>

            <div>
                  <label className={labelClass}>Catégorie *</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setField('category', c.id)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${form.category === c.id
                            ? 'bg-[#0A89F2] text-white shadow-[0_6px_16px_rgba(10,137,242,0.3)]'
                            : 'bg-[#F3F6FA] text-[#667085] hover:bg-[#E8F3FE] hover:text-[#0A89F2]'
                          }`}
                      >
                        {c.label}
                      </button>
                    ))}
            </div>
          </div>

                <div>
                  <label className={labelClass}>Description *</label>
            <textarea
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    rows={5}
                    placeholder="Décrivez le programme, le public cible et ce que les participants apprendront…"
                    className={`${inputClass} resize-y min-h-[120px]`}
              required
            />
          </div>
              </div>
            </Section>

            {/* Schedule */}
            <Section
              icon={FaClock}
              title="Planning"
              subtitle="Dates, horaires et lieu de l’événement"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                  <label className={labelClass}>Date de début *</label>
              <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => {
                      setField('start_date', e.target.value)
                      if (!form.end_date || form.end_date < e.target.value) {
                        setField('end_date', e.target.value)
                      }
                    }}
                    className={inputClass}
                required
              />
            </div>
            <div>
                  <label className={labelClass}>Date de fin *</label>
              <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setField('end_date', e.target.value)}
                    min={form.start_date || undefined}
                    className={inputClass}
                required
              />
            </div>
            <div>
                  <label className={labelClass}>Heure de début *</label>
              <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setField('start_time', e.target.value)}
                    className={inputClass}
                required
              />
            </div>
            <div>
                  <label className={labelClass}>Heure de fin *</label>
              <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setField('end_time', e.target.value)}
                    className={inputClass}
                required
              />
            </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Lieu *</label>
                  <LocationPicker
                    location={form.location}
                    latitude={form.latitude}
                    longitude={form.longitude}
                    required
                    inputClassName={`${inputClass} pl-10`}
                    onChange={({ location, latitude, longitude }) => {
                      setForm((prev) => ({
                        ...prev,
                        location,
                        latitude,
                        longitude,
                      }))
                    }}
                  />
                </div>
          </div>
            </Section>

            {/* Pricing */}
            <Section
              icon={FaUsers}
              title="Places & tarif"
              subtitle="Capacité et prix affichés à la réservation"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                  <label className={labelClass}>Prix (FCFA) *</label>
              <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setField('price', e.target.value)}
                    placeholder="25000"
                    className={inputClass}
                required
              />
            </div>
            <div>
                  <label className={labelClass}>Capacité *</label>
              <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setField('capacity', e.target.value)}
                    placeholder="50"
                    className={inputClass}
                required
              />
            </div>
          </div>
            </Section>

          {/* Image */}
            <Section
              icon={FaImage}
              title="Visuel"
              subtitle="Image de couverture (PNG/JPG, max 5 Mo)"
            >
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-[20px] border border-[#E8EEF5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                      src={imagePreview}
                      alt="Aperçu"
                    className="w-full h-56 object-cover"
                    />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/95 text-red-500 shadow-md hover:bg-white"
                    aria-label="Retirer l'image"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-[20px] border-2 border-dashed border-[#C9DDED] bg-[#F4F7FA] hover:border-[#0A89F2] hover:bg-[#E8F3FE] transition-colors px-6 py-10 text-center"
                >
                  <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-white text-[#0A89F2] flex items-center justify-center shadow-sm">
                    <FaUpload />
                  </div>
                  <p className="text-sm font-semibold text-[#0B1220]">
                    Cliquez pour ajouter une image
                  </p>
                  <p className="text-xs text-[#98A2B3] mt-1">PNG, JPG · Max 5MB</p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </Section>

            {/* Promotion */}
            <Section
              icon={FaTag}
              title="Promotion"
              subtitle="Réduction optionnelle à la création"
              accent={hasPromotion}
            >
              <button
                type="button"
                onClick={() => setHasPromotion((v) => !v)}
                className={`w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${hasPromotion
                    ? 'border-[#F5D48A] bg-white'
                    : 'border-[#E8EEF5] bg-[#F8FAFC] hover:bg-white'
                  }`}
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-[#0B1220]">Activer une promotion</p>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Places promo, pourcentage et durée
                  </p>
            </div>
                <span
                  className={`relative w-12 h-7 rounded-full transition-colors ${hasPromotion ? 'bg-[#0A89F2]' : 'bg-[#D0D5DD]'
                    }`}
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${hasPromotion ? 'left-5' : 'left-0.5'
                      }`}
                  />
                </span>
              </button>

              <AnimatePresence>
                {hasPromotion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div>
                        <label className={labelClass}>Places promo *</label>
                <input
                  type="number"
                          min="1"
                          value={promotion.nombre}
                          onChange={(e) =>
                            setPromotion((p) => ({ ...p, nombre: e.target.value }))
                          }
                          placeholder="15"
                          className={inputClass}
                          required={hasPromotion}
                />
              </div>
              <div>
                        <label className={labelClass}>Public ciblé</label>
                <select
                          value={promotion.sexe}
                          onChange={(e) =>
                            setPromotion((p) => ({ ...p, sexe: e.target.value }))
                          }
                          className={inputClass}
                >
                  <option value="tous">Tous</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
              <div>
                        <label className={labelClass}>Réduction (%) *</label>
                <input
                  type="number"
                          min="1"
                          max="100"
                          value={promotion.pourcentage}
                          onChange={(e) =>
                            setPromotion((p) => ({ ...p, pourcentage: e.target.value }))
                          }
                  placeholder="20"
                          className={inputClass}
                          required={hasPromotion}
                />
              </div>
              <div>
                        <label className={labelClass}>Durée (jours) *</label>
                <input
                  type="number"
                          min="1"
                          value={promotion.duree}
                          onChange={(e) =>
                            setPromotion((p) => ({ ...p, duree: e.target.value }))
                          }
                  placeholder="7"
                          className={inputClass}
                          required={hasPromotion}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Description promo</label>
                        <input
                          value={promotion.description}
                          onChange={(e) =>
                            setPromotion((p) => ({ ...p, description: e.target.value }))
                          }
                          placeholder="Early bird -20%"
                          className={inputClass}
                        />
                      </div>
                      {promoPrice != null && (
                        <div className="sm:col-span-2 rounded-2xl bg-white border border-[#F5D48A] px-4 py-3 text-sm">
                          <span className="text-[#667085]">Prix promo estimé : </span>
                          <span className="font-extrabold text-[#B78103]">
                            {promoPrice.toLocaleString('fr-FR')} FCFA
                          </span>
                          <span className="text-[#98A2B3] line-through ml-2">
                            {Number(form.price).toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>
          </div>

          {/* Live preview */}
          <aside className="xl:sticky xl:top-6 space-y-4">
            <div className="rounded-[24px] border border-[#E8EEF5] bg-white overflow-hidden shadow-[0_12px_32px_rgba(11,18,32,0.06)]">
              <div className="px-4 py-3 border-b border-[#E8EEF5] flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-[#667085]">
                  Aperçu live
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B9B6B] bg-emerald-50 px-2 py-0.5 rounded-full">
                  <FaCheck className="text-[9px]" />
                  Publié
                </span>
              </div>
              <div className="relative h-40 bg-[#E8F3FE]">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#0A89F2]/50">
                    <FaImage className="text-3xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[11px] font-semibold text-white/85 uppercase tracking-wide">
                    {categoryLabel}
                  </p>
                  <p className="text-white font-extrabold text-lg leading-snug line-clamp-2">
                    {form.title.trim() || 'Titre de l’événement'}
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-2.5 text-sm">
                <p className="flex items-center gap-2 text-[#667085]">
                  <FaCalendarAlt className="text-[#0A89F2] text-xs" />
                  {formatPreviewDate(form.start_date)}
                  {form.start_time ? ` · ${form.start_time}` : ''}
                </p>
                <p className="flex items-center gap-2 text-[#667085]">
                  <FaMapMarkerAlt className="text-[#0A89F2] text-xs" />
                  {form.location.trim() || 'Lieu à préciser'}
                </p>
                <p className="flex items-center gap-2 text-[#667085]">
                  <FaUsers className="text-[#0A89F2] text-xs" />
                  {form.capacity || '—'} places
                </p>
                <div className="pt-2 border-t border-[#E8EEF5] flex items-end justify-between">
                  <div>
                    {promoPrice != null ? (
                      <>
                        <p className="text-lg font-extrabold text-[#0A89F2]">
                          {promoPrice.toLocaleString('fr-FR')} FCFA
                        </p>
                        <p className="text-xs text-[#98A2B3] line-through">
                          {Number(form.price || 0).toLocaleString('fr-FR')} FCFA
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-extrabold text-[#0A89F2]">
                        {form.price !== ''
                          ? `${Number(form.price).toLocaleString('fr-FR')} FCFA`
                          : '— FCFA'}
                      </p>
                    )}
                  </div>
                  {hasPromotion && Number(promotion.pourcentage) > 0 && (
                    <span className="text-[11px] font-bold bg-[#FFF4DE] text-[#B78103] px-2.5 py-1 rounded-full">
                      -{promotion.pourcentage}%
                    </span>
                  )}
            </div>
          </div>
        </div>

            <div className="rounded-[20px] border border-[#E8EEF5] bg-[#E8F3FE]/60 px-4 py-3 text-xs text-[#136db8] leading-relaxed">
              L’événement sera publié immédiatement et visible sur la page publique DiCe.
            </div>
          </aside>

          {/* Sticky actions */}
          <div className="xl:col-span-2 fixed bottom-0 right-0 left-0 md:left-64 z-40 border-t border-[#E8EEF5] bg-white/95 backdrop-blur-md px-6 py-4 shadow-[0_-8px_24px_rgba(11,18,32,0.06)]">
            <div className="w-full flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-sm text-[#667085] hidden sm:block">
                Vérifiez l’aperçu avant de publier.
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
            type="button"
            onClick={() => router.back()}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-2xl border border-[#E8EEF5] text-sm font-semibold text-[#667085] hover:bg-[#F3F6FA] transition-colors"
          >
            Annuler
                </button>
                <button
            type="submit"
            disabled={loading || uploading}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#0A89F2] text-white text-sm font-bold hover:bg-[#0770cc] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(10,137,242,0.3)]"
                >
                  <FaSave />
                  {uploading
                    ? 'Upload…'
                    : loading
                      ? 'Publication…'
                      : 'Publier l’événement'}
                </button>
              </div>
            </div>
        </div>
      </form>
      </div>
    </div>
  )
}
