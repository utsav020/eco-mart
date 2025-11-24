"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Client-only Chart import (SSR disabled)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StackedBarChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 436,
      stacked: true,
      toolbar: { show: false },
    },
    series: [
      { name: "PRODUCT A", data: [2, 5, 1, 7, 2, 4, 1, 4] },
      { name: "PRODUCT B", data: [1, 3, 2, 8, 3, 7, 3, 2] },
    ],
    xaxis: {
      type: "category",
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: { show: true },
      axisTicks: { show: true },
      crosshairs: { show: true },
    },
    yaxis: {
      opposite: true,
      min: 0,
      max: 10,
      tickAmount: 5,
      labels: {
        show: false,
        formatter: (val) => `${val} AM`,
        offsetX: -17,
      },
    },
    legend: { show: false },
    grid: {
      show: false,
      padding: { left: -10, right: 0 },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { columnWidth: "18%", borderRadius: 0 },
    },
    fill: { colors: ["#629D23", "#629D23"] },
    tooltip: { enabled: true },
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-5">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Earnings</h3>
          <p className="text-gray-500 text-sm">Top traffic channels metrics.</p>
        </div>

        {/* Select Dropdown */}
       <div className="border px-3 py-2 rounded-md text-md bg-white">
         <select className="mt-3 md:mt-0 px-4 py-2 border rounded-md bg-white text-gray-700 text-sm focus:ring-2 focus:ring-blue-500">
          <option>Week</option>
          <option>Month</option>
          <option>Year</option>
          <option>6 Month</option>
        </select>
       </div>
      </div>

      {/* Chart */}
      <div>
        <Chart
          options={options}
          series={options.series!}
          type="bar"
          height={options.chart?.height}
        />
      </div>
    </div>
  );
};

export default StackedBarChart;
