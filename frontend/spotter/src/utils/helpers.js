


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

/// Function to calculate duration between two timestamps
export function calculateDuration(start, end) {
  const diffMs = new Date(end) - new Date(start);

  if (diffMs < 0) {
    console.warn('Negative time difference:', { start, end });
    return 'Invalid duration';
  }

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  return `${hours}h ${minutes}m`;
}


// Function to transform backend data into the required format
export function transformLogData(logs) {
  const transformedLogs = [];

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];

    // Format the time from timestamp
    const time = formatTime(log.timestamp);

    // Map the status
    const status = statusMap[log.hos_status] || "⚪ Off-Duty";

    // Calculate duration using *this* log's own timestamp and endtime
    let duration = "N/A";
    if (log.endtime) {
      const startTime = new Date(log.timestamp);
      const endTime = new Date(log.endtime);
      duration = calculateDuration(startTime, endTime);
    }

    const remarks = log.remarks || "No remarks";

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

// Fuction to aggregate time by status for each day starting from midnight to the next midnight

export function getHOSDurationsForDate(logs, selectedDate) {
  const result = {
    drivingToday: 0,
    offDutyToday: 0,
    sleeperToday: 0,
    onDutyToday: 0,
  };

  // Set the start and end of the selected date
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  logs.forEach(log => {
    if (!log.endtime) return; // skip incomplete logs

    const start = new Date(log.timestamp);
    const end = new Date(log.endtime);

    // Only count the part of the log that overlaps with the selected date range
    const adjustedStart = start < startOfDay ? startOfDay : start;
    const adjustedEnd = end > endOfDay ? endOfDay : end;

    const diffMs = adjustedEnd - adjustedStart;
    if (diffMs <= 0) return;

    const diffMins = Math.floor(diffMs / 60000);

    switch (log.hos_status) {
      case 'driving':
        result.drivingToday += diffMins;
        break;
      case 'off_duty':
        result.offDutyToday += diffMins;
        break;
      case 'sleeper_berth':
        result.sleeperToday += diffMins;
        break;
      case 'on_duty':
        result.onDutyToday += diffMins;
        break;
      default:
        break;
    }
  });

  return result;
}

export function formatMinutes(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
}

// Function to handle dashboard permissions and views
export const hasRole = (user, allowedRoles) =>
  user && allowedRoles.includes(user.role);
