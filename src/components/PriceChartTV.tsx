import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import type {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from "../charting_library/charting_library";
import BinanceDatafeed from "../services/binanceDatafeed";

interface PriceChartProps {
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
  ({ upper, lower, from, to, lineColor = "#19F096" }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!window.TradingView || !chartContainerRef.current) return;

      const widgetOptions: ChartingLibraryWidgetOptions = {
        container: chartContainerRef.current,
        symbol: "ETHUSDT",
        interval: "60" as ResolutionString,
        datafeed: BinanceDatafeed(),
        library_path: "/charting_library/",
        autosize: true,
        theme: "dark",
        locale: getLanguageFromURL() || "en",
        disabled_features, //<---
        enabled_features: [],
        // timezone: "Etc/UTC",
        overrides: {
          "paneProperties.background": "#000000",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "#2B2B43",
          "paneProperties.horzGridProperties.color": "#2B2B43",
          "paneProperties.crossHairProperties.color": "#9598A1",
          "paneProperties.watermarkProperties.color": "#9598A1",
          "paneProperties.watermarkProperties.fontSize": 24,
          "paneProperties.watermarkProperties.fontFamily": "Roboto",
          "paneProperties.watermarkProperties.text": "",
          "symbolWatermarkProperties.color": "#9598A1",
          "symbolWatermarkProperties.fontSize": 24,
          "symbolWatermarkProperties.fontFamily": "Roboto",
          "symbolWatermarkProperties.text": "",
          "scalesProperties.backgroundColor": "#000000",
          "scalesProperties.textColor": "#9598A1",
          "scalesProperties.borderColor": "#2B2B43",
          "scalesProperties.fontSize": 12,
          "scalesProperties.fontFamily": "Roboto",
          "mainSeriesProperties.candleStyle.upColor": "#26A69A",
          "mainSeriesProperties.candleStyle.downColor": "#EF5350",
          "mainSeriesProperties.candleStyle.borderUpColor": "#26A69A",
          "mainSeriesProperties.candleStyle.borderDownColor": "#EF5350",
          "mainSeriesProperties.candleStyle.wickUpColor": "#26A69A",
          "mainSeriesProperties.candleStyle.wickDownColor": "#EF5350",
        },
        custom_css_url: "/charting_library/css/style.css",
        loading_screen: {
          backgroundColor: "#000000",
        },
      };

      console.log("🔧 Widget options:", widgetOptions);
      const tvWidget = new window.TradingView.widget(widgetOptions);

      tvWidget.onChartReady(() => {
        const chart = tvWidget.activeChart();
        // const chart = tvWidget.chart();
        console.log("✅ on chart ready");

        // Apply overrides programmatically as a fallback
        try {
          chart.applyOverrides({
            "paneProperties.background": "#000000",
            "paneProperties.backgroundType": "solid",
            "paneProperties.vertGridProperties.color": "#2B2B43",
            "paneProperties.horzGridProperties.color": "#2B2B43",
          });
          console.log("✅ Overrides applied programmatically");
        } catch (error) {
          console.error("❌ Failed to apply overrides:", error);
        }

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

      return () => {
        tvWidget.remove();
      };
    }, [upper, lower, from, to, lineColor]);

    return (
      <div style={{ height: 500, width: "100%" }}>
        <div
          ref={chartContainerRef}
          className="TVChartContainer"
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    );
  }
);

const getLanguageFromURL = (): LanguageCode | null => {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode);
};

const disabled_features: ChartingLibraryFeatureset[] = [
  "left_toolbar",
  "header_widget",
  "volume_force_overlay",
  "timeframes_toolbar",
  "go_to_date",
  "symbol_info", // Отключает O H L C строку
  "main_series_scale_menu",
  "pane_context_menu",
  "legend_context_menu",
  "context_menus",
  "header_symbol_search",
  "header_compare",
  "header_indicators",
  "header_settings",
  "header_fullscreen_button",
  "header_chart_type",
  "header_screenshot",
  "header_undo_redo",
  "header_resolutions",
  "edit_buttons_in_legend",
  "border_around_the_chart",
  "create_volume_indicator_by_default",
];

export default PriceChartTV;
