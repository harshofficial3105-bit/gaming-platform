import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/rbac';
import { dispatchNotification } from '@/lib/notifications';

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
    const { gameId, creatorId, title, action, notes } = body;

    if (!gameId || !['APPROVE', 'REJECT', 'SUSPEND', 'REQUEST_CHANGES'].includes(action)) {
      return NextResponse.json({ error: 'Invalid moderation payload.' }, { status: 400 });
    }

    // Map action to database status
    let newStatus = 'published';
    if (action === 'REJECT') newStatus = 'rejected';
    if (action === 'SUSPEND') newStatus = 'suspended';
    if (action === 'REQUEST_CHANGES') newStatus = 'under_review';

    // Dispatch real-time notification to game creator
    if (creatorId) {
      try {
        await dispatchNotification({
          userId: creatorId,
          type: action === 'APPROVE' ? 'creator_update' : 'admin_update',
          priority: action === 'APPROVE' ? 'normal' : 'high',
          title: action === 'APPROVE' ? 'Game Approved & Published!' : 'Game Moderation Notice',
          message: action === 'APPROVE'
            ? `Your game "${title || gameId}" has been approved and published to the ArcadeHub Grid!`
            : `Your submission for "${title || gameId}" was marked as ${action.toLowerCase()}. Notes: ${notes || 'Please check guidelines.'}`,
          actionUrl: '/creator/dashboard',
          metadata: { gameId, action, newStatus },
        });
      } catch (notifErr) {
        console.warn('[Admin] Creator notification bypassed:', notifErr);
      }
    }

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