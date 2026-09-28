/**
 * Images de la page d'accueil (refonte DiCe).
 *
 * Toutes les images passent par <SafeImage /> : si une URL est indisponible,
 * l'image est simplement masquée et le dégradé de la section reste visible
 * (aucune image cassée).
 *
 * Pour utiliser vos propres photos : remplacez l'URL par un chemin local
 * (ex. '/images/home/formations.jpg', fichier placé dans public/images/home/).
 */

// Photos Unsplash (domaine déjà autorisé dans next.config.js)
const unsplash = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const HOME_IMAGES = {
  // Panneaux plein écran (Formations / Ateliers / Réseautage)
  panels: {
    formations: unsplash('photo-1524178232363-1fb2b075b655', 1920),
    conferences: unsplash('photo-1540575467063-178a50c2df87', 1920),
    ateliers: unsplash('photo-1552664730-d307ca884978', 1920),
    reseautage: unsplash('photo-1515187029135-18ee286d815b', 1920),
  },

  // Section mission : photo locale (recadrée depuis la maquette) + repli en ligne
  mission: {
    src: '/images/home/mission.jpg',
    fallback: unsplash('photo-1475721027785-f74eccf877e2', 1200),
  },

  // Repli des cartes événements quand l'événement n'a pas d'image_url
  eventFallbacks: {
    conference: unsplash('photo-1505373877841-8d25f7d46678', 900),
    formation: unsplash('photo-1531482615713-2afd69097998', 900),
    atelier: unsplash('photo-1475721027785-f74eccf877e2', 900),
    default: unsplash('photo-1540575467063-178a50c2df87', 900),
  },

  // Intervenants
  speakers: {
    kofi: unsplash('photo-1531384441138-2736e62e0919', 800),
    amina: unsplash('photo-1589156280159-27698a70f29e', 800),
    jeanBaptiste: unsplash('photo-1560250097-0b93528c311a', 800),
    ngozi: unsplash('photo-1573496359142-b8d87734a5a2', 800),
  },
}
