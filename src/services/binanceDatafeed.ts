// src/datafeeds/binance-datafeed.ts
export default function BinanceDatafeed() {
  const intervalMap: Record<string, string> = {
    "1": "1m",
    "3": "3m",
    "5": "5m",
    "15": "15m",
    "30": "30m",
    "60": "1h",
    "240": "4h",
    "1D": "1d",
  };

  return {
    onReady: (cb: any) =>
      cb({
        supported_resolutions: Object.keys(intervalMap),
        exchanges: [{ value: "Binance", name: "Binance", desc: "Binance" }],
        symbols_types: [{ name: "crypto", value: "crypto" }],
      }),

    resolveSymbol: (_name: any, done: any) => {
      done({
        ticker: "ETHUSDT",
        name: "ETH / USDT",
        type: "crypto",
        session: "24x7",
        timezone: "Etc/UTC",
        exchange: "Binance",
        minmov: 1,
        pricescale: 100, // 2 знака после запятой
        has_intraday: true,
        supported_resolutions: Object.keys(intervalMap),
        volume_precision: 0,
        data_status: "streaming",
      });
    },

    /** Исторические бары */
    getBars: async (
      _sym: any,
      res: any,
      { from, to }: any,
      onHist: any,
      onErr: any
    ) => {
      const intv = intervalMap[res] || "1h";
      const url = `https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=${intv}&startTime=${
        from * 1000
      }&endTime=${to * 1000}`;
      try {
        const raw = await fetch(url).then((r) => r.json());
        const bars = raw.map((k: any[]) => ({
          time: k[0], // мс
          open: +k[1],
          high: +k[2],
          low: +k[3],
          close: +k[4],
          volume: +k[5],
        }));
        onHist(bars, { noData: !bars.length });
      } catch (e) {
        onErr(e);
      }
    },

    /** Подписка в реальном времени (WebSocket) — опционально */
    subscribeBars: () => {},
    unsubscribeBars: () => {},
  };
}
