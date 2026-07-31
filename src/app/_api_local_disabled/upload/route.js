import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucune image fournie' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté' },
        { status: 400 }
      )
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 5MB)' },
        { status: 400 }
      )
    }

    // Créer un nom de fichier unique
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const filename = `event_${timestamp}_${file.name.replace(/\s/g, '_')}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events')
    
    // Créer le dossier s'il n'existe pas
    await mkdir(uploadDir, { recursive: true })
    
    // Sauvegarder le fichier
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    // Retourner l'URL publique
    const imageUrl = `/uploads/events/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      filename: filename
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}

// Limiter la taille du body
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}