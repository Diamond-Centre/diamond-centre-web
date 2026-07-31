/**
 * CTA final Accueil — fond DiCe uni, aligné au design system
 */
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'

const steps = [
  { n: '01', label: 'Créez votre compte' },
  { n: '02', label: 'Choisissez un événement' },
  { n: '03', label: 'Réservez votre place' },
]

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#0A89F2]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#0057C2]/40 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col justify-between gap-12 px-4 py-16 sm:px-6 md:flex-row md:items-end md:gap-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-white/70" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              Rejoignez DiCe
            </p>
          </div>

          <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            Prêt à écrire
            <br />
            <span className="text-white/85">la suite ?</span>
          </h2>

          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            Créez votre compte et réservez votre prochaine formation ou
            conférence en quelques minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0A89F2] shadow-[0_14px_32px_rgba(11,18,32,0.18)] transition hover:bg-white/95"
            >
              Commencer
              <FaArrowRight className="text-xs transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Voir le programme
            </Link>
          </div>
        </motion.div>

        <motion.ol
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="w-full max-w-xs space-y-0 border-l border-white/25 md:mb-2"
        >
          {steps.map((step, i) => (
            <li
              key={step.n}
              className="flex items-start gap-4 py-4 pl-5 first:pt-0 last:pb-0"
            >
              <span className="pt-0.5 text-xs font-bold tabular-nums text-white">
                {step.n}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{step.label}</p>
                {i < steps.length - 1 ? (
                  <span className="mt-3 block h-px w-12 bg-white/20" />
                ) : null}
              </div>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
