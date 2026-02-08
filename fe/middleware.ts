import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/register']
export default function middleware(request: NextRequest) {
  // const pathname = request.nextUrl.pathname
  // const locale = request.cookies.get("NEXT_LOCALE")?.value ?? "vi"
  // const originPath = pathname.replace(`/${locale}`, "")
  // const isPublicRoute = publicRoutes.includes(originPath)
  // const token = request.cookies.get("accessToken")?.value
  // if (!token && !isPublicRoute) {
  //   return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  // }
  // if (token && isPublicRoute) {
  //   return NextResponse.redirect(new URL(`/${locale}`, request.url))
  // }
  return createMiddleware(routing)(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
