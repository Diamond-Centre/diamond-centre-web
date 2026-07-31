/**
 * Témoignages — bande sobre
 */
'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Entrepreneure',
    text: 'Les conférences DiCe ont transformé ma vision. Une exigence rare, et une vraie énergie.',
  },
  {
    name: 'Thomas Dubois',
    role: 'Étudiant',
    text: 'Le séminaire m’a donné les clés pour lancer mon projet. Format concret, orateurs inspirants.',
  },
  {
    name: 'Laura Petit',
    role: 'Cheffe d’entreprise',
    text: 'L’art oratoire m’a permis de gagner en confiance et de mieux porter ma parole en équipe.',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-[#0A89F2] py-20 text-white md:py-24">
      <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-[#0057C2]/50 blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Témoignages
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ils ont choisi DiCe
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="rounded-[22px] border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <p className="text-[15px] leading-relaxed text-white/95">
                “{t.text}”
              </p>
              <footer className="mt-5 border-t border-white/15 pt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-white/65">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
