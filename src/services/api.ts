const API_BASE_URL = "http://localhost:3000";

export interface AuthMessageResponse {
  message: string;
}

export interface UserData {
  address: string;
  createdAt: string;
  referrer?: string;
}

// Trading and Analytics Types
export interface ChartDataPoint {
  timestamp: number;
  value: number;
}

export interface TradingStatsResponse {
  claimableBalance: string; // in ETH
  totalPnL: string; // in ETH
  totalTradesAmount: number;
  winTradesAmount: number;
  loseTradesAmount: number;
  pnl_30d_chart: ChartDataPoint[];
}

export interface Trade {
  id: string;
  asset: string;
  expirationDate: string;
  participants: number;
  priceAtOpen: string;
  priceAtClose?: string;
  breakoutRange: {
    min: string;
    max: string;
  };
  income?: string;
  status: "active" | "finished";
  createdAt: string;
}

export interface TradesResponse {
  trades: Trade[];
  total: number;
  page: number;
  limit: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  totalTrades: number;
  winRate: number;
}

export interface StrategiesResponse {
  strategies: Strategy[];
}

export interface ReferralInfo {
  referralLink: string;
  referrals: UserData[];
  totalReferrals: number;
  totalEarnings: string;
}

export interface ReferralInfoResponse {
  referralInfo: ReferralInfo;
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

  // Auth methods
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

  async getReferrals(
    signature: string,
    address: string
  ): Promise<{ referrals: UserData[] }> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${signature}`,
      "x-address": address,
    };

    return this.request<{ referrals: UserData[] }>("/auth/referrals", {
      headers,
    });
  }

  // Trading methods
  async getTradingStats(
    signature: string,
    address: string
  ): Promise<TradingStatsResponse> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${signature}`,
      "x-address": address,
    };

    return this.request<TradingStatsResponse>("/trading/stats", { headers });
  }


  async getMyTrades(
    signature: string,
    address: string,
    page: number = 1,
    limit: number = 10,
    status: "active" | "finished" = "finished"
  ): Promise<TradesResponse> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${signature}`,
      "x-address": address,
    };

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    });

    return this.request<TradesResponse>(
      `/trading/my-trades?${params.toString()}`,
      { headers }
    );
  }

  async getAllTrades(
    signature: string,
    address: string,
    page: number = 1,
    limit: number = 20,
    status: "active" | "finished" = "finished"
  ): Promise<TradesResponse> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${signature}`,
      "x-address": address,
    };

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    });

    return this.request<TradesResponse>(
      `/trading/trades?${params.toString()}`,
      { headers }
    );
  }

  async getStrategies(
    signature: string,
    address: string
  ): Promise<StrategiesResponse> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${signature}`,
      "x-address": address,
    };

    return this.request<StrategiesResponse>("/trading/strategies", { headers });
  }

}

export const apiService = new ApiService();
