import React from 'react';

export const metadata = {
  title: 'DiCe - Kit Rentrée Sans Stress',
  description: 'Reprenez le contrôle des finances de votre foyer avec le Kit Rentrée Sans Stress.',
};

export default function KitRentreePage() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 py-12 sm:py-16 px-4 font-sans antialiased">
      <main className="max-w-4xl mx-auto space-y-16 sm:space-y-20">
        
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Badge top */}
          <span className="inline-block mt-24 bg-[#FFE2D1] text-[#9C3800] text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full mb-6">
            KIT RENTRÉE DICE 2026 — EXCLUSIF
          </span>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
            Récupérez votre Kit Rentrée <br /> Sans Stress gratuitement
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-xl font-normal leading-relaxed">
            Reprenez le contrôle des finances de votre foyer. Des outils pratiques et éprouvés pour aborder la rentrée avec sérénité et clarté.
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
              Aucune inscription requise. Lien direct (PDF/DOC)
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] text-center mb-10">
            Les 4 Ressources de votre Kit
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARD 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FF] flex items-center justify-center mb-6 text-[#0066FF]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">LIVRE 1</h3>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight mb-4">
                  LA FIN DU CYCLE DE PAUVRETÉ
                </h4>
                <p className="text-slate-400 text-sm mb-8">Format PDF, 150 pages.</p>
              </div>
              <button className="w-full border border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
                Télécharger le Livre 1
              </button>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FF] flex items-center justify-center mb-6 text-[#0066FF]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.2.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">LIVRE 2</h3>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight mb-4">
                  L'INDÉPENDANCE FINANCIÈRE DE LA FAMILLE
                </h4>
                <p className="text-slate-400 text-sm mb-8">Format PDF, 120 pages.</p>
              </div>
              <button className="w-full border border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
                Télécharger le Livre 2
              </button>
            </div>

            {/* CARD 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FF] flex items-center justify-center mb-6 text-[#0066FF]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1 0-1.3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">OUTILS</h3>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight mb-4">
                  FICHES PRATIQUES DE GESTION FINANCIÈRE &amp; GRILLES DE RENTRÉE
                </h4>
                <p className="text-slate-400 text-sm mb-8">Modèles prêts à l'emploi.</p>
              </div>
              <button className="w-full border border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
                Télécharger les Fiches
              </button>
            </div>

            {/* CARD 4 (BONUS) */}
            <div className="bg-[#FFE2D1] rounded-2xl p-6 sm:p-8 border border-[#FFD0B8] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#FFCEB3] flex items-center justify-center text-[#9C3800]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="bg-[#9C3800] text-white text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider">
                    BONUS
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2C1100] leading-snug mb-3">
                  Accès permanent au replay exclusif de la conférence
                </h3>
                <p className="text-[#8C421A] text-sm mb-8">
                  Revivez les moments clés à votre rythme.
                </p>
              </div>
              <button className="w-full bg-[#9C3800] hover:bg-[#802E00] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm">
                Accéder au Replay
              </button>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}