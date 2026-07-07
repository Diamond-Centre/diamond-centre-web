import * as yup from 'yup'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

// Validateur pour les événements
export const eventSchema = yup.object({
  title: yup.string().required('Le titre est requis').min(3, 'Minimum 3 caractères'),
  description: yup.string().required('La description est requise').min(10, 'Minimum 10 caractères'),
  type: yup.string().oneOf(['seminaire', 'conference', 'atelier']).required('Le type est requis'),
  price: yup.number().positive('Le prix doit être positif').required('Le prix est requis'),
  date: yup.date().required('La date est requise'),
  duration: yup.number().positive('La durée doit être positive').required('La durée est requise'),
  location: yup.string().required('Le lieu est requis'),
  instructor: yup.string().required('Le formateur est requis'),
  totalSeats: yup.number().positive('Le nombre de places doit être positif').required('Le nombre de places est requis'),
  availableSeats: yup.number().positive('Le nombre de places disponibles doit être positif'),
})

// Validateur pour l'inscription
export const registerSchema = yup.object({
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  telephone: yup.string().required('Le téléphone est requis'),
  sexe: yup.string().oneOf(['M', 'F']).required('Le sexe est requis'),
  password: yup.string().min(6, 'Minimum 6 caractères').required('Le mot de passe est requis'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
})

// Validateur pour la connexion
export const loginSchema = yup.object({
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().required('Le mot de passe est requis'),
})

// Formatage de date
export const formatDate = (date) => {
  if (!date) return ''
  const parsed = typeof date === 'string' ? parseISO(date) : date
  return format(parsed, 'dd MMMM yyyy', { locale: fr })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  const parsed = typeof date === 'string' ? parseISO(date) : date
  return format(parsed, 'dd MMMM yyyy à HH:mm', { locale: fr })
}

// Génération de code unique pour les tickets
export const generateTicketCode = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}