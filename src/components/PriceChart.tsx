import React, { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { observer } from "mobx-react-lite";
import BinanceDatafeed from "../services/binanceDatafeed";
import BN from "../utils/BN";

interface PriceChartProps {
  className?: string;
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
    const chartData = [priceSeries];

    if (upper != null && lower != null) {
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
      chartData.push(...boundsSeries);
    }

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
