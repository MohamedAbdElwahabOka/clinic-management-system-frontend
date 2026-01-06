import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: RequestMethod;
    body?: any;
    headers?: Record<string, string>;
    token?: string; // Optional manual token override
}

/**
 * Generic Fetch Wrapper handling Auth and standard headers
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, token } = options;

    // 1. Authorization
    let accessToken = token;
    if (!accessToken) {
        // Try getting session from NextAuth (works in client components widely)
        // For Server Components, you should pass the token explicitly from `auth()`
        try {
            const session = await getSession();
            accessToken = session?.user?.accessToken;
        } catch (e) {
            console.warn("Could not retrieve session automatically (might be server-side without manual token).");
        }
    }

    const authHeaders: Record<string, string> = {};
    if (accessToken) {
        authHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    // 2. Content-Type for JSON
    const contentHeaders: Record<string, string> = {};
    if (body && !(body instanceof FormData)) {
        contentHeaders["Content-Type"] = "application/json";
    }

    // 3. Execution
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            ...contentHeaders,
            ...authHeaders,
            ...headers,
        },
        body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
    });

    // 4. Error Handling
    if (!response.ok) {
        // Attempt to parse error message
        let errorMessage = `API Error ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.message) errorMessage = errorData.message;
        } catch {
            // ignore json parse error
        }
        throw new Error(errorMessage);
    }

    // 5. Response Parsing
    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}
