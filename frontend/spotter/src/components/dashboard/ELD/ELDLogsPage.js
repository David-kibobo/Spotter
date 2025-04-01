import React, { useState } from "react";
import styled from "styled-components";
import ELDGraph from "./ELDGraph";
import PrintableELDLog from "./ELDdocument";
import StatusToggle from "./StatusToggle"

const ELDLogs = () => {
  const [currentStatus, setCurrentStatus] = useState("Off-Duty");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false); // Modal state

  const driver = {
    name: "John Doe",
    coDriver: "Jane Smith", // Added co-driver
    truckNumber: "#1023",
    carrier: "ABC Logistics",
    carrierAddress: "123 Freight Lane, Dallas, TX", // Added carrier address
    totalMiles: 450, // Added total miles covered
  };

  const logs = [
    { time: "12:00 AM", status: "⚪ Off-Duty", duration: "6h", remarks: "Resting at Truck Stop" },
    { time: "06:00 AM", status: "🔵 On-Duty", duration: "30m", remarks: "Pre-trip Inspection" },
    { time: "06:30 AM", status: "🟢 Driving", duration: "4h", remarks: "Route 66" },
    { time: "10:30 AM", status: "⚪ Off-Duty", duration: "30m", remarks: "Breakfast Stop" },
    { time: "11:00 AM", status: "🟢 Driving", duration: "3h", remarks: "Interstate 35" },
    { time: "02:00 PM", status: "🔵 On-Duty", duration: "1h", remarks: "Loading at Warehouse" },
    { time: "03:00 PM", status: "🟢 Driving", duration: "2h", remarks: "Delivering Goods" },
    { time: "05:00 PM", status: "🔵 On-Duty", duration: "1h", remarks: "Unloading Freight" },
    { time: "06:00 PM", status: "⚪ Off-Duty", duration: "6h", remarks: "Resting at Motel" },
  ];
  
  // Calculate total hours for each status
  const totalTime = {
    "🟢 Driving": 9,
    "🔵 On-Duty": 2.5,
    "⚪ Off-Duty": 12.5,
  };
  
  
 
 
  

  return (
    <Container>
      {/* Left Panel */}
      <LeftPanel>
        <div>
          <h3>Driver Info</h3>
          <p><strong>🚛 Truck:</strong> {driver.truckNumber}</p>
          <p><strong>🚚 Trailer:</strong> #A230</p>
          <p><strong>👤 Name:</strong> {driver.name}</p>
          <p><strong>👥 Co-Driver:</strong> {driver.coDriver || "None"}</p>
          <p><strong>📍 Current Status:</strong> {currentStatus}</p>
          <p><strong>🏢 Carrier:</strong> {driver.carrier}</p>
          <p><strong>📍 Carrier Address:</strong> {driver.carrierAddress}</p>
          <p><strong>🛣️ Total Miles Today:</strong> {driver.totalMiles} mi</p>
        </div> 
        
        {/* Shipping Documents */}
        <ShippingSection>
          <h3>📦 Shipping Info</h3>
          <p><strong>📄 BOL / Manifest No.:</strong> #45678</p>
          <p><strong>📦 Shipper & Commodity:</strong> XYZ Freight - Electronics</p>
        </ShippingSection>
      </LeftPanel>

      {/* Main Section */}
      <MainSection>
        <Header>
          <h2>📄 ELD Logs</h2>
          <div>
            <DatePicker type="date" />
            <DownloadButton onClick={() => setIsPrintModalOpen(true)}>📥 View/Print</DownloadButton>
          </div>
        </Header>

        {/* Graph */}
        <GraphContainer>
          <ELDGraph />
        </GraphContainer>

        {/* Log Entries */}
        <LogEntries>
        <h3 style={{ marginTop: "20px" }}>Today's Log Entries</h3>

          {logs.map((entry, index) => (
            <LogItem key={index}>
              <span>{entry.time}</span>
              <span>{entry.status}</span>
              <span>{entry.duration}</span>
              <span>{entry.remarks}</span>
            </LogItem>
          ))}
        </LogEntries>

        {/* Status Update Buttons */}
        <StatusToggle />

      </MainSection>

      {/* Right Panel */}
      <RightPanel>
        <h3>HOS Recap</h3>
        <p><strong>🕒 Total On-Duty Today:</strong> {totalTime["🔵 On-Duty"]}h</p>
        <p><strong>🚛 Total Driving Time:</strong> {totalTime["🟢 Driving"]}h</p>
        <p><strong>⚪ Total Off-Duty Time:</strong> {totalTime["⚪ Off-Duty"]}h</p>
        <p><strong>📅 Last 7 Days:</strong> 63h (7h remaining)</p>
        <p><strong>⏳ Available Tomorrow:</strong> 10h 30m</p>
        <Warning>⚠️ 34-hour reset required soon!</Warning>
      </RightPanel>

      {/* Print Modal */}
      {isPrintModalOpen && (
        <PrintableELDLog driver={driver} logs={logs} onClose={() => setIsPrintModalOpen(false)} />
      )}
    </Container>
  );
};

export default ELDLogs;

// Styled Components
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
