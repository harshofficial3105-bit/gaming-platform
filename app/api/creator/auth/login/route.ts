import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Authenticated successfully.',
      creator: {
        email: email.trim().toLowerCase(),
      },
    });
  } catch (err) {
    console.error('Creator Login API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}