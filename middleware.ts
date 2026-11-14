import { NextResponse, type NextRequest } from "next/server"

// Saves the visitor's country (from Vercel) so the website shows their language automatically.
export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const cc = req.headers.get("x-vercel-ip-country")
  if (cc && req.cookies.get("cc")?.value !== cc) res.cookies.set("cc", cc, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" })
  return res
}

export const config = { matcher: ["/", "/activate"] }
