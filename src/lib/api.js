import { authClient } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(endpoint, options = {}) {
  // Get JWT token from Better Auth
  const { data, error } = await authClient.token();

  console.log("Token received:", Boolean(data?.token));

  if (error || !data?.token) {
    throw new Error("Please login to continue.");
  }

  // Prepare headers
  const headers = new Headers(options.headers || {});

  headers.set("Authorization", `Bearer ${data.token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  console.log("Authorization prepared:", headers.has("Authorization"));

  // Send request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
}
