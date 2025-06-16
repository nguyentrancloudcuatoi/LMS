import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
}