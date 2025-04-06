// components/eldLogs/ELDLogsView.jsx
import React from "react";
import styled from "styled-components";
import ELDGraph from "./ELDGraph";
import PrintableELDLog from "./ELDdocument";
import StatusToggle from "./StatusToggle";
import { transformLogData } from "../../../utils/helpers";
const ELDLogsView = ({ driver, logs, currentStatus, setIsPrintModalOpen, isPrintModalOpen, hosStats }) => {
  // Calculate total hours for each status (mock for now)

  const transformedData=transformLogData(logs)
  const totalTime = {
    "🟢 Driving": 9,
    "🔵 On-Duty": 2.5,
    "⚪ Off-Duty": 12.5,

  };
//   / Handle status change from StatusToggle (could be passed down as a prop)
//   const handleStatusChange = (newStatus) => {
//     setCurrentStatus(newStatus);
//     // Prepare the log data
//     const logData = {
//       driver: driverId,
//       hos_status: newStatus.toLowerCase(), // ensure matching backend format
//       // Include additional fields like location, remarks, etc. as needed
//     };
//     dispatch(createEldLog(logData));
//   };
  return (
    <Container>
      <LeftPanel>
        <div>
          <h3>Driver Info</h3>
          <p><strong>🚛 Truck:</strong> {driver?.truckNumber}</p>
          <p><strong>🚚 Trailer:</strong> #A230</p>
          <p><strong>👤 Name:</strong> {driver?.name}</p>
          <p><strong>👥 Co-Driver:</strong> {driver?.coDriver || "None"}</p>
          <p><strong>📍 Current Status:</strong> {currentStatus}</p>
          <p><strong>🏢 Carrier:</strong> {driver?.carrier}</p>
          <p><strong>📍 Carrier Address:</strong> {driver?.carrierAddress}</p>
          <p><strong>🛣️ Total Miles Today:</strong> {driver?.totalMiles} mi</p>
        </div>
        <ShippingSection>
          <h3>📦 Shipping Info</h3>
          <p><strong>📄 BOL / Manifest No.:</strong> #45678</p>
          <p><strong>📦 Shipper & Commodity:</strong> XYZ Freight - Electronics</p>
        </ShippingSection>
      </LeftPanel>

      <MainSection>
        <Header>
          <h2>📄 ELD Logs</h2>
          <div>
            <DatePicker type="date" />
            <DownloadButton onClick={() => setIsPrintModalOpen(true)}>📥 View/Print</DownloadButton>
          </div>
        </Header>

        <GraphContainer>
          <ELDGraph />
        </GraphContainer>

        <LogEntries>
          <h3>Today's Log Entries</h3>
          {transformedData?.map((entry, index) => (
            <LogItem key={index}>
              <span>{entry.time}</span>
              <span>{entry.status}</span>
              <span>{entry.duration}</span>
              <span>{entry.remarks}</span>
            </LogItem>
          ))}
        </LogEntries>

        {/* <StatusToggle /> */}
      </MainSection>

      <RightPanel>
        <h3>HOS Recap</h3>
        <p><strong>🕒 Total On-Duty Today:</strong> {hosStats.totalToday}h</p>
        <p><strong>🚛 Total Driving Time:</strong> {hosStats.totalLast7Days - hosStats.totalToday}h</p>
        <p><strong>⚪ Total Off-Duty Time:</strong> {hosStats.totalLast7Days - hosStats.totalToday - hosStats.totalToday}h</p>
        <p><strong>📅 Last 7 Days:</strong> {hosStats.totalLast7Days}h</p>
        <p><strong>⏳ Available Tomorrow:</strong> {hosStats.availableHoursTomorrow}h</p>
        <Warning>⚠️ 34-hour reset required soon!</Warning>
      </RightPanel>
      {isPrintModalOpen && (
        <PrintableELDLog driver={driver} logs={logs} onClose={() => setIsPrintModalOpen(false)} />
      )}
    </Container>
  );
};

export default ELDLogsView;


const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const LeftPanel = styled.div`
  width: 220px;
  background: #2c3e50;
  color: white;
  padding: 15px;
  border-radius: 8px;
`;

const MainSection = styled.div`
  flex: 1;
  background: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
`;
const GraphContainer = styled.div`
margin-top:20px;
margin-bottom:30px;
  background: #ddd;
  height: 200px;
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;
const ShippingSection = styled.div`
  margin-top: 20px;
  background: #2c3e50;
  color: white;
  padding: 10px;
  border-radius: 5px;
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;
const StatusContainer = styled.div`
  display: flex; /* Make buttons horizontal */
  justify-content: center; /* Center buttons */
  gap: 10px;
  background: #222;
  padding: 10px;
  border-radius: 10px;
`;

const StatusButton = styled.button`
  width: 120px;
  padding: 12px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ isActive }) => (isActive ? "white" : "#333")};
  background: ${({ color, isActive }) => (isActive ? color : "#555")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  position: relative;

  &:hover {
    opacity: 0.8;
  }

  /* Moves active button UP, inactive buttons stay down */
  transform: ${({ isActive }) => (isActive ? "translateY(-5px)" : "translateY(5px)")};
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DatePicker = styled.input`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const DownloadButton = styled.button`
  padding: 8px 15px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #1a252f;
  }
`;

const LogEntries = styled.div`
  margin-top: 30px;
`;

const LogItem = styled.div`
  display: flex;
  justify-content: space-between;
  background: white;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
`;

const RightPanel = styled.div`
  width: 250px;
  background: #fef8e4;
  padding: 15px;
  border-radius: 8px;
`;

const Warning = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 10px;
`;
