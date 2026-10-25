import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helper';

export async function GET() {
  try {
    // Authenticate and check if admin
    const currentUser = await requireAuth();
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get base URL from environment
    const baseUrl = process.env.SENTINEL_API_BASE_URL;
    if (!baseUrl) {
      console.error('SENTINEL_API_BASE_URL not configured');
      return NextResponse.json(
        { 
          status: 'unavailable',
          message: 'Service configuration missing'
        },
        { status: 503 }
      );
    }

    // Call Sentinel status endpoint with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${baseUrl}/status`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      // Log response status for debugging
      console.log(`Sentinel status check: HTTP ${response.status}`);

      if (!response.ok) {
        console.error(`Sentinel status check failed: HTTP ${response.status}`);
        return NextResponse.json(
          {
            status: 'offline',
            message: 'Service unavailable'
          },
          { status: 200 } // Return 200 to frontend with offline status
        );
      }

      const data = await response.json();

      // Log the actual response for debugging
      console.log('Sentinel status response:', JSON.stringify(data));

      // Validate response structure - check for various possible structures
      // Expected: { ok: true, nexis: true }
      // Alternative structures might exist, so be flexible
      const isOk = data.ok === true || data.status === 'ok' || data.status === 'online';
      const isNexisOnline = data.nexis === true || data.nexis === 'online' || data.service === 'online';

      if (isOk && isNexisOnline) {
        return NextResponse.json({
          status: 'online',
          message: 'NEXIS is operational'
        });
      } else if (data.ok === false || data.nexis === false || data.status === 'offline' || data.service === 'offline') {
        return NextResponse.json({
          status: 'offline',
          message: 'NEXIS is not operational'
        });
      } else {
        // If structure is unrecognized but response was successful, assume online
        console.warn('Unrecognized Sentinel status structure, assuming online based on successful response');
        return NextResponse.json({
          status: 'online',
          message: 'NEXIS is operational'
        });
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.error('Sentinel status check timed out');
          return NextResponse.json(
            { 
              status: 'unavailable',
              message: 'Service check timed out'
            },
            { status: 200 }
          );
        }
        console.error('Sentinel status check error:', fetchError.message);
      }

      return NextResponse.json(
        { 
          status: 'unavailable',
          message: 'Unable to verify service status'
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Error in sentinel status endpoint:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        status: 'unavailable',
        message: 'Internal error'
      },
      { status: 200 }
    );
  }
}
