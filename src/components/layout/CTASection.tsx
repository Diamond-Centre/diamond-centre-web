export default function Community() {
  return (
    <section
      style={{
        position: 'relative',
        padding: '120px 0',
        background: '#04091E',
        overflow: 'hidden',
      }}
    >
      {/* Background elements */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(0,87,255,0.1) 0%, transparent 70%)',
          }}
        />
        {/* Decorative large "D" watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-4%',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'Barlow Condensed',
            fontWeight: 900,
            fontSize: '500px',
            color: 'rgba(0,87,255,0.03)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.05em',
          }}
        >
          D
        </div>
      </div>

      <div
        className="relative max-w-4xl mx-auto px-6 text-center"
        style={{ zIndex: 10 }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <div
            className="glow-line glow-line-d1"
            style={{ width: '32px', height: '1px', background: '#2979FF' }}
          />
          <span
            className="glow-label glow-label-d1"
            style={{
              fontFamily: 'Outfit',
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: '#2979FF',
              textTransform: 'uppercase',
            }}
          >
            COMMUNAUTÉ
          </span>
          <div
            className="glow-line glow-line-d1"
            style={{ width: '32px', height: '1px', background: '#2979FF' }}
          />
        </div>

        <h2
          style={{
            fontFamily: 'Barlow Condensed',
            fontWeight: 900,
            fontSize: 'clamp(44px, 7vw, 90px)',
            color: '#ffffff',
            lineHeight: 0.92,
            marginBottom: '28px',
          }}
        >
          REJOIGNEZ
          <br />
          <span
            style={{
              color: '#2979FF',
              textShadow: '0 0 60px rgba(41,121,255,0.4)',
            }}
          >
            LA COMMUNAUTÉ
          </span>
          <br />
          DIAMOND CENTRE
        </h2>

        <p
          style={{
            fontFamily: 'Outfit',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 48px',
          }}
        >
          Plus de 10 000 professionnels africains ont déjà rejoint un écosystème
          d'opportunités, de mentorat et d'excellence. Le prochain, c'est vous.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#register"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all duration-300"
            style={{
              fontFamily: 'Outfit',
              background: 'linear-gradient(135deg, #0057FF 0%, #2979FF 100%)',
              color: '#ffffff',
              borderRadius: '3px',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontSize: '12px',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.boxShadow =
                '0 8px 40px rgba(0,87,255,0.55)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            S'inscrire gratuitement
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="#events"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium transition-all duration-300"
            style={{
              fontFamily: 'Outfit',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.15)',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontSize: '12px',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor =
                'rgba(0,87,255,0.5)'
              ;(e.currentTarget as HTMLElement).style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor =
                'rgba(255,255,255,0.15)'
              ;(e.currentTarget as HTMLElement).style.color =
                'rgba(255,255,255,0.6)'
            }}
          >
            Explorer les programmes
          </a>
        </div>

        {/* Social proof */}
        <div
          className="flex items-center justify-center gap-2 mt-14"
        >
          <div className="flex -space-x-2">
            {[
              'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=48&h=48&fit=crop',
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=48&h=48&fit=crop',
              'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=48&h=48&fit=crop',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop',
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Membre"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #04091E',
                  objectFit: 'cover',
                  zIndex: 4 - i,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: 'Outfit',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              marginLeft: '8px',
            }}
          >
            +10 000 professionnels nous ont déjà rejoints
          </span>
        </div>
      </div>
    </section>
  )
}
