import { getToken } from 'next-auth/jwt'
import middleware, { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })

    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/register')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return null
    }

    if (
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/public')
    ) {
      return NextResponse.next() // Skip for internal routes and public files
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(new URL(`/login`, req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        return true
      },
    },
  },
)

export const config = {
  matcher: ['/login', '/register', middleware],
}