"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SaleStatistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"week" | "month" | "year">("week");

  const baseOptions: ApexOptions = {
    chart: {
      fontFamily: "Jost, sans-serif",
      height: 430,
      type: "line",
      toolbar: { show: false },
      zoom: { autoScaleYaxis: true },
    },
    xaxis: {
      type: "category",
      categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"],
      axisBorder: { show: true },
      axisTicks: { show: true },
      crosshairs: { show: true },
    },
    yaxis: {
      min: 0,
      max: 75,
      tickAmount: 5,
      show: false,
      labels: { offsetX: -10 },
    },
    stroke: { width: [3, 3, 3], curve: "straight" },
    colors: ["#629D23", "#455A3F", "#FF965D"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 60],
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    tooltip: {
      enabled: true,
      custom: function (opts) {
        const { seriesIndex, dataPointIndex, w } = opts as {
          seriesIndex: number;
          dataPointIndex: number;
          w: { globals: { series: number[][]; seriesNames: string[] } };
        };
        return `
          <div class="bg-white px-3 py-2 rounded shadow text-sm">
            <span class="font-bold">
              ${w.globals.series[seriesIndex][dataPointIndex]} Sales
            </span>
            <br />
            <span class="text-gray-500">
              From ${w.globals.seriesNames[seriesIndex]}
            </span>
          </div>`;
      },
    },
    grid: {
      show: true,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
  };

  const chartData = {
    week: {
      series: [
        { name: "Sales", data: [23, 11, 22, 27, 13, 22, 37, 21, 44] },
        { name: "Visitors", data: [30, 25, 36, 30, 45, 35, 64, 52, 59] },
        { name: "Products", data: [15, 35, 15, 45, 35, 65, 10, 44, 5] },
      ],
      options: baseOptions,
    },
    month: {
      series: [
        { name: "Sales", data: [33, 21, 30, 25, 45, 32, 52, 40, 50] },
        { name: "Visitors", data: [40, 35, 46, 40, 55, 45, 74, 62, 69] },
        { name: "Products", data: [25, 45, 25, 55, 45, 75, 20, 54, 15] },
      ],
      options: baseOptions,
    },
    year: {
      series: [
        { name: "Sales", data: [60, 50, 45, 70, 45, 35, 42, 40, 60] },
        { name: "Visitors", data: [45, 65, 60, 35, 45, 62, 32, 24, 60] },
        { name: "Products", data: [25, 60, 55, 65, 60, 20, 70, 20, 60] },
      ],
      options: baseOptions,
    },
  };

  return (
    <div className="w-full bg-white shadow rounded-lg p-5">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Sale Statistics</h3>
          <p className="text-gray-500 text-sm">Top traffic channels metrics.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 mt-4 md:mt-0">
          {(["week", "month", "year"] as const).map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md text-sm font-medium transition 
                ${
                  activeTab === type
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
              onClick={() => setActiveTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <Chart
          options={chartData[activeTab].options}
          series={chartData[activeTab].series}
          type="line"
          height={430}
        />
      </div>
    </div>
  );
};

export default SaleStatistics;
