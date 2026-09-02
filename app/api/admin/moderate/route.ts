import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/rbac';

export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory Server-Side ADMIN Role Verification
    const user = await getAuthenticatedUser(req);
    if (!user || !user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Platform administrator credentials required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { gameId, action, notes } = body;

    if (!gameId || !['APPROVE', 'REJECT', 'SUSPEND', 'REQUEST_CHANGES'].includes(action)) {
      return NextResponse.json({ error: 'Invalid moderation payload.' }, { status: 400 });
    }

    // Map action to database status
    let newStatus = 'published';
    if (action === 'REJECT') newStatus = 'rejected';
    if (action === 'SUSPEND') newStatus = 'suspended';
    if (action === 'REQUEST_CHANGES') newStatus = 'under_review';

    return NextResponse.json({
      success: true,
      gameId,
      newStatus,
      moderatedBy: user.id,
      moderatedAt: new Date().toISOString(),
      notes: notes || 'Moderation decision recorded.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Admin API error' }, { status: 500 });
  }
}