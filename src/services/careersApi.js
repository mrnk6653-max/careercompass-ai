const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchCareers() {
  const response = await fetch(`${API_BASE_URL}/api/careers`);

  if (!response.ok) {
    throw new Error(`Failed to fetch careers: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("Invalid career data received from the server.");
  }

  return result.data;
}