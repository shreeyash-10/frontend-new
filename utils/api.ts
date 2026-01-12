const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.induslabs.io";

const isAbsoluteUrl = (value: string) => value.startsWith("http://") || value.startsWith("https://");

export const getApiUrl = (path: string) => {
  if (isAbsoluteUrl(path) || !API_BASE_URL) return path;
  return `${API_BASE_URL}${path}`;
};

export const fetchWithFallback = async (path: string, options: RequestInit = {}) => {
  if (isAbsoluteUrl(path)) {
    return fetch(path, options);
  }

  let response: Response | null = null;
  try {
    response = await fetch(path, options);
  } catch (error) {
    console.warn("Proxy fetch failed, trying direct API.", error);
  }

  if ((!response || !response.ok) && API_BASE_URL) {
    response = await fetch(getApiUrl(path), options);
  }

  if (!response) {
    throw new Error("Network request failed.");
  }

  return response;
};
