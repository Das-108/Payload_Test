import { NextResponse } from 'next/server'

export const GET = async () => {
  return NextResponse.json({ message: 'Seeding has been disabled for this project structure.' })
}