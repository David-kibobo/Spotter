
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import ELDGraph from "./ELDGraph";
import PrintableELDLog from "./ELDdocument";
import StatusToggle from "./StatusToggle";
import { useDispatch } from "react-redux";
import { fetchELDLogsByDriver, fetchDriverHosStats } from "../../../api/endPoints"; 
import { transformLogData, getHOSDurationsForDate, formatMinutes } from "../../../utils/helpers";
import HOSRecapPanel from "./HOSRecapPanel";

const ELDLogsView = ({ driver, logs, currentStatus, trips, setIsPrintModalOpen, isPrintModalOpen, hosStats }) => {
  const dispatch=useDispatch();
  
  const [selectedTripId, setSelectedTripId] = useState(""); 
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10)); 
  const [latestMiles, setLatestMiles] = useState(0);

  console.log("TRips", logs)
 useEffect(() => {
    if (selectedDate) {
      dispatch(fetchELDLogsByDriver({ driverId: driver.driverId, date: selectedDate }));
      dispatch(fetchDriverHosStats({driverId:driver.driverId, date:selectedDate}));
    }
  }, [ selectedDate, dispatch]);
 
  const filteredLogs=logs;

   
  const transformedData = transformLogData(logs);
  const todayDurations = getHOSDurationsForDate(filteredLogs,selectedDate);

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
          <h2 style={{ marginTop: "5px" }}>📄 ELD Logs</h2>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom:"50px" }}>
            {/* <select value={selectedTripId} onChange={e => setSelectedTripId(e.target.value)}>
              <option value="">All Trips</option>
              {trips?.map((trip) => {
                const startCity = trip.start_location?.split(',')[0] || 'Start';
                const endCity = trip.destination_location?.split(',')[0] || 'End';
                return (
                  <option key={trip.id} value={trip.id}>
                    Trip #{trip.truck_data?.truck_number} — {startCity} → {endCity}
                  </option>
                );
              })} */}
            {/* </select> */}

            <DatePicker type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            <DownloadButton onClick={() => setIsPrintModalOpen(true)}>📥 View/Print</DownloadButton>
          </div>
        </Header>

        <GraphContainer>
          <ELDGraph logs={filteredLogs} />
        </GraphContainer>

        <LogEntries>
          <h3>Log Entries for {selectedDate}</h3>
          {transformedData?.map((entry, index) => (
            <LogItem key={index}>
              <span>{entry.time}</span>
              <span>{entry.status}</span>
              <span>{entry.duration}</span>
              <span>{entry.remarks}</span>
            </LogItem>
          ))}
        </LogEntries>
      </MainSection>

      <RightPanel>
        <HOSRecapPanel hosStats={hosStats} todayDurations={todayDurations} driver={driver} filteredLogs={filteredLogs} />
        
      </RightPanel>

      {isPrintModalOpen && (
        <PrintableELDLog driver={driver} logs={filteredLogs} todayDurations={todayDurations} selectedDate={selectedDate} hosStats={hosStats} onClose={() => setIsPrintModalOpen(false)} />
      )}
    </Container>
  );
};

export default ELDLogsView;

// ... (imports remain the same)

const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  flex-wrap: nowrap;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const LeftPanel = styled.div`
  width: 220px;
  background: #2c3e50;
  color: white;
  padding: 15px;
  border-radius: 8px;
  min-height: 100%;

  @media (max-width: 1024px) {
    width: 100%;
    order: 1;
  }
`;

const MainSection = styled.div`
  flex: 1;
  background: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  min-height: 100%;

  @media (max-width: 1024px) {
    width: 100%;
    order: 2;
  }
`;

const RightPanel = styled.div`
  width: 250px;
  background: #fef8e4;
  padding: 15px;
  border-radius: 8px;
  min-height: 100%;
  height: auto;

  @media (max-width: 1024px) {
    width: 100%;
    order: 3;
  }
`;

const GraphContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 40px;
  background: #ddd;
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  @media (max-width: 600px) {
    height: 150px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
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
  flex-wrap: wrap;

  span {
    flex: 1;
    min-width: 100px;
    text-align: center;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    span {
      text-align: left;
    }
  }
`;

const ShippingSection = styled.div`
  margin-top: 20px;
  background: #2c3e50;
  color: white;
  padding: 10px;
  border-radius: 5px;
`;

const Warning = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 10px;
`;
