export interface BookingRequest {
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string; // ISO string
  time: string;
  notes?: string;
}

export interface BookingResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  service?: string;
  therapist?: string;
  appointmentTime: string;
  status: string;
  notes?: string;
}

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function authFetch(input: RequestInfo, init?: RequestInit) {
  const initHeaders =
    init?.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : (init?.headers as Record<string, string> | undefined);

  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...(initHeaders ?? {}),
  };

  const body = init?.body;
  const hasContentTypeHeader = Object.keys(headers).some(
    (key) => key.toLowerCase() === "content-type"
  );

  if (!(body instanceof FormData) && !hasContentTypeHeader) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(input, { ...init, headers, credentials: 'include' });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Unauthorized");
  }

  return response;
}

export async function getErrorMessage(response: Response, fallback = "Ocurrió un error") {
  try {
    const data = await response.clone().json();

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }
  } catch {
    // Ignore parsing issues and use the fallback message.
  }

  return fallback;
}

export async function createBooking(data: BookingRequest): Promise<BookingResponse> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      appointmentTime: new Date(`${data.date}T${data.time}`).toISOString(),
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to create booking");
  }
  return res.json();
}

export async function fetchBookings(): Promise<BookingResponse[]> {
  const res = await fetch(`${API_BASE}/bookings`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}
