


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
// utils/formatDate.js
export function formatDateTime(datetime) {
  const dt = new Date(datetime);
  const date = dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = dt.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}


// Capitalize first letter of a string
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const roundTo6 = (num) => Math.round(num * 1e6) / 1e6;




// Status mapping
export const statusMap = {
  "off_duty": "⚪ Off-Duty",
  "on_duty": "🔵 On-Duty",
  "driving": "🟢 Driving",
  "sleeper_berth": "🛏️ Sleeper Berth",
  "in_progress": "🟡 Ongoing",
  "completed": "🔵 Completed",
  "schenduled": "🟢 Upcoming"

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

    const time = formatTime(log.timestamp);
    const status = statusMap[log.hos_status] || "⚪ Off-Duty";
    const remarks = log.remarks || "No remarks";

    let duration = "N/A";
    const startTime = new Date(log.timestamp);

    // If endtime is missing, use current time (in UTC)
    const endTime = log.endtime ? new Date(log.endtime) : new Date();

    // If endTime is after startTime, calculate duration
    if (endTime > startTime) {
      duration = calculateDuration(startTime, endTime);
    }

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

export function getEightHourDrivingStatus(logs) {
  const now = new Date();

  for (const log of logs) {
    if (log.hos_status === "driving") {
      const start = new Date(log.timestamp);
      const end = log.endtime ? new Date(log.endtime) : now;
      const diffMinutes = (end - start) / 60000;

      if (diffMinutes >= 480) {
        return { status: "violation", duration: diffMinutes };
      } else if (diffMinutes >= 450) {
        return { status: "warning", duration: diffMinutes };
      }
    }
  }

  return { status: "ok", duration: 0 };
}


// Fuction to aggregate time by status for each day starting from midnight to the next midnight

export function getHOSDurationsForDate(logs, selectedDate) {
  const result = {
    drivingToday: 0,
    offDutyToday: 0,
    sleeperToday: 0,
    onDutyToday: 0,
  };

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const now = new Date();
  const isToday = startOfDay.toDateString() === now.toDateString();

  logs.forEach(log => {
    const start = new Date(log.timestamp);

    let end;
    if (log.endtime) {
      end = new Date(log.endtime);
    } else {
      // If ongoing and the day is today, cap at current time
      end = isToday ? now : endOfDay;
    }

    // Skip logs completely outside the day
    if (end < startOfDay || start > endOfDay) return;

    // Clip to within selected day
    const adjustedStart = start < startOfDay ? startOfDay : start;
    const adjustedEnd = end > endOfDay ? endOfDay : end;

    const diffMs = adjustedEnd - adjustedStart;
    if (diffMs <= 0) return;

    const diffMins = Math.floor(diffMs / 60000);
    console.log(`Status: ${log.hos_status}, Start: ${adjustedStart}, End: ${adjustedEnd}, Duration: ${diffMins} mins`);

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

  console.log("Result for this day:", result);
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
