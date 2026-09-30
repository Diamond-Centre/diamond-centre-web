export default function DiamondCrystal() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: '100%', height: '520px' }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(0,87,255,0.22) 0%, rgba(0,200,255,0.08) 50%, transparent 75%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Floating crystal fragments */}
      <Fragment delay={0} x={-170} y={-120} size={28} rotate={12} />
      <Fragment delay={1.5} x={160} y={-140} size={20} rotate={-20} />
      <Fragment delay={0.8} x={-180} y={80} size={16} rotate={35} />
      <Fragment delay={2.2} x={170} y={100} size={22} rotate={-8} />
      <Fragment delay={1.1} x={-60} y={-190} size={14} rotate={45} />
      <Fragment delay={1.8} x={80} y={200} size={18} rotate={-30} />
      <Fragment delay={0.4} x={200} y={-30} size={12} rotate={22} />
      <Fragment delay={2.8} x={-190} y={-10} size={10} rotate={60} />

      {/* Main diamond crystal */}
      <div
        className="relative animate-float"
        style={{
          zIndex: 10,
          width: '240px',
          height: '300px',
          filter: 'drop-shadow(0 0 30px rgba(0,87,255,0.5)) drop-shadow(0 0 60px rgba(0,200,255,0.2))',
        }}
      >
        <svg
          viewBox="0 0 240 300"
          width="240"
          height="300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Main crystal gradient - front face */}
            <linearGradient id="grad-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#99BBFF" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#2979FF" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#0046CC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#001a66" stopOpacity="0.95" />
            </linearGradient>

            {/* Top face */}
            <linearGradient id="grad-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8F0FF" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#99C0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2979FF" stopOpacity="0.6" />
            </linearGradient>

            {/* Left face */}
            <linearGradient id="grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5599FF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#001a66" stopOpacity="0.9" />
            </linearGradient>

            {/* Right face */}
            <linearGradient id="grad-right" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C0D8FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#4488EE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0030AA" stopOpacity="0.95" />
            </linearGradient>

            {/* Bottom left face */}
            <linearGradient id="grad-bl" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3366DD" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00088A" stopOpacity="0.95" />
            </linearGradient>

            {/* Bottom right face */}
            <linearGradient id="grad-br" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7AABFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#001a66" stopOpacity="0.9" />
            </linearGradient>

            {/* Highlight reflection */}
            <linearGradient id="grad-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Cyan refraction streak */}
            <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#00C8FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00C8FF" stopOpacity="0.0" />
            </linearGradient>

            {/* Violet refraction */}
            <linearGradient id="grad-violet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8844FF" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#8844FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8844FF" stopOpacity="0.0" />
            </linearGradient>

            <filter id="crystal-blur">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>

          {/* Diamond shape: classic brilliant cut from front */}
          {/* Table (top flat face) */}
          <polygon
            points="120,10 200,80 160,80 120,50 80,80 40,80"
            fill="url(#grad-top)"
            opacity="0.95"
          />

          {/* Upper left crown facet */}
          <polygon
            points="40,80 120,50 120,80"
            fill="url(#grad-left)"
            opacity="0.9"
          />

          {/* Upper right crown facet */}
          <polygon
            points="200,80 120,50 120,80"
            fill="url(#grad-right)"
            opacity="0.9"
          />

          {/* Crown left main */}
          <polygon
            points="10,120 40,80 120,80"
            fill="url(#grad-left)"
            opacity="0.85"
          />

          {/* Crown right main */}
          <polygon
            points="230,120 200,80 120,80"
            fill="url(#grad-right)"
            opacity="0.85"
          />

          {/* Girdle center-left */}
          <polygon
            points="10,120 120,80 120,140"
            fill="url(#grad-bl)"
            opacity="0.88"
          />

          {/* Girdle center-right */}
          <polygon
            points="230,120 120,80 120,140"
            fill="url(#grad-br)"
            opacity="0.88"
          />

          {/* Pavilion left */}
          <polygon
            points="10,120 120,140 70,200"
            fill="url(#grad-left)"
            opacity="0.9"
          />

          {/* Pavilion right */}
          <polygon
            points="230,120 120,140 170,200"
            fill="url(#grad-right)"
            opacity="0.9"
          />

          {/* Lower pavilion left */}
          <polygon
            points="70,200 120,140 120,290"
            fill="url(#grad-bl)"
            opacity="0.92"
          />

          {/* Lower pavilion right */}
          <polygon
            points="170,200 120,140 120,290"
            fill="url(#grad-br)"
            opacity="0.92"
          />

          {/* Center star facets */}
          <polygon
            points="120,80 70,120 120,140"
            fill="url(#grad-highlight)"
            opacity="0.3"
          />
          <polygon
            points="120,80 170,120 120,140"
            fill="url(#grad-front)"
            opacity="0.2"
          />

          {/* Cyan refraction streak */}
          <polygon
            points="80,80 120,50 120,140 60,130"
            fill="url(#grad-cyan)"
            opacity="0.4"
          />

          {/* Violet refraction */}
          <polygon
            points="160,80 200,80 170,200 140,140"
            fill="url(#grad-violet)"
            opacity="0.25"
          />

          {/* Primary specular highlight */}
          <polygon
            points="100,20 140,20 130,70 110,70"
            fill="url(#grad-highlight)"
            opacity="0.7"
          />

          {/* Secondary specular */}
          <ellipse
            cx="85"
            cy="105"
            rx="12"
            ry="8"
            fill="white"
            opacity="0.35"
            transform="rotate(-20, 85, 105)"
          />

          {/* Outline edges — very subtle */}
          <polygon
            points="120,10 200,80 230,120 170,200 120,290 70,200 10,120 40,80"
            fill="none"
            stroke="rgba(100,170,255,0.25)"
            strokeWidth="0.8"
          />
          <line x1="120" y1="10" x2="120" y2="80" stroke="rgba(200,220,255,0.3)" strokeWidth="0.5" />
          <line x1="40" y1="80" x2="120" y2="140" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
          <line x1="200" y1="80" x2="120" y2="140" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
          <line x1="10" y1="120" x2="230" y2="120" stroke="rgba(100,150,255,0.15)" strokeWidth="0.5" />
          <line x1="120" y1="140" x2="120" y2="290" stroke="rgba(150,190,255,0.2)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Words: APPRENDRE · ÉVOLUER · RÉUSSIR */}
      <div
        className="absolute right-0 top-1/2 flex flex-col gap-6"
        style={{
          transform: 'translateY(-50%)',
          right: '0px',
        }}
      >
        {['APPRENDRE', 'ÉVOLUER', 'RÉUSSIR'].map((word, i) => (
          <div
            key={word}
            className="flex items-center gap-2"
            style={{
              animationDelay: `${i * 0.4}s`,
            }}
          >
            <div
              style={{
                width: '24px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #0057FF)',
              }}
            />
            <span
              style={{
                fontFamily: 'Barlow Condensed',
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
              }}
            >
              {word}
            </span>
          </div>
        ))}
      </div>

      {/* Quote below diamond */}
      <div
        className="absolute bottom-0 left-0 right-0 text-center px-4"
        style={{ bottom: '4px' }}
      >
        <p
          style={{
            fontFamily: 'Outfit',
            fontStyle: 'italic',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.04em',
          }}
        >
          "Un écosystème d'opportunités pour révéler votre plein potentiel."
        </p>
      </div>
    </div>
  )
}

function Fragment({
  delay,
  x,
  y,
  size,
  rotate,
}: {
  delay: number
  x: number
  y: number
  size: number
  rotate: number
}) {
  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        animation: `float ${5 + delay}s ${delay}s ease-in-out infinite`,
        zIndex: 5,
        opacity: 0.6,
      }}
    >
      <svg
        width={size}
        height={size * 1.25}
        viewBox="0 0 20 25"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(${rotate}deg)`, filter: 'drop-shadow(0 0 6px rgba(0,87,255,0.7))' }}
      >
        <defs>
          <linearGradient id={`fg-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#99CCFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2979FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#001a66" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <polygon
          points="10,0 18,7 15,14 10,24 5,14 2,7"
          fill={`url(#fg-${x}-${y})`}
          stroke="rgba(150,200,255,0.4)"
          strokeWidth="0.8"
        />
        <polygon
          points="10,0 18,7 10,10 2,7"
          fill="rgba(200,220,255,0.4)"
        />
      </svg>
    </div>
  )
}
