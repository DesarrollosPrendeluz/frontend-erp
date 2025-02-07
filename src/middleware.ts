// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("erp_token");
  
  if (!token) {
    // Redirige al usuario a la página de inicio si no está autenticado
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si el token existe, continúa con la solicitud
  return NextResponse.next();
}

// Configura las rutas que deben usar este middleware
export const config = {
  matcher: ["/dashboard/:path*", "/"], // Agrega todas las rutas protegidas aquí
};
