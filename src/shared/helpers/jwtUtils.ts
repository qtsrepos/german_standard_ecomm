/**
 * JWT utility functions for extracting information from JWT tokens
 */

export interface JWTPayload {
  nameid?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decodes a JWT token and returns the payload
 * Note: This is a client-side decode and should not be used for security validation
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if necessary for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);

    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Extracts customer ID from JWT token's nameid field
 */
export function getCustomerIdFromToken(token: string): number | null {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.nameid) {
      console.warn('No nameid found in JWT token');
      return null;
    }

    const customerId = parseInt(payload.nameid, 10);
    if (isNaN(customerId)) {
      console.warn('Invalid nameid format in JWT token:', payload.nameid);
      return null;
    }

    return customerId;
  } catch (error) {
    console.error('Error extracting customer ID from token:', error);
    return null;
  }
}

/**
 * Extracts customer ID from session object that may contain token
 */
export function getCustomerIdFromSession(session: any): number | null {
  try {
    // Try different possible token locations in session
    const token = session?.token || session?.accessToken || session?.access_token;

    if (!token) {
      console.warn('No token found in session');
      return null;
    }

    return getCustomerIdFromToken(token);
  } catch (error) {
    console.error('Error extracting customer ID from session:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      return true; // Assume expired if no expiration date
    }

    // Convert exp (seconds) to milliseconds and compare with current time
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired on error
  }
}

/**
 * Gets user information from JWT token
 */
export function getUserInfoFromToken(token: string): { customerId: number | null; email?: string; role?: string } {
  try {
    const payload = decodeJWT(token);
    if (!payload) {
      return { customerId: null };
    }

    return {
      customerId: payload.nameid ? parseInt(payload.nameid, 10) : null,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    console.error('Error extracting user info from token:', error);
    return { customerId: null };
  }
}