import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studioName, fullName, email, password } = body;

    if (!studioName || !fullName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields (Studio Name, Full Name, Email, Password) are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const creatorId = `creator_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const creatorProfile = {
      id: creatorId,
      studioName: studioName.trim(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      createdAt: Date.now(),
    };

    return NextResponse.json({
      success: true,
      message: 'Creator account created successfully.',
      creator: creatorProfile,
    });
  } catch (err) {
    console.error('Creator Signup API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}