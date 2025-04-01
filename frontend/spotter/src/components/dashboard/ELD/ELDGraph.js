import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register necessary Chart.js components
Chart.register(...registerables);

const ELDGraph = () => {
  // Dummy ELD Log Data (Time-based status changes)
  const eldData = [
    { time: "00:00", status: "Off-Duty" },    // Start of the day
    { time: "08:00", status: "Driving" },
    { time: "10:00", status: "On-Duty" },
    { time: "10:30", status: "Off-Duty" },
    { time: "11:30", status: "Driving" },
    { time: "14:00", status: "Sleeper Berth" },
    { time: "18:00", status: "On-Duty" },
    { time: "19:30", status: "Driving" },
    { time: "23:59", status: "Off-Duty" },   // End of the day
  ];

  // Mapping status to numeric values (for plotting)
  const statusMapping = {
    "Off-Duty": 0,
    "Sleeper Berth": 1,
    "On-Duty": 2,
    "Driving": 3,
  };

  // Generate all time slots for a full 24-hour period (every 30 mins)
  const fullTimeRange = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      fullTimeRange.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
    }
  }

  // Fill missing times with the last known status
  let lastStatus = "Off-Duty";
  const completeEldData = fullTimeRange.map((time) => {
    const log = eldData.find((entry) => entry.time === time);
    if (log) lastStatus = log.status;
    return { time, status: lastStatus };
  });

  // Extract labels and values
  const labels = completeEldData.map((entry) => entry.time);
  const dataValues = completeEldData.map((entry) => statusMapping[entry.status]);

  // Chart.js Data Configuration
  const data = {
    labels: labels,
    datasets: [
      {
        label: "ELD Status Over 24 Hours",
        data: dataValues,
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        tension: 0, // No smooth curves
        stepped: true, // Forces step-like graph
      },
    ],
  };

  // Chart.js Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12, // Limit number of labels displayed
        },
      },
      y: {
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const statusLabels = ["Off-Duty", "Sleeper Berth", "On-Duty", "Driving"];
            return statusLabels[value] || "";
          },
        },
        min: 0,
        max: 3,
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%", padding: "10px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ELDGraph;
