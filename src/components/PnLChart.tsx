import React from "react";
import { Chart } from "react-charts";

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

interface PnLChartProps {
  className?: string;
  data?: ChartDataPoint[];
}

const PnLChart: React.FC<PnLChartProps> = ({ className, data }) => {
  // Если нет данных для графика, не показываем компонент
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = [
    {
      label: "PnL",
      data: data.map((point) => ({
        x: new Date(point.timestamp),
        y: point.value,
      })),
    },
  ];

  return (
    <div className={className} style={{ height: "200px", width: "100%" }}>
      <Chart
        options={{
          data: chartData,
          primaryAxis: {
            getValue: (datum: any) => datum.x,
            scaleType: "time" as const,
            show: false, // Скрываем ось X
          },
          dark: true,
          secondaryAxes: [
            {
              getValue: (datum: any) => datum.y,
              scaleType: "linear" as const,
              show: false, // Скрываем ось Y
              elementType: "line",
            },
          ],
          series: {
            type: "line",
            point: { show: false },
          },
          style: {
            background: "transparent",
          },
          getSeriesStyle: (series) => {
            console.log(series);
            if (series.label === "PnL") {
              return {
                stroke: "#19F096",
                fill: "#19F096", // цвет круга в тултипе
              };
            }
            return {};
          },
        }}
      />
    </div>
  );
};

export default PnLChart;
