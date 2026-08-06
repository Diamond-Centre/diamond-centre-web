import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-here'

// Vérification admin
async function verifyAdmin(request) {
  const token = cookies().get('admin_token')?.value
  if (!token) {
    return { error: 'Non authentifié', status: 401 }
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'admin') {
      return { error: 'Accès non autorisé', status: 403 }
    }
    return { user: decoded }
  } catch (error) {
    return { error: 'Token invalide', status: 401 }
  }
}

// Générer un nom de fichier unique
function generateFileName(originalName) {
  const ext = path.extname(originalName)
  const name = path.basename(originalName, ext)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${name}-${timestamp}-${random}${ext}`
}

export async function POST(request) {
  try {
    // Vérification admin
    const auth = await verifyAdmin(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    // Récupération du fichier
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) {
      return NextResponse.json(
        { error: 'Aucune image fournie' },
        { status: 400 }
      )
    }

    // Vérification du type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez JPEG, PNG, WebP, GIF ou SVG' },
        { status: 400 }
      )
    }

    // Vérification de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 5MB)' },
        { status: 400 }
      )
    }

    // Création du dossier s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'events')
    await mkdir(uploadDir, { recursive: true })

    // Génération du nom de fichier
    const fileName = generateFileName(file.name)
    const filePath = path.join(uploadDir, fileName)

    // Conversion du fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sauvegarde du fichier
    await writeFile(filePath, buffer)

    // URL publique de l'image
    const imageUrl = `/images/events/${fileName}`

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: 'Image uploadée avec succès'
    })

  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}