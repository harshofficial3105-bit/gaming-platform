import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedCreatorId = searchParams.get('creatorId');

    // 1. Mandatory Server-Side Authentication
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required to access creator games.' },
        { status: 401 }
      );
    }

    // 2. Role Check
    if (!user.roles.includes('CREATOR') && !user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: User account does not possess CREATOR permissions.' },
        { status: 403 }
      );
    }

    // 3. Cross-Tenant ID Verification
    // A creator can ONLY query their own games. Only ADMIN can query across studios.
    const effectiveCreatorId = requestedCreatorId || user.id;
    if (effectiveCreatorId !== user.id && !user.roles.includes('ADMIN')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: Cross-tenant access violation. You cannot view another creator studio catalog.',
        },
        { status: 403 }
      );
    }

    // In production database, this executes: SELECT * FROM games WHERE creator_id = :effectiveCreatorId
    return NextResponse.json({
      success: true,
      creatorId: effectiveCreatorId,
      games: [],
    });
  } catch (err: any) {
    console.error('Creator Games API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}