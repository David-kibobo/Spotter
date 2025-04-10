import React from "react";
import styled from "styled-components";
import { formatMinutes } from "../../../utils/helpers";

const HOSRecapPanel = ({ hosStats, todayDurations }) => (
  <>
    <h3>HOS Recap</h3>
    <p><strong>🕒 Total On-Duty:</strong> {formatMinutes(todayDurations.onDutyToday)}</p>
    <p><strong>🚛 Driving:</strong> {formatMinutes(todayDurations.drivingToday)}</p>
    <p><strong>⚪ Off-Duty:</strong> {formatMinutes(todayDurations.offDutyToday)}</p>
    <p><strong>📅 Last 7 Days:</strong> {hosStats.totalLast7Days}h</p>
    <p><strong>⏳ Available Tomorrow:</strong> {hosStats.availableHoursTomorrow}h</p>
    {/* <p><strong>🦄 Total Miles Covered:</strong> {hosStats.totalMiles ?? 0} mi</p> */}
    <p><strong>🛣️ Total Miles Covered:</strong> {hosStats.totalMiles ?? 0} mi</p>

    <Warning>⚠️ 34-hour reset may be needed soon.</Warning>
  </>
);

export default HOSRecapPanel;

const Warning = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 10px;
`;
