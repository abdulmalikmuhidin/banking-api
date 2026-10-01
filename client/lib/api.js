const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

async function request(path, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("bank_token") : null;
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      body.error?.message || "Something went wrong. Please try again.",
    );
  return body.data;
}

export const api = {
  register: (input) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  login: (input) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  getAccounts: () => request("/accounts"),
  getTransactions: (accountId) =>
    request(`/accounts/${accountId}/transactions`),
  transfer: (input) =>
    request("/transfers", { method: "POST", body: JSON.stringify(input) }),
};
