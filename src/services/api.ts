const API_BASE_URL = "http://localhost:3000";

export interface AuthMessageResponse {
  message: string;
}

export interface UserData {
  address: string;
  createdAt: string;
  referrer?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getAuthMessage(): Promise<AuthMessageResponse> {
    return this.request<AuthMessageResponse>("/auth/message");
  }

  async authenticateUser(
    signature: string,
    address: string,
    referrer?: string
  ): Promise<UserData> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${signature}`,
      "x-address": address,
    };

    if (referrer) {
      headers["x-referrer"] = referrer;
    }

    return this.request<UserData>("/auth/me", { headers });
  }

  async getRefferals(
    signature: string,
    address: string,
    referrer?: string
  ): Promise<{ referrals: UserData[] }> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${signature}`,
      "x-address": address,
    };

    if (referrer) {
      headers["x-referrer"] = referrer;
    }

    return this.request<{ referrals: UserData[] }>("/auth/referrals", {
      headers,
    });
  }
}

export const apiService = new ApiService();
