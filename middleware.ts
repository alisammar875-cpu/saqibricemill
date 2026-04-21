import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value

  // We only protect /admin and /account (or /checkout if needed)
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/register')
  const isAccountRoute = pathname.startsWith('/account')

  if (!isAdminRoute && !isAccountRoute) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    
    if (isAdminRoute && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  } catch (err) {
    // Invalid or expired token
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
}