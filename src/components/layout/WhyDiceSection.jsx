/**
 * Pourquoi DiCe — une intention claire, sans grille de cartes égales
 */
'use client'

import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

const pillars = [
  {
    num: '01',
    title: 'Excellence',
    text: 'Des programmes exigeants animés par des experts reconnus.',
  },
  {
    num: '02',
    title: 'Communauté',
    text: 'Un réseau de professionnels et d’apprenants engagés.',
  },
  {
    num: '03',
    title: 'Accompagnement',
    text: 'Un suivi concret pour faire avancer votre projet.',
  },
]

export default function WhyDiceSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F7FB] py-20 md:py-28">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#0A89F2]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A89F2]">
              Pourquoi DiCe
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              L’excellence au service
              <br />
              de vos ambitions
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#667085]">
              Depuis des années, Diamond Centre accompagne celles et ceux qui
              veulent grandir — avec des formats concrets, inspirants et
              accessibles.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0A89F2] transition hover:gap-3"
            >
              Notre histoire
              <FaArrowRight className="text-xs" />
            </Link>
          </motion.div>

          <div className="space-y-0 divide-y divide-[#E8EEF5] border-y border-[#E8EEF5] bg-white/70">
            {pillars.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                className="flex gap-5 px-5 py-6 sm:px-6"
              >
                <span className="text-sm font-bold tabular-nums text-[#0A89F2]">
                  {item.num}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#0B1220]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#667085]">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
