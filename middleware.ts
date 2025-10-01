import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/:path*', // Protects all routes
}


// export function middleware(req: NextRequest) {
//   const basicAuth = req.headers.get('authorization')

//   if (basicAuth) {
//     const authValue = basicAuth.split(' ')[1]
//     const [user, pwd] = atob(authValue).split(':')

//     if (user === 'WHR8472' && pwd === 'jf2893VDgdSW') {
//       return NextResponse.next() // Allow access
//     }
//   }

//   // Request authentication
//   return new NextResponse('Unauthorized', {
//     status: 401,
//     headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
//   })
// }

// Simply allow all requests to pass through without authentication
export function middleware(req: NextRequest) {
  return NextResponse.next()
}
