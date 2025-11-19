import apiFetch from "../apiFetch";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

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
    if (!response.ok) {
      throw new Error(response.statusText ?? "Unexpected error");
    }
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
    if (!response.ok) {
      throw new Error(
        response.statusText ?? "Something went wrong, try again later"
      );
    }
    return response.json();
  },
  verifyEmail: async (token: string) => {
    const response = await fetch(
      `${BASE_URL}/auth/verify-email?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        response.statusText ?? "Something went wrong, try again later"
      );
    }
    return await response.json();
  },
  resendVerificationEmail: async (email: string) => {
    const response = await fetch(
      `${BASE_URL}/auth/send-verification?email=${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        response.statusText ?? "Something went wrong, try again later"
      );
    }
    return await response.json();
  },
  requestPasswordReset: async (email: string) => {
    const response = await fetch(
      `${BASE_URL}/auth/request-password-reset?email=${email}`,
      {
        method: "POST",
        headers: {
          "Content-Typp": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        response.statusText ?? "Something went wrong, try again later"
      );
    }
    return await response.json();
  },
};

export default auth;
