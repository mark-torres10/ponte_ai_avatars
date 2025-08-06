import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Redirect to the home page after sign out
  return NextResponse.redirect(new URL('/', request.url))
} 