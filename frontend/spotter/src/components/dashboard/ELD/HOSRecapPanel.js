import React from "react";
import styled from "styled-components";
import { formatMinutes } from "../../../utils/helpers";
import { getEightHourDrivingStatus } from "../../../utils/helpers";

const HOSRecapPanel = ({ hosStats, todayDurations, driver, filteredLogs, totalMiles }) => {
  const drivingStatus = getEightHourDrivingStatus(filteredLogs ?? []);


  const { total_hours_past_8_days, available_hours_tomorrow } = hosStats;

  return (

    <RecapWrapper>
      <h3>📊 Hours of Service Recap</h3>
      <p><strong>🕒 Total On-Duty:</strong> {formatMinutes(todayDurations.onDutyToday || 0)}</p>
      <p><strong>🚛 Driving:</strong> {formatMinutes(todayDurations.drivingToday || 0)}</p>
      <p><strong>🛏️ Sleeper Berth:</strong> {formatMinutes(todayDurations.sleeperToday || 0)}</p>
      <p><strong>⚪ Off-Duty:</strong> {formatMinutes(todayDurations.offDutyToday || 0)}</p>
      <p><strong>📅 Last 7 Days:</strong> {total_hours_past_8_days}h</p>
      <p><strong>⏳ Available Tomorrow:</strong> {available_hours_tomorrow}h</p>
      {/* <p><strong>🦄 Total Miles Covered:</strong> {hosStats.totalMiles ?? 0} mi</p> */}
      <p><strong>🛣️ Total Miles Covered:</strong> {totalMiles} mi</p>


      {/* Show warning when approaching 8-hour driving limit */}
      {drivingStatus.status === "violation" && (
        <Warning>⛔ Exceeded 8 hours of continuous driving!</Warning>
      )}

      {drivingStatus.status === "warning" && (
        <Warning>⚠️ Approaching 8-hour driving limit ({formatMinutes(Math.floor(drivingStatus.duration))} mins)</Warning>
      )}


      {total_hours_past_8_days >= 65 && <Warning>⚠️ 34-hour reset may be needed soon.</Warning>}
    </RecapWrapper>
  )
};

export default HOSRecapPanel;

const Warning = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 10px;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

// Wrap the whole panel with a styled wrapper for responsiveness
const RecapWrapper = styled.div`
  padding: 10px;

  p {
    margin: 5px 0;
    font-size: 14px;
  }

  strong {
    color: #2c3e50;
  }

  @media (max-width: 600px) {
    padding: 8px;

    p {
      font-size: 12px;
    }
  }
`;

