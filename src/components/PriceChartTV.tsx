import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import type {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from "../charting_library/charting_library";
import BinanceDatafeed from "../services/binanceDatafeed";
import dayjs from "dayjs";

interface PriceChartProps {
  upper?: number;
  lower?: number;
  to: number;
  from: number;
  lineColor?: "green" | "red";
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const PriceChartTV: React.FC<PriceChartProps> = observer(
  ({ upper, lower, from, to, lineColor = "green" }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const areaOverrides =
      lineColor === "green"
        ? {
            "mainSeriesProperties.areaStyle.linecolor": "#70EC9E",
            "mainSeriesProperties.areaStyle.color1": "rgba(25,240,150,0.25)", // полупрозрачный верх
            "mainSeriesProperties.areaStyle.color2": "rgba(25,240,150,0.00)", // полностью прозр. низ
          }
        : {
            "mainSeriesProperties.areaStyle.linecolor": "#ED5959",
            "mainSeriesProperties.areaStyle.color1": "rgba(237,89,89,0.25)", // полупрозрачный верх
            "mainSeriesProperties.areaStyle.color2": "rgba(237,89,89,0.00)", // полностью прозр. низ
          };

    const overrides = {
      "paneProperties.background": "#000000",
      "paneProperties.backgroundType": "solid",
      "paneProperties.vertGridProperties.color": "#000",
      "paneProperties.horzGridProperties.color": "#000",
      "paneProperties.crossHairProperties.color": "#4E4C51",
      "mainSeriesProperties.lineStyle.color": lineColor,
      "mainSeriesProperties.lineStyle.linewidth": 1,
      "mainSeriesProperties.lineStyle.style": 0,
      "scalesProperties.textColor": "#4E4C51",
    };

    useEffect(() => {
      if (!window.TradingView || !chartContainerRef.current) return;

      const widgetOptions: ChartingLibraryWidgetOptions = {
        container: chartContainerRef.current,
        symbol: "ETHUSDT",
        interval: "1" as ResolutionString,
        datafeed: BinanceDatafeed(),
        library_path: "/charting_library/",
        autosize: true,
        locale: getLanguageFromURL() || "en",
        theme: "dark",
        disabled_features,
        enabled_features: ['iframe_loading_compatibility_mode'],
        overrides,
        loading_screen: {
          backgroundColor: "#000000",
        },
        // chart_type: 3,
        // timezone: "Etc/UTC",
        // custom_css_url: "/charting_library/css/style.css",
      };

      const tvWidget = new window.TradingView.widget(widgetOptions);

      tvWidget.onChartReady(() => {
        const chart = tvWidget.activeChart();
        // const chart = tvWidget.chart();
        chart.setChartType(3);
        chart.applyOverrides(areaOverrides);

        // const base = {
        //   shape: "horizontal_line",
        //   color: lineColor,
        //   disableSelection: true,
        //   lock: true,
        //   overrides: {
        //     linecolor: "#2B2A2A", // сама линия
        //     textcolor: "#2B2A2A", // подпись/прайс-лейбл
        //     linewidth: 1, // толщина
        //     // linestyle: 0,               // сплошная (0 = Solid, 1 = Dotted …)
        //     showLabel: true, // подпись «Upper» можно скрыть
        //   },
        // };
        // upper &&
        //   chart.createShape(
        //     { time: from, price: upper },
        //     { text: `Upper: $${upper}`, ...base }
        //   );

        // lower &&
        //   chart.createShape(
        //     { time: from, price: lower },
        //     { text: `Lower: ${lower}`, ...base }
        //   );

        // base.shape = "vertical_line";
        // chart.createShape(
        //   { time: dayjs(to).unix(), price: upper },
        //   { text: dayjs(to).format("D MMM, HH:mm"), ...base }
        // );
        // chart.createShape(
        //   { time: dayjs(from).unix(), price: lower },
        //   { text: dayjs(from).format("D MMM, HH:mm"), ...base }
        // );

        chart.createMultipointShape(
          [
            { time: dayjs(from).unix(), price: upper }, // левый-верх
            { time: dayjs(to).unix(), price: lower }, // правый-низ
          ],
          {
            shape: "rectangle",
            filled: true,
            lock: true,
            disableSelection: true,
            overrides: {
              fillColor: "rgba(237,89,89,0.25)", // красная дымка внутри
              color: "#ED5959", // контур
              linewidth: 1,
            },
          }
        );

        const priceScale = chart.getPanes()[0].getRightPriceScales()[0];
        if (lower && upper) {
          priceScale.setAutoScale(false);
          priceScale.setVisiblePriceRange({
            from: lower * 0.95,
            to: upper * 1.05,
          });
        }
        chart.setVisibleRange({
          from: dayjs(from).unix() - 2000,
          to: dayjs(to).unix() + 5000,
        });
      });

      return () => {
        tvWidget.remove();
      };
    }, [upper, lower, from, to, lineColor]);

    return (
      <div style={{ height: 250, width: "100%" }}>
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
  "legend_widget",
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
