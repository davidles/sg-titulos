/**
 * Centralized API client for the Secretaria General portal.
 *
 * All requests should go through these helpers to ensure consistent handling
 * of base URL, headers and error management.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    const message =
      "NEXT_PUBLIC_API_BASE_URL is not defined. Please configure it in .env.local.";

    if (process.env.NODE_ENV !== "production") {
      console.warn(message);
    }

    throw new Error(message);
  }

  return API_BASE_URL.replace(/\/$/, "");
}

export async function fetchFromApi(path, options = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await safeParseJson(response);
    const error = new Error(
      errorBody?.message ?? `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  return safeParseJson(response);
}

async function safeParseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function getUsers() {
  return fetchFromApi("/api/users");
}
