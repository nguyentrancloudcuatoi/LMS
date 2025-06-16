import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const response = await fetch('https://api-auth.s4h.edu.vn/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      return new Response(JSON.stringify({ air: 0, data: null, mes: 'Tài khoản hoặc mật khẩu không chính xác' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', },
      });
    }
    let data = await response.json();

    const checkuser3 = await fetch('https://api-auth.s4h.edu.vn/users/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.accessToken}`
      },
    })

    if (!checkuser3.ok) {
      let errorResponse = await checkuser3.json();
      return new Response(JSON.stringify({ air: 0, data: null, error: errorResponse.error }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', },
      });
    }
    let f = await checkuser3.json()
    const accessToken = jwt.sign({ user: f }, process.env.JWT_SECRET);

    const cookieStore = cookies();
    cookieStore.set('token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10
    });
    return new Response(JSON.stringify({ air: 0, data, mes: 'Đăng nhập thành công' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', },
    });
  }
}

// Xử lý preflight request (OPTIONS)