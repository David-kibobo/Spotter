import React, { useState } from "react";
import styled from "styled-components";
import MapComponent from "./maps/MapComponent";
const DashboardHome = () => {
  const [userRole, setUserRole] = useState(null);

  const logsToday = [
    { id: 1, driver: "John Doe", time: "10:30 AM", status: "🟢 Driving", location: "New York, NY" },
    { id: 2, driver: "Sarah Lee", time: "11:15 AM", status: "🔵 Sleeper Berth", location: "Los Angeles, CA" },
    { id: 3, driver: "Mike Ross", time: "12:00 PM", status: "⚪ Off-Duty", location: "Dallas, TX" },
  ];

  return (
    <Content>
      {/* Overview Section */}
      <Overview>
        <StatCard>🚛 Active Trips: <span>5</span></StatCard>
        <StatCard>📄 Logs Today: <span>{logsToday.length}</span></StatCard>
        {userRole === "carrier" || userRole === "dispatcher" ? (
          <StatCard>⚠️ Violations: <span>1</span></StatCard>
        ) : null}
      </Overview>

      {/* Map Section */}
      <MapContainer>
        <MapComponent userRole={userRole} />
      </MapContainer>

      {/* Logs Section */}
      <LogsContainer>
        <h3>Today's ELD Logs</h3>
        {logsToday.map((log, index) => (
          <p key={index}>{log.driver} - {log.time} - {log.status}</p>
        ))}
      </LogsContainer>
    </Content>
  );
};

export default DashboardHome;

/* Styled Components */
const Content = styled.div`
  margin-top: 20px;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StatCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
`;

const MapContainer = styled.div`
  background: #ddd;
  height: 300px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogsContainer = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
`;
