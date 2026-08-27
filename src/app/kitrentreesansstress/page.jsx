import React from 'react';

export const metadata = {
  title: 'DiCe - Kit Rentrée Sans Stress',
  description:
    'Reprenez le contrôle des finances de votre foyer avec le Kit Rentrée Sans Stress.',
};

const KIT_BASE = '/kit-rentree-sans-stress';

const PACK_ZIP = {
  href: `${KIT_BASE}/Pack_Rentree_Sans_Stress_DiCe.zip`,
  label: 'Télécharger le Pack PDF Complet (Immédiat)',
  filename: 'Pack_Rentree_Sans_Stress_DiCe.zip',
};

const RESOURCES = [
  {
    id: '01',
    title: 'Diagnostic financier personnel',
    description: 'Évaluez votre situation financière actuelle.',
    href: `${KIT_BASE}/01_Diagnostic_financier_personnel.pdf`,
    filename: '01_Diagnostic_financier_personnel.pdf',
  },
  {
    id: '02',
    title: 'Où va mon argent',
    description: 'Cartographiez vos flux et priorités de dépenses.',
    href: `${KIT_BASE}/02_Ou_va_mon_argent.pdf`,
    filename: '02_Ou_va_mon_argent.pdf',
  },
  {
    id: '03',
    title: 'Sources de pression financière',
    description: 'Identifiez ce qui pèse vraiment sur votre budget.',
    href: `${KIT_BASE}/03_Grille_sources_de_pression_financiere.pdf`,
    filename: '03_Grille_sources_de_pression_financiere.pdf',
  },
  {
    id: '04',
    title: 'Checklist Rentrée Sans Stress',
    description: 'Les étapes clés pour une rentrée sereine.',
    href: `${KIT_BASE}/04_Checklist_Rentree_Sans_Stress.pdf`,
    filename: '04_Checklist_Rentree_Sans_Stress.pdf',
  },
  {
    id: '05',
    title: 'Budget prévisionnel de rentrée',
    description: 'Planifiez vos dépenses avant qu’elles n’arrivent.',
    href: `${KIT_BASE}/05_Budget_previsionnel_de_rentree.pdf`,
    filename: '05_Budget_previsionnel_de_rentree.pdf',
  },
  {
    id: '06',
    title: 'Tableau de suivi des dépenses',
    description: 'Suivez au jour le jour où part votre argent.',
    href: `${KIT_BASE}/06_Tableau_suivi_des_depenses.pdf`,
    filename: '06_Tableau_suivi_des_depenses.pdf',
  },
  {
    id: '07',
    title: 'Plan Rentrée Sans Stress',
    description: 'Votre feuille de route pour la saison.',
    href: `${KIT_BASE}/07_Plan_Rentree_Sans_Stress.pdf`,
    filename: '07_Plan_Rentree_Sans_Stress.pdf',
  },
  {
    id: '08',
    title: 'Plan d’action 30 jours',
    description: 'Des actions concrètes sur un mois.',
    href: `${KIT_BASE}/08_Plan_action_30_jours.pdf`,
    filename: '08_Plan_action_30_jours.pdf',
  },
  {
    id: '09',
    title: 'Fiche d’engagement personnel',
    description: 'Formalisez vos engagements financiers.',
    href: `${KIT_BASE}/09_Fiche_engagement_personnel.pdf`,
    filename: '09_Fiche_engagement_personnel.pdf',
  },
  {
    id: '10',
    title: 'Présentation du PACK',
    description: 'Vue d’ensemble du Kit Rentrée Sans Stress.',
    href: `${KIT_BASE}/10_Presentation_du_PACK_Rentree_Sans_Stress.pdf`,
    filename: '10_Presentation_du_PACK_Rentree_Sans_Stress.pdf',
  },
];

function DownloadIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

export default function KitRentreePage() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 py-12 sm:py-16 px-4 font-sans antialiased">
      <main className="max-w-4xl mx-auto space-y-16 sm:space-y-20">
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <span className="inline-block mt-24 bg-[#FFE2D1] text-[#9C3800] text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full mb-6">
            KIT RENTRÉE DICE 2026 — EXCLUSIF
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
            Récupérez votre Kit Rentrée <br /> Sans Stress gratuitement
          </h1>

          <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-xl font-normal leading-relaxed">
            Reprenez le contrôle des finances de votre foyer. Des outils
            pratiques et éprouvés pour aborder la rentrée avec sérénité et
            clarté.
          </p>

          <div className="w-full max-w-md flex flex-col items-center">
            <a
              href={PACK_ZIP.href}
              download={PACK_ZIP.filename}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <DownloadIcon />
              {PACK_ZIP.label}
            </a>
            <p className="mt-3 text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <svg
                className="w-3.5 h-3.5 text-slate-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Aucune inscription requise · 10 fiches PDF dans un seul fichier ZIP
            </p>
          </div>

          <div className="w-full max-w-3xl mt-12 bg-white rounded-2xl p-2 sm:p-3 shadow-sm border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEF0wkJTrUPB31IcbSjYl_eLEhjsDC-dnV_e7k4LtbZ8PPfT6C1LJ0GwiBW8SntxmF9s3O4IegSqnWXL-NgFyqtui8UoCkIGw3pN5Rp2QKdBvJflpRIEweFGUv7vMfJs53LmGi5FZZWTUpMQ4YZI_y_uSluRzElgW4AhxCS8tj4TiBTh_pqhDXdrh1e-o3kFPA_s3Gdr2wS9wIx4USbCbnZo6iLvISroaJl2tg0vb5iYdlXuDU2CMZvQ"
              alt="Kit Rentrée DiCe Mockup"
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </section>

        {/* --- RESOURCE GRID --- */}
        <section className="w-full pt-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] text-center mb-3">
            Les ressources de votre Kit
          </h2>
          <p className="text-center text-slate-500 text-sm sm:text-base mb-10 max-w-xl mx-auto">
            Téléchargez chaque fiche séparément, ou le pack complet ci-dessus.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {RESOURCES.map((resource) => (
              <article
                key={resource.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between gap-6"
              >
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF] mb-2">
                    Fiche {resource.id}
                  </p>
                  <h3 className="text-lg font-extrabold text-[#0F172A] mb-2 leading-snug">
                    {resource.title}
                  </h3>
                  <p className="text-slate-500 text-sm">{resource.description}</p>
                </div>
                <a
                  href={resource.href}
                  download={resource.filename}
                  className="w-full border border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-colors text-sm inline-flex items-center justify-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Télécharger le PDF
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
