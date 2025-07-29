interface GitHubFileInfo {
  sha: string;
  content: string;
  lastModified: string;
}

interface WhitepaperCache {
  content: string;
  sha: string;
  lastFetched: number;
}

class GitHubService {
  private readonly GITHUB_API_BASE = "https://api.github.com";
  private readonly WHITEPAPER_REPO = "hits4fun/white-paper";
  private readonly WHITEPAPER_PATH = "wp.md";
  private readonly CACHE_KEY = "whitepaper_cache";
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 минут

  private async getFileInfo(): Promise<GitHubFileInfo> {
    const url = `${this.GITHUB_API_BASE}/repos/${this.WHITEPAPER_REPO}/contents/${this.WHITEPAPER_PATH}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "HITS4FUN-WebApp",
      },
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Декодируем base64 контент
    const content = atob(data.content);
    const sha = data.sha;
    const lastModified =
      data.commit?.committer?.date || new Date().toISOString();

    return { content, sha, lastModified };
  }

  private getCachedWhitepaper(): WhitepaperCache | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached) as WhitepaperCache;
      const now = Date.now();

      // Проверяем, не истек ли кеш
      if (now - parsed.lastFetched > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Error reading cached whitepaper:", error);
      localStorage.removeItem(this.CACHE_KEY);
      return null;
    }
  }

  private setCachedWhitepaper(content: string, sha: string): void {
    try {
      const cache: WhitepaperCache = {
        content,
        sha,
        lastFetched: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error("Error caching whitepaper:", error);
    }
  }

  async getWhitepaper(): Promise<string> {
    try {
      // Сначала проверяем кеш
      const cached = this.getCachedWhitepaper();

      if (cached) {
        console.log("Using cached whitepaper");
        return cached.content;
      }

      console.log("Fetching whitepaper from GitHub...");

      // Получаем информацию о файле
      const fileInfo = await this.getFileInfo();

      // Кешируем новый контент
      this.setCachedWhitepaper(fileInfo.content, fileInfo.sha);

      console.log("Whitepaper updated from GitHub");
      return fileInfo.content;
    } catch (error) {
      console.error("Error fetching whitepaper from GitHub:", error);

      // В случае ошибки, возвращаем кешированную версию если есть
      const cached = this.getCachedWhitepaper();
      if (cached) {
        console.log("Using cached whitepaper due to fetch error");
        return cached.content;
      }

      // Если нет кеша, возвращаем fallback контент
      throw new Error("Failed to fetch whitepaper and no cache available");
    }
  }

  // Метод для принудительного обновления кеша
  async refreshWhitepaper(): Promise<string> {
    localStorage.removeItem(this.CACHE_KEY);
    return this.getWhitepaper();
  }

  // Метод для получения информации о последнем обновлении
  getLastUpdateInfo(): { lastFetched: number; sha: string } | null {
    const cached = this.getCachedWhitepaper();
    if (!cached) return null;

    return {
      lastFetched: cached.lastFetched,
      sha: cached.sha,
    };
  }
}

export const githubService = new GitHubService();
