import React, { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { observer } from "mobx-react-lite";
import BinanceDatafeed from "../services/binanceDatafeed";
import BN from "../utils/BN";

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

interface PriceChartProps {
  className?: string;
  data?: ChartDataPoint[];
  upper?: number; // верхняя граница
  lower?: number; // нижняя граница
  to: number; // время окончания
  from: number; // время начала
  lineColor?: string; // цвет линии
}

const PriceChart: React.FC<PriceChartProps> = observer(
  ({ className, upper, lower, to, from, lineColor = "#19F096" }) => {
    const [ethUsdData, setEthUsdData] = useState<any[]>([]);

    useEffect(() => {
      const fetchEthUsdData = async () => {
        const datafeed = BinanceDatafeed();
        try {
          await datafeed.getBars(
            "ETHUSDT",
            "1",
            { from, to },
            (bars: any[]) => setEthUsdData(bars),
            (error: any) => console.error("Error fetching ETH/USD data:", error)
          );
        } catch (error) {
          console.error("Failed to fetch ETH/USD data:", error);
        }
      };

      fetchEthUsdData();
      const interval = setInterval(fetchEthUsdData, 1 * 60 * 1000);
      return () => clearInterval(interval);
    }, [from, to]);

    const data = ethUsdData;
    if (!data || data.length === 0) {
      console.warn("No data available for the chart");
      return null;
    }

    if (upper == null || lower == null) {
      // Используем поле close, если есть, иначе value
      const values = data.map((d) =>
        typeof d.close === "number" ? d.close : d.value
      );
      const max = Math.max(...values);
      const min = Math.min(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;

      if (upper == null) upper = (avg + max) / 2;
      if (lower == null) lower = (avg + min) / 2;
    }

    // Ensure data points have valid date values before rendering the chart.
    const validData = data.every((point) => {
      const date = new Date(point.time);
      return !isNaN(date.getTime()) && point.close !== undefined;
    });

    if (!validData) {
      console.error("Invalid data points detected:", data);
      return null;
    }

    /** ----------------- подготовка данных ----------------- */
    // основная серия
    const priceSeries = {
      label: "Price",
      data: data.map((p) => ({ x: new Date(p.time), y: p.close })),
    };

    const xs = data.map((p) => new Date(p.time));
    const boundsSeries = [
      {
        label: `Upper: ${new BN(upper).toFormat(0)}`,
        data: xs.map((x) => ({ x, y: upper })),
        showPoints: false,
      },
      {
        label: `Lower: ${new BN(lower).toFormat(0)}`,
        data: xs.map((x) => ({ x, y: lower })),
        showPoints: false,
      },
    ];

    const chartData = [priceSeries, ...boundsSeries];

    return (
      <div
        className={className}
        style={{ position: "relative", height: 250, width: "100%" }}
      >
        {/* сам график */}
        <Chart
          options={{
            data: chartData,
            primaryAxis: {
              getValue: (d: any) => d.x,
              scaleType: "time",
              show: true,
            },
            secondaryAxes: [
              {
                getValue: (d: any) => d.y,
                scaleType: "linear",
                show: false,
                elementType: "line",
              },
            ],
            dark: true,
            getSeriesStyle: (series) => {
              // основная линия
              if (series.label === "Price") {
                return {
                  stroke: lineColor,
                  fill: lineColor,
                };
              }
              // линии-границы
              if (
                series.label.startsWith("Upper") ||
                series.label.startsWith("Lower")
              ) {
                return {
                  stroke: "#555", // серый цвет
                  strokeWidth: 1,
                  // strokeDasharray: "4 4", // пунктир, опционально
                  fill: "transparent",
                };
              }
              return {};
            },
          }}
        />
      </div>
    );
  }
);

export default PriceChart;
