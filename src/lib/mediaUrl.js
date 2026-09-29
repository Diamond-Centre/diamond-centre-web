/**
 * Résout les URLs d'images renvoyées par l'API en URLs absolues utilisables
 * par le navigateur.
 *
 * Le backend peut stocker `image_url` sous forme de chemin relatif
 * (ex. "/uploads/event_123.jpg", servi par Express) ou d'URL déjà absolue
 * (http(s):// ou data:). Le frontend Next.js et l'API backend étant deux
 * origines différentes (voir NEXT_PUBLIC_API_URL), un chemin relatif se
 * résout par défaut contre le domaine du frontend et casse — d'où l'image
 * qui ne s'affiche jamais sur la page publique une fois déployé.
 *
 * Cette fonction préfixe donc les chemins relatifs avec l'origine de l'API
 * (déduite de NEXT_PUBLIC_API_URL), et laisse inchangées les URLs déjà
 * absolues ou en data:/blob:.
 *
 * Volontairement indépendant de lib/api.js (pas d'import croisé) pour éviter
 * tout souci de dépendance circulaire ou d'export renommé.
 */
const RAW_API_URL = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/+$/, '')

let cachedOrigin
let cachedFromApiUrl

function apiOrigin() {
  if (cachedFromApiUrl === RAW_API_URL) return cachedOrigin
  cachedFromApiUrl = RAW_API_URL

  if (!RAW_API_URL || RAW_API_URL.startsWith('/')) {
    // NEXT_PUBLIC_API_URL absent ou relatif ("/api") : l'API est servie
    // sur la même origine que le frontend (proxy/rewrite), rien à préfixer.
    cachedOrigin = ''
    return cachedOrigin
  }

  try {
    cachedOrigin = new URL(RAW_API_URL).origin
  } catch {
    cachedOrigin = ''
  }
  return cachedOrigin
}

export function toAbsoluteMediaUrl(url) {
  if (!url || typeof url !== 'string') return null
  if (/^(https?:|data:|blob:)/i.test(url)) return url

  const origin = apiOrigin()
  if (!origin) return url

  const path = url.startsWith('/') ? url : `/${url}`
  return `${origin}${path}`
}