export function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_key") || "";
}

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": getAdminKey(),
      ...options.headers,
    },
  });
}
