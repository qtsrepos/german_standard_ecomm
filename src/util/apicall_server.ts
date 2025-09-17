import API from "@/config/API";

const GET_SERVER = async (
  url: string,
  params: Record<string, any> = {},
  signal: AbortSignal | null = null,
  token: string = ""
) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const URL = queryParams ? url + `?${queryParams}` : url;
    const response = await fetch(API.BASE_URL + URL, {
      ...(signal && { signal }),
      method: "GET",
      cache: 'no-store',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
    });
    
    // For server-side calls, we can't refresh tokens, so just throw 401 errors
    if (response.status === 401) {
      const error = new Error("Authentication failed. Please login again.");
      (error as any).status = 401;
      throw error;
    }
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        const error = new Error(errorData.message || "Something went wrong");
        (error as any).status = response.status;
        throw error;
      } else {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`);
    }
  } catch (error) {
    throw error;
  }
};

export { GET_SERVER };
