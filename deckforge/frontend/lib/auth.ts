import { fetchAPI } from "./api";

export async function login(email: string, password: string) {
  // FastAPI OAuth2 requires form data for login
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const tokenInfo = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString()
    }
  );

  if (!tokenInfo.ok) {
     throw new Error("Invalid credentials");
  }

  const data = await tokenInfo.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token);
  }
  return data;
}

export async function register(email: string, password: string) {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
}

export async function getUser() {
  return fetchAPI("/auth/me");
}
