const DEFAULT_API_BASE_URL = "http://localhost:8000/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T>(
  path: string,
  { token, headers, ...init }: ApiRequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (data.message) {
      return data.message;
    }

    if (data.errors) {
      const firstErrorGroup = Object.values(data.errors).find(
        (messages) => messages.length > 0
      );

      if (firstErrorGroup) {
        return firstErrorGroup.join(", ");
      }
    }

    return `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}
