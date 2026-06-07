export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8081";


async function fetchModel(url) {
  const response = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Không lấy được dữ liệu từ ${url}`);
  }

  return response.json();
}

export async function postJson(url, data) {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data || {}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Request không thành công.");
  }

  return response.json();
}

export async function postForm(url, formData) {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Upload không thành công.");
  }

  return response.json();
}

export function imageUrl(fileName) {
  return `${API_BASE}/images/${fileName}`;
}

export default fetchModel;
