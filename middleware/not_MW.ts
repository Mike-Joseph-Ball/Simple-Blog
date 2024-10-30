import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import CurrentFirebaseUserVerify from '@/lib/_firebase/get_current_firebase_userID';

export function middleware() {
    // Call our authentication function to check the request
    if (!CurrentFirebaseUserVerify()) {
      // Respond with JSON indicating an error message
      return Response.json(
        { success: false, message: 'authentication failed' },
        { status: 401 }
      )
    }
  }

export const config = {
    matcher: ['/'], // Apply middleware to these paths
};
