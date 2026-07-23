import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { AdminModel } from '@/models/Admin'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-here'

export async function GET() {
  try {
    const token = cookies().get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const admin = AdminModel.getAdmin()
    
    if (!admin || admin.id !== decoded.id) {
      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 401 }
      )
    }

    return NextResponse.json({ admin })

  } catch (error) {
    return NextResponse.json(
      { error: 'Session expirée' },
      { status: 401 }
    )
  }
}