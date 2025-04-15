import { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - auth (auth pages)
     * - sign-up (sign up page)
     * - forgot-password (forgot password page)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|login|auth|sign-up|forgot-password|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export default async function middleware(request: NextRequest) {
  return await updateSession(request)
}