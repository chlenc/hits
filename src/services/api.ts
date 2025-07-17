const API_BASE_URL = "https://api.hits4.fun";

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
  userStrategies: Strategy[];
}

// Base strategy interface with common fields
interface BaseStrategy {
  id: string;
  title: string;
  symbol: string;
  expiration: string;
  depositUntil: string;
  participants: number;
  estimatedVolatility: "High" | "Medium" | "Low";
  createdAt: string;
}

// Open strategy - available for participation
export interface OpenStrategy extends BaseStrategy {
  status: "Open";
}

// Active strategy - currently running
export interface ActiveStrategy extends BaseStrategy {
  status: "Active";
  priceAtOpen: string;
  breakoutRange: {
    min: string;
    max: string;
  };
}

// Expired strategy - completed
export interface ExpiredStrategy extends BaseStrategy {
  status: "Expired";
  priceAtOpen: string;
  priceAtClose: string;
  income: string;
  breakoutRange: {
    min: string;
    max: string;
  };
}

// Union type for all strategy statuses
export type Strategy = OpenStrategy | ActiveStrategy | ExpiredStrategy;

export interface StrategiesResponse {
  strategies: Strategy[];
  total: number;
  page: number;
  limit: number;
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

  async getStrategies(): Promise<StrategiesResponse> {
    return this.request<StrategiesResponse>("/trading/strategies");
  }
}

export const apiService = new ApiService();
