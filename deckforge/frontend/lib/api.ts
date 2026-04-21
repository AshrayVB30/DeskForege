const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: any = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred');
  }

  // 204 / 205 — no body at all, return null immediately
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  // Handle empty responses or non-json responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.blob();
}

export const api = {
  get: async (endpoint: string, options = {}) => {
    const data = await fetchAPI(endpoint, { method: "GET", ...options });
    return { data };
  },
  post: async (endpoint: string, body: any, options: any = {}) => {
    // If body is FormData, do not set/override Content-Type in options so fetch sets boundary correctly
    const isFormData = body instanceof FormData;
    const fetchOptions: any = { method: "POST", ...options };
    
    if (isFormData) {
      fetchOptions.body = body;
      // Strip multipart/form-data if mistakenly explicitly defined, fetch needs to do it!
      if (fetchOptions.headers && fetchOptions.headers['Content-Type'] === 'multipart/form-data') {
        delete fetchOptions.headers['Content-Type'];
      }
    } else {
      fetchOptions.body = JSON.stringify(body);
    }

    const data = await fetchAPI(endpoint, fetchOptions);
    return { data };
  },
  put: async (endpoint: string, body: any, options: any = {}) => {
    const data = await fetchAPI(endpoint, { method: "PUT", body: JSON.stringify(body), ...options });
    return { data };
  },
  patch: async (endpoint: string, body: any, options: any = {}) => {
    const data = await fetchAPI(endpoint, { method: "PATCH", body: JSON.stringify(body), ...options });
    return { data };
  },
  delete: async (endpoint: string, options = {}) => {
    const data = await fetchAPI(endpoint, { method: "DELETE", ...options });
    return { data };
  }
};
