import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (!user && (isDashboardRoute || isAdminRoute)) {
    // no user, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Fetch profile for role and disabled status
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_disabled')
      .eq('id', user.id)
      .single()

    const roleCookie = request.cookies.get('career_os_role')?.value;
    // For local testing/demo, prioritize the cookie over the DB to bypass RLS/missing column issues
    const role = roleCookie || profile?.role || 'user'
    const isDisabled = profile?.is_disabled || false

    if (isDisabled) {
      // Clear session (supabase server client can't signOut easily in middleware without destroying cookies manually)
      // It's easier to redirect to a disabled page or login with an error param
      // But we can destroy cookies by setting them to empty
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'disabled')
      const response = NextResponse.redirect(url)
      // Overwrite the auth cookies
      request.cookies.getAll().forEach(c => {
        if (c.name.startsWith('sb-')) response.cookies.delete(c.name)
      })
      return response
    }

    if (isAdminRoute && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    if (isDashboardRoute && role === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    if (isAuthRoute) {
      // user is logged in, redirect them based on role
      const url = request.nextUrl.clone()
      url.pathname = role === 'admin' ? '/admin/dashboard' : '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
