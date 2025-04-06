


export const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    return data.display_name || "Unknown Location";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "Unknown Location";
  }
};


// Format date in a readable way
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Capitalize first letter of a string
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const roundTo6 = (num) => Math.round(num * 1e6) / 1e6;



// src/helpers/logHelpers.js

// Status mapping
const statusMap = {
  "off_duty": "⚪ Off-Duty",
  "on_duty": "🔵 On-Duty",
  "driving": "🟢 Driving",
  "sleeper_berth": "🛏️ Sleeper Berth"
};

// Function to format the timestamp
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to calculate duration between two timestamps
function calculateDuration(endTime, startTime) {
  if (isNaN(endTime) || isNaN(startTime)) {
    console.error("Invalid date:", endTime, startTime);
    return "Invalid Date";
  }

  const diffInMs = endTime - startTime;  // Get the difference in milliseconds
  if (diffInMs < 0) {
    console.error("Negative time difference:", endTime, startTime);
    return "Invalid Duration";
  }

  const hours = Math.floor(diffInMs / (1000 * 60 * 60));  // Convert to hours
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));  // Convert remaining ms to minutes

  return `${hours}h ${minutes}m`;  // Return the formatted duration
}


// Function to transform backend data into the required format
export function transformLogData(logs) {
  const transformedLogs = [];

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const previousLog = logs[i - 1];

    // Format the time from timestamp
    const time = formatTime(log.timestamp);

    // Map the status
    const status = statusMap[log.hos_status] || "⚪ Off-Duty";

    // Calculate duration if there's a previous log, otherwise set 'N/A' for the first log
    let duration = 'N/A';
    if (previousLog) {
      // Ensure both timestamps are Date objects
      const endTime = new Date(log.endtime);
      const startTime = new Date(previousLog.timestamp);
      duration = calculateDuration(endTime, startTime);  // Assumes calculateDuration returns a readable format like '2h 30m'
    }

    // Prepare the remarks
    const remarks = log.remarks || "No remarks";

    // Push the formatted log
    transformedLogs.push({
      time,
      status,
      duration,
      remarks
    });
  }

  return transformedLogs;
}

// Frontend HOS enforcer

export const canChangeStatus = (newStatus, currentStatus, hosStats) => {
  const {
    totalLast7Days = 0,
    totalToday = 0,
    availableHoursTomorrow = 70,
    consecutiveOffDutyHours = 0,
    lastFuelingMiles = 0,
    totalMiles = 0,
  } = hosStats;

  const HOURS_LIMIT = 70;
  const REQUIRED_FUEL_MILES = 1000;
  const REQUIRED_OFF_HOURS_FOR_RESET = 34;

  // Block driving if out of HOS
  if (newStatus === "driving" && totalLast7Days >= HOURS_LIMIT) {
    return false;
  }

  // Prevent unnecessary resets
  if (newStatus === "off_duty" && consecutiveOffDutyHours >= REQUIRED_OFF_HOURS_FOR_RESET) {
    return false;
  }

  // Require fuel stop every 1000 miles
  if (newStatus === "driving" && totalMiles - lastFuelingMiles >= REQUIRED_FUEL_MILES) {
    return false;
  }

  // Prevent same-status toggling
  if (newStatus === currentStatus) {
    return false;
  }

  return true;
};
