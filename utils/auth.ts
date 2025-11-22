import apiFetch from "../apiFetch";
import { BASE_URL } from "../constants";

const auth = {
  logout: async () => {
    const response = await apiFetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(response.statusText ?? "Unexpected error");
    }
    return await response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

  signup: async ({
    email,
    password,
    title,
    fullName,
  }: {
    email: string;
    password: string;
    title: string;
    fullName: string;
  }) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, title, fullName }),
    });
    return response.json();
  },

  verifyEmail: async (token: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    return await response.json();
  },

  resendVerificationEmail: async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/send-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  },

  requestPasswordReset: async (email: string) => {
    console.log("email i received", email);
    const response = await fetch(`${BASE_URL}/auth/request-password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  },
};

export default auth;
