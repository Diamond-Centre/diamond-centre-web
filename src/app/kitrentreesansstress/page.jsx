import React from 'react';

export const metadata = {
  title: 'DiCe - Kit Rentrée Sans Stress',
  description: 'Reprenez le contrôle des finances de votre foyer avec le Kit Rentrée Sans Stress.',
};

export default function KitRentreePage() {
  const resources = [
    {
      id: 'livre-1',
      category: 'LIVRE 1',
      title: 'Comment gérer efficacement les pressions financières',
      description: 'Comprendre le fonctionnement de la pression financière et la transformer en signal d’action.',
      format: 'Format PDF',
      type: 'book',
    },
    {
      id: 'livre-2',
      category: 'LIVRE 2',
      title: 'Comment utiliser les pressions financières à votre avantage',
      description: 'Un guide stratégique pour transformer les contraintes budgétaires en leviers d’indépendance.',
      format: 'Format PDF',
      type: 'book',
    },
    {
      id: 'diag-1',
      category: 'DIAGNOSTIC 1',
      title: 'Diagnostic financier personnel',
      description: 'Mesurer votre niveau réel de préparation et évaluer la zone de tension financière.',
      format: 'Fiche pratique (FCFA)',
      type: 'tool',
    },
    {
      id: 'diag-2',
      category: 'DIAGNOSTIC 2',
      title: 'Fiche « Où va mon argent ? »',
      description: 'Cartographier les sorties d’argent sur 7 jours et identifier les fuites budgétaires.',
      format: 'Fiche pratique (FCFA)',
      type: 'tool',
    },
    {
      id: 'diag-3',
      category: 'DIAGNOSTIC 3',
      title: 'Grille des sources de pression financière',
      description: 'Distinguer ce qui est urgent, important, négociable ou émotionnel.',
      format: 'Grille d’analyse',
      type: 'tool',
    },
    {
      id: 'prep-1',
      category: 'PRÉPARATION 1',
      title: 'Checklist Rentrée Sans Stress',
      description: 'Liste opérationnelle pour préparer l’essentiel sans oublis ni dépenses inutiles.',
      format: 'Checklist',
      type: 'tool',
    },
    {
      id: 'prep-2',
      category: 'PRÉPARATION 2',
      title: 'Budget prévisionnel de rentrée',
      description: 'Chiffrer le coût total, identifier l’écart à financer et préserver la réserve de sécurité.',
      format: 'Grille budgétaire',
      type: 'tool',
    },
    {
      id: 'prep-3',
      category: 'PRÉPARATION 3',
      title: 'Tableau de suivi des dépenses',
      description: 'Suivi quotidien des achats réels pour garder le contrôle du reste disponible.',
      format: 'Tableau de suivi',
      type: 'tool',
    },
    {
      id: 'plan-1',
      category: 'PLANIFICATION 1',
      title: 'Plan Rentrée Sans Stress',
      description: 'Transformer le budget en étapes concrètes, planifier le calendrier de paiement et les plans B.',
      format: 'Feuille de route',
      type: 'tool',
    },
    {
      id: 'plan-2',
      category: 'PLANIFICATION 2',
      title: 'Plan d’action 30 jours',
      description: 'Programme étape par étape (Jours 1 à 30) pour réduire la pression avant et après la rentrée.',
      format: 'Programme 30 jours',
      type: 'tool',
    },
    {
      id: 'plan-3',
      category: 'PLANIFICATION 3',
      title: 'Fiche d’engagement personnel',
      description: 'Formaliser et signer vos 3 décisions non négociables pour protéger votre foyer.',
      format: 'Contrat personnel',
      type: 'tool',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 py-12 sm:py-16 px-4 font-sans antialiased">
      <main className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
        
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Badge top */}
          <span className="inline-block mt-12 bg-[#FFE2D1] text-[#9C3800] text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full mb-6">
            KIT RENTRÉE DICE 2026 — EXCLUSIF
          </span>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
            Récupérez votre Kit Rentrée <br /> Sans Stress gratuitement
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-xl font-normal leading-relaxed">
            Reprenez le contrôle des finances de votre foyer. Des livres de fond et des outils pratiques éprouvés pour aborder la rentrée avec sérénité et clarté.
          </p>

          {/* CTA & Lock info */}
          <div className="w-full max-w-md flex flex-col items-center">
            <button className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le Pack PDF Complet (Immédiat)
            </button>
            <p className="mt-3 text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Aucune inscription requise. Lien direct (PDF)
            </p>
          </div>

          {/* Mockup Image Box */}
          <div className="w-full max-w-3xl mt-12 bg-white rounded-2xl p-2 sm:p-3 shadow-sm border border-slate-100">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEF0wkJTrUPB31IcbSjYl_eLEhjsDC-dnV_e7k4LtbZ8PPfT6C1LJ0GwiBW8SntxmF9s3O4IegSqnWXL-NgFyqtui8UoCkIGw3pN5Rp2QKdBvJflpRIEweFGUv7vMfJs53LmGi5FZZWTUpMQ4YZI_y_uSluRzElgW4AhxCS8tj4TiBTh_pqhDXdrh1e-o3kFPA_s3Gdr2wS9wIx4USbCbnZo6iLvISroaJl2tg0vb5iYdlXuDU2CMZvQ"
              alt="Kit Rentrée DiCe Mockup"
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </section>

        {/* --- RESOURCE GRID SECTION --- */}
        <section className="w-full pt-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-3">
              Toutes les Ressources de votre Kit
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Chaque livre et outil pratique a été spécialement conçu pour vous guider pas à pas vers une gestion budgétaire sereine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* CARDS FOR BOOKS & TOOLS */}
            {resources.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EBF3FF] flex items-center justify-center mb-5 text-[#0066FF]">
                    {item.type === 'book' ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[11px] font-extrabold text-[#0066FF] tracking-wider uppercase bg-[#EBF3FF] px-2.5 py-1 rounded-md mb-3 inline-block">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0F172A] leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-4 font-medium">{item.format}</p>
                  <button className="w-full border border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-semibold py-2.5 px-4 rounded-xl transition-colors text-xs sm:text-sm">
                    Télécharger
                  </button>
                </div>
              </div>
            ))}

            {/* BONUS CARD */}
            <div className="bg-[#FFE2D1] rounded-2xl p-6 border border-[#FFD0B8] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#FFCEB3] flex items-center justify-center text-[#9C3800]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="bg-[#9C3800] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                    BONUS
                  </span>
                </div>
                <span className="text-[11px] font-extrabold text-[#9C3800] tracking-wider uppercase bg-[#FFCEB3] px-2.5 py-1 rounded-md mb-3 inline-block">
                  PROLONGER L'EXPÉRIENCE
                </span>
                <h3 className="text-lg font-extrabold text-[#2C1100] leading-snug mb-2">
                  Replay intégral de la conférence
                </h3>
                <p className="text-[#8C421A] text-xs sm:text-sm leading-relaxed mb-4">
                  Accès permanent au contenu exclusif du Dr T. G. Sonffo pour approfondir votre démarche à votre rythme.
                </p>
              </div>
              <div>
                <p className="text-[#9C3800]/70 text-xs mb-4 font-medium">Vidéo HD &amp; Audio</p>
                <button className="w-full bg-[#9C3800] hover:bg-[#802E00] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-xs sm:text-sm">
                  Accéder au Replay
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}