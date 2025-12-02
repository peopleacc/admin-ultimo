"use client";

import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RevenueTrendChart({ categories = [], data = [] }) {
  const options = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    colors: ["#2D336B"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: "#2D336B",
            opacity: 0.35,
          },
          {
            offset: 100,
            color: "#FFF2F2",
            opacity: 0.05,
          },
        ],
      },
    },
    grid: {
      borderColor: "rgba(45, 51, 107, 0.08)",
      strokeDashArray: 5,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#2D336B",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#2D336B" },
        formatter: (val) => `Rp ${(val / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(value),
      },
    },
  };

  return (
    <ApexChart
      type="area"
      options={options}
      series={[{ name: "Pendapatan", data }]}
      height={320}
    />
  );
}

export function StatusDonutChart({ labels = [], data = [] }) {
  const options = {
    labels,
    colors: ["#2D336B", "#F4A261", "#2A9D8F", "#C77DFF", "#F25F5C"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: { colors: "#2D336B" },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
    },
    stroke: {
      colors: ["#FFF2F2"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { color: "#2D336B" },
            value: {
              formatter: (val) => `${val}`,
              color: "#2D336B",
            },
            total: {
              show: true,
              label: "Total",
              color: "#2D336B",
              formatter: () => data.reduce((acc, val) => acc + val, 0),
            },
          },
        },
      },
    },
  };

  return (
    <ApexChart type="donut" options={options} series={data} height={320} />
  );
}

