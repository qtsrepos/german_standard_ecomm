import { NextRequest, NextResponse } from 'next/server';

/**
 * NextAuth Error API Route
 *
 * This endpoint handles authentication errors and provides proper error responses
 * for NextAuth.js authentication failures.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');

  console.log('NextAuth Error:', error);

  // Return appropriate error response
  return NextResponse.json(
    {
      error: error || 'Authentication error',
      message: 'An authentication error occurred'
    },
    { status: 401 }
  );
}

export async function POST(request: NextRequest) {
  return GET(request);
}