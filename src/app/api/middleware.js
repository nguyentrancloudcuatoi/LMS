import { NextResponse } from 'next/server';
import checkToken from '@/utils/checkToken';

export async function middleware(request) {
  const { user, error } = await checkToken(request);
  if (error || !user) {
    return NextResponse.json(
      { air: 0, mes: error || 'Authentication failed', data: null },
      { status: 401 }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};