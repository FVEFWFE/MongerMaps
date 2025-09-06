import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '~/server/auth';
import { whop } from '~/lib/whop';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Get user memberships from Whop
      // Note: The exact API call might vary depending on Whop's SDK structure
      const user = await whop.users.getByEmail(session.user.email);
      
      if (!user) {
        // User not found in Whop, return empty memberships
        return NextResponse.json({
          success: true,
          memberships: [],
          user: null,
        });
      }

      // Get user's memberships
      const memberships = user.memberships || [];
      
      // Filter for valid memberships
      const validMemberships = memberships.filter((membership: any) => 
        membership.valid === true
      );

      return NextResponse.json({
        success: true,
        memberships: validMemberships,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });

    } catch (whopError: any) {
      console.error('Whop API error:', whopError);
      
      // If user not found, return empty result instead of error
      if (whopError.response?.status === 404) {
        return NextResponse.json({
          success: true,
          memberships: [],
          user: null,
        });
      }

      return NextResponse.json(
        { 
          error: 'Failed to fetch memberships', 
          details: whopError.message 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Memberships API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST route to manually sync a user with Whop (if needed)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { whopUserId } = await req.json();

    if (!whopUserId) {
      return NextResponse.json({ error: 'Whop user ID required' }, { status: 400 });
    }

    try {
      // Link the MongerMaps user with their Whop account
      // This might involve updating your local database with the Whop user ID
      
      // For now, just fetch the user to verify they exist
      const whopUser = await whop.users.getUser(whopUserId);
      
      if (whopUser.email !== session.user.email) {
        return NextResponse.json(
          { error: 'Email mismatch between accounts' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Account linked successfully',
        whopUser: {
          id: whopUser.id,
          email: whopUser.email,
          username: whopUser.username,
        },
      });

    } catch (whopError: any) {
      console.error('Whop user sync error:', whopError);
      return NextResponse.json(
        { 
          error: 'Failed to sync with Whop account', 
          details: whopError.message 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('User sync API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}