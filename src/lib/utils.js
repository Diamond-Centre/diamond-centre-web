/**
 * Utilitaires pour les classes CSS
 * Combine les classes CSS avec cn (class names)
 */

/**
 * Combine plusieurs classes CSS en une seule chaîne
 * Filtre les valeurs falsy (false, null, undefined, '')
 * @param {...any} classes - Classes CSS à combiner
 * @returns {string} Chaîne de classes CSS combinée
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Formate une date en chaîne lisible
 * @param {Date|string} date - Date à formater
 * @param {Object} options - Options de formatage (locale, etc.)
 * @returns {string} Date formatée
 */
export function formatDate(date, options = {}) {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) return ''
  
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  }
  
  return d.toLocaleDateString('fr-FR', defaultOptions)
}

/**
 * Tronque un texte à une longueur maximale
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @param {string} suffix - Suffixe à ajouter (défaut: '...')
 * @returns {string} Texte tronqué
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + suffix
}

/**
 * Génère un identifiant unique
 * @returns {string} ID unique
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * Vérifie si une chaîne est un email valide
 * @param {string} email - Email à valider
 * @returns {boolean} True si l'email est valide
 */
export function isValidEmail(email) {
  if (!email) return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Vérifie si une chaîne est un numéro de téléphone valide (10 chiffres)
 * @param {string} phone - Numéro de téléphone
 * @returns {boolean} True si valide
 */
export function isValidPhone(phone) {
  if (!phone) return false
  const regex = /^[0-9]{10}$/
  return regex.test(phone.replace(/\s/g, ''))
}

/**
 * Formate un prix en euros
 * @param {number} price - Prix
 * @param {string} currency - Devise (défaut: '€')
 * @returns {string} Prix formaté
 */
export function formatPrice(price, currency = '€') {
  if (typeof price !== 'number') return ''
  return `${price.toFixed(2)} ${currency}`
}

/**
 * Calcule le pourcentage de réduction
 * @param {number} originalPrice - Prix original
 * @param {number} discountedPrice - Prix avec réduction
 * @returns {number} Pourcentage de réduction
 */
export function calculateDiscount(originalPrice, discountedPrice) {
  if (!originalPrice || !discountedPrice) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

/**
 * Vérifie si une date est passée
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean} True si la date est passée
 */
export function isDatePast(date) {
  if (!date) return false
  const d = typeof date === 'string' ? new Date(date) : date
  return d < new Date()
}

/**
 * Retourne le nombre de jours restants avant une date
 * @param {Date|string} date - Date cible
 * @returns {number} Nombre de jours restants
 */
export function daysUntil(date) {
  if (!date) return 0
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Crée une URL avec des paramètres de requête
 * @param {string} baseUrl - URL de base
 * @param {Object} params - Paramètres de requête
 * @returns {string} URL avec paramètres
 */
export function buildUrl(baseUrl, params = {}) {
  const url = new URL(baseUrl, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}

/**
 * Copie un texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} Succès ou échec
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    return false
  }
}

/**
 * Génère un code aléatoire de longueur spécifiée
 * @param {number} length - Longueur du code
 * @param {string} chars - Caractères autorisés
 * @returns {string} Code aléatoire
 */
export function generateRandomCode(length = 8, chars = '0123456789') {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Groupe un tableau d'objets par une clé
 * @param {Array} array - Tableau à grouper
 * @param {string} key - Clé de regroupement
 * @returns {Object} Objet groupé
 */
export function groupBy(array, key) {
  if (!array || !Array.isArray(array)) return {}
  return array.reduce((result, item) => {
    const groupKey = item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}

/**
 * Trie un tableau d'objets par une clé
 * @param {Array} array - Tableau à trier
 * @param {string} key - Clé de tri
 * @param {string} order - Ordre 'asc' ou 'desc'
 * @returns {Array} Tableau trié
 */
export function sortBy(array, key, order = 'asc') {
  if (!array || !Array.isArray(array)) return []
  const sorted = [...array]
  sorted.sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
  return sorted
}

/**
 * Filtre un tableau par une valeur de recherche
 * @param {Array} array - Tableau à filtrer
 * @param {string} searchTerm - Terme de recherche
 * @param {Array<string>} keys - Clés à rechercher
 * @returns {Array} Tableau filtré
 */
export function filterBySearch(array, searchTerm, keys = []) {
  if (!array || !Array.isArray(array)) return []
  if (!searchTerm) return array
  
  const term = searchTerm.toLowerCase()
  return array.filter(item => {
    return keys.some(key => {
      const value = item[key]
      if (!value) return false
      return String(value).toLowerCase().includes(term)
    })
  })
}

export default {
  cn,
  formatDate,
  truncateText,
  generateId,
  isValidEmail,
  isValidPhone,
  formatPrice,
  calculateDiscount,
  isDatePast,
  daysUntil,
  buildUrl,
  copyToClipboard,
  generateRandomCode,
  groupBy,
  sortBy,
  filterBySearch
}