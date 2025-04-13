import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register necessary Chart.js components
Chart.register(...registerables);

const ELDGraph = ({ logs }) => {
  const statusMapping = {
    "off_duty": 0,
    "sleeper_berth": 1,
    "on_duty": 2,
    "driving": 3,
  };

  // Step 1: Sort logs by timestamp
  const sortedLogs = logs
    ?.filter((log) => log.timestamp && log.hos_status)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Helper: Round time to nearest 30 minutes
  const roundToNearest30Min = (date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0;
    const hours = roundedMinutes === 0 && minutes >= 45 ? date.getHours() + 1 : date.getHours();
    return `${hours.toString().padStart(2, "0")}:${roundedMinutes.toString().padStart(2, "0")}`;
  };

  // Step 2: Build rounded ELD entries
  const eldData = sortedLogs?.map((log) => {
    const time = new Date(log.timestamp);
    return {
      time: roundToNearest30Min(time),
      status: log.hos_status,
    };
  });

  // Step 3: Build full 24h time range in 30-minute intervals
  const fullTimeRange = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      fullTimeRange.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }

  // Step 4: Fill missing time slots with last known status
  let lastStatus = "off_duty";
  const eldMap = new Map();
  eldData.forEach((entry) => eldMap.set(entry.time, entry.status));

  const completeEldData = fullTimeRange.map((time) => {
    if (eldMap.has(time)) {
      lastStatus = eldMap.get(time);
    }
    return { time, status: lastStatus };
  });

  // Step 5: Prepare data for Chart.js
  const labels = completeEldData.map((entry) => entry.time);
  const dataValues = completeEldData.map((entry) => statusMapping[entry.status]);

  const data = {
    labels,
    datasets: [
      {
        label: "ELD Status Over 24 Hours",
        data: dataValues,
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        tension: 0,
        stepped: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        min: 0,
        max: 3,
        ticks: {
          stepSize: 1,
          callback: (value) => ["Off-Duty", "Sleeper Berth", "On-Duty", "Driving"][value],
        },
      },
    },
  };
  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false, // Keep this false so it fills container
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       ticks: {
  //         autoSkip: true,
  //         maxTicksLimit: 12,
  //       },
  //       grid: {
  //         display: true,
  //       },
  //     },
  //     y: {
  //       min: 0,
  //       max: 3,
  //       ticks: {
  //         stepSize: 1,
  //         callback: (value) => ["Off-Duty", "Sleeper Berth", "On-Duty", "Driving"][value],
  //       },
  //       grid: {
  //         display: true,
  //       },
  //     },
  //   },
  // };
  
  return (
//     <div
//   style={{
//     height: "200px",
//     width: "100%",
//     padding: "10px",
//     display: "flex",
//     justifyContent: "center",
//   }}
// >
  <div
    style={{
      width: "100%",
      // maxWidth: "1000px", // Or remove if not needed
      height: "100%",
    }}
  >
    <Line data={data} options={options} />

</div>

  );
};

export default ELDGraph;
