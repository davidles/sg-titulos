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

export async function registerUser(payload) {
  return fetchFromApi("/api/users/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getProvinces() {
  const res = await fetchFromApi("/api/locations/provinces");
  return Array.isArray(res?.provinces) ? res.provinces : [];
}

export async function getCitiesByProvince(provinceId) {
  const res = await fetchFromApi(`/api/locations/provinces/${provinceId}/cities`);
  return Array.isArray(res?.cities) ? res.cities : [];
}

export async function getCountries() {
  const res = await fetchFromApi("/api/locations/countries");
  return Array.isArray(res?.countries) ? res.countries : [];
}

export async function getProvincesByCountry(countryId) {
  const res = await fetchFromApi(`/api/locations/countries/${countryId}/provinces`);
  // Backend route currently exposes provinces by country under /provinces? If not present, fallback to all and filter on client
  return Array.isArray(res?.provinces) ? res.provinces : [];
}

export async function getMilitaryRanks() {
  const res = await fetchFromApi(`/api/military/ranks`);
  return Array.isArray(res?.ranks) ? res.ranks : [];
}

export async function requestPasswordReset(identifier) {
  const body = { email: String(identifier ?? '').trim() };
  return fetchFromApi(`/api/auth/password/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function resetPassword(token, password) {
  const body = { token: String(token ?? ''), password: String(password ?? '') };
  return fetchFromApi(`/api/auth/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function getAvailableTitles(userId, options = {}) {
  const res = await fetchFromApi(`/api/titles/available?userId=${userId}`, options);
  return Array.isArray(res?.data) ? res.data : [];
}

export async function createRequest(payload, options = {}) {
  return fetchFromApi(`/api/requests`, {
    method: "POST",
    body: JSON.stringify(payload),
    ...options,
    headers: {
      ...(options.headers ?? {})
    }
  });
}

export async function getRequestRequirements(requestId, options = {}) {
  const res = await fetchFromApi(`/api/requests/${requestId}/requirements`, options);
  return Array.isArray(res?.data) ? res.data : [];
}

export async function uploadRequirementFile({ requestId, requirementInstanceId, formData, headers }) {
  const url = `/api/requests/${requestId}/requirements/${requirementInstanceId}/file`;
  const response = await fetch(`${getApiBaseUrl()}${url}`, {
    method: "POST",
    body: formData,
    headers
  });

  if (!response.ok) {
    const errorBody = await safeParseJson(response);
    const error = new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  const data = await safeParseJson(response);
  return data?.data ?? null;
}

export async function getRequestFormData(userId, options = {}) {
  const res = await fetchFromApi(`/api/forms/${userId}`, options);
  return res?.data ?? null;
}

export async function updateRequestFormData(userId, payload, options = {}) {
  const res = await fetchFromApi(`/api/forms/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    ...options,
    headers: {
      ...(options.headers ?? {})
    }
  });
  return res?.data ?? null;
}
