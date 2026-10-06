/**
 * Mosaïque de carrés de la carte « prochain rendez-vous » (accueil uniquement).
 * Cotes mesurées sur le Figma : 14 colonnes × 5 lignes (≈ 84,4 × 68,8 px), écart de 4 px.
 * Les carrés « respirent » en vague de gauche à droite (voir .ec-tiles dans espace-client.css).
 * Valeurs déterministes (pas de Math.random) -> aucun écart d'hydratation SSR.
 */
export default function TileField({ cols = 14, rows = 5 }) {
  const tiles = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      const jitter = ((((i * 2654435761) >>> 0) % 1000) / 1000 - 0.5) * 0.9 // −0,45 … +0,45 s
      tiles.push(
        <i
          key={i}
          style={{ '--c': c, '--r': r, '--j': `${jitter.toFixed(2)}s` }}
        />
      )
    }
  }
  return (
    <div className="ec-tiles" aria-hidden="true" style={{ '--cols': cols, '--rows': rows }}>
      {tiles}
    </div>
  )
}
