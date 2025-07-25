import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import BinanceDatafeed from "../services/binanceDatafeed";

interface PriceChartProps {
  className?: string;
  upper?: number;
  lower?: number;
  to: number;
  from: number;
  lineColor?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const PriceChartTV: React.FC<PriceChartProps> = observer(
  ({ className, upper, lower, from, to, lineColor = "#19F096" }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    console.log(lower, upper);
    useEffect(() => {
      if (!window.TradingView || !chartRef.current) return;

      const widget = new window.TradingView.widget({
        container: chartRef.current,
        symbol: "ETHUSDT",
        interval: "60",
        datafeed: BinanceDatafeed(),
        library_path: "/charting_library/",
        chart_type: 1,
        autosize: true,
        theme: "dark",
        locale: "en",
        drawings_access: {
          type: "black",
          tools: [{ name: "Regression Trend" }],
        },
        disabled_features: [
          "left_toolbar",
          "header_widget",
          "volume_force_overlay",
          "timeframes_toolbar",
          "go_to_date",
          "scales_toolbar",
          "symbol_info", // Отключает O H L C строку
          "main_series_scale_menu",
          "pane_context_menu",
          "legend_context_menu",
          "context_menus",
          "header_symbol_search",
          "header_interval_dialog_button",
          "header_compare",
          "header_indicators",
          "header_settings",
          "header_fullscreen_button",
          "header_chart_type",
          "header_screenshot",
          "header_save_chart_template",
          "header_undo_redo",
          "header_resolutions",
          "edit_buttons_in_legend",
          "border_around_the_chart",
          "create_volume_indicator_by_default",
        ],

        enabled_features: [],
        timezone: "Etc/UTC",
        overrides: {
          "paneProperties.background": "#000000",
          "paneProperties.backgroundType": "solid",
          "scalesProperties.backgroundColor": "#000000",
          "scalesProperties.lineColor": "#333333",
          "paneProperties.vertGridProperties.color": "#222222",
          "paneProperties.horzGridProperties.color": "#222222",
          "mainSeriesProperties.candleStyle.upColor": "#19F096",
          "mainSeriesProperties.candleStyle.downColor": "#ED5959",
          "mainSeriesProperties.candleStyle.borderUpColor": "#19F096",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ED5959",
          "mainSeriesProperties.candleStyle.wickUpColor": "#19F096",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ED5959",
        },
      });

      widget.onChartReady(() => {
        const chart = widget.chart();

        if (upper) {
          chart.createShape(
            { time: from, price: upper },
            {
              shape: "horizontal_line",
              text: "Upper",
              color: lineColor,
              disableSelection: true,
              lock: true,
            }
          );
        }

        if (lower) {
          chart.createShape(
            { time: from, price: lower },
            {
              shape: "horizontal_line",
              text: "Lower",
              color: lineColor,
              disableSelection: true,
              lock: true,
            }
          );
        }
      });

      return () => widget.remove();
    }, [upper, lower, from, to, lineColor]);

    return (
      <div className={className} style={{ height: 500, width: "100%" }}>
        <div ref={chartRef} style={{ height: "100%", width: "100%" }} />
      </div>
    );
  }
);

export default PriceChartTV;
