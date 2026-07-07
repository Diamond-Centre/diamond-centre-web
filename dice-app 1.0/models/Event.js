// --- MONGOOSE MODEL DISABLED FOR LOCAL DEV (not used — app uses Prisma/mock data) ---
// Ce fichier n'est pas importé dans l'application.

/*
import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['seminaire', 'conference', 'atelier'],
    required: true,
  },
  image: {
    type: String,
    default: '/images/events/placeholder.jpg',
  },
  price: {
    type: Number,
    required: true,
  },
  promotion: {
    type: Boolean,
    default: false,
  },
  originalPrice: {
    type: Number,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
}, { timestamps: true })

export default mongoose.models.Event || mongoose.model('Event', EventSchema)
*/

export default null
