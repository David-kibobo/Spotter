// // components/eldLogs/ELDLogsView.jsx
// import React, { useState } from "react";
// import styled from "styled-components";
// import ELDGraph from "./ELDGraph";
// import PrintableELDLog from "./ELDdocument";
// import StatusToggle from "./StatusToggle";
// import { transformLogData, getTodayHOSDurations, formatMinutes } from "../../../utils/helpers";
// // import { duration } from "html2canvas/dist/types/css/property-descriptors/duration";
// const ELDLogsView = ({ driver, logs, currentStatus, setIsPrintModalOpen, isPrintModalOpen, hosStats }) => {


//   // Calculate total hours for each status 
//   const todayDurations = getTodayHOSDurations(logs); 
// //   setHosDurations({
// //    drivingToday: todayDurations.drivingToday,
// //   offDutyToday: todayDurations.offDutyToday,
// //   sleeperToday: todayDurations.sleeperToday,
// //   onDutyToday: todayDurations.onDutyToday
// // })

//   // Transform data to our desired presentation 
//   const transformedData=transformLogData(logs)
//   const totalTime = {
//     "🟢 Driving": 9,
//     "🔵 On-Duty": 2.5,
//     "⚪ Off-Duty": 12.5,

//   };

//   return (
//     <Container>
//       <LeftPanel>
//         <div>
//           <h3>Driver Info</h3>
//           <p><strong>🚛 Truck:</strong> {driver?.truckNumber}</p>
//           <p><strong>🚚 Trailer:</strong> #A230</p>
//           <p><strong>👤 Name:</strong> {driver?.name}</p>
//           <p><strong>👥 Co-Driver:</strong> {driver?.coDriver || "None"}</p>
//           <p><strong>📍 Current Status:</strong> {currentStatus}</p>
//           <p><strong>🏢 Carrier:</strong> {driver?.carrier}</p>
//           <p><strong>📍 Carrier Address:</strong> {driver?.carrierAddress}</p>
//           <p><strong>🛣️ Total Miles Today:</strong> {driver?.totalMiles} mi</p>
//         </div>
//         <ShippingSection>
//           <h3>📦 Shipping Info</h3>
//           <p><strong>📄 BOL / Manifest No.:</strong> #45678</p>
//           <p><strong>📦 Shipper & Commodity:</strong> XYZ Freight - Electronics</p>
//         </ShippingSection>
//       </LeftPanel>

//       <MainSection>
//         <Header>
//           <h2>📄 ELD Logs</h2>
//           <div>
//             <DatePicker type="date" />
//             <DownloadButton onClick={() => setIsPrintModalOpen(true)}>📥 View/Print</DownloadButton>
//           </div>
//         </Header>

//         <GraphContainer>
//           <ELDGraph logs={logs} />
//         </GraphContainer>

//         <LogEntries>
//           <h3>Today's Log Entries</h3>
//           {transformedData?.map((entry, index) => (
//             <LogItem key={index}>
//               <span>{entry.time}</span>
//               <span>{entry.status}</span>
//               <span>{entry.duration}</span>
//               <span>{entry.remarks}</span>
//             </LogItem>
//           ))}
//         </LogEntries>

//         {/* <StatusToggle /> */}c
//       </MainSection>

//       <RightPanel>
//         <h3>HOS Recap</h3>
//         <p><strong>🕒 Total On-Duty Today:</strong> {formatMinutes(todayDurations.onDutyToday)}</p>
//         <p><strong>🚛 Total Driving Time:</strong> {formatMinutes(todayDurations.drivingToday)}</p>
//         <p><strong>⚪ Total Off-Duty Time:</strong> {formatMinutes(todayDurations.offDutyToday)}</p>
//         <p><strong>📅 Last 7 Days:</strong> {hosStats.totalLast7Days}h</p>
//         <p><strong>⏳ Available Tomorrow:</strong> {hosStats.availableHoursTomorrow}h</p>
//         <Warning>⚠️ 34-hour reset required soon!</Warning>
//       </RightPanel>
//       {isPrintModalOpen && (
//         <PrintableELDLog driver={driver} logs={logs} hosStats={hosStats} onClose={() => setIsPrintModalOpen(false)} />
//       )}
//     </Container>
//   );
// };

// export default ELDLogsView;
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import ELDGraph from "./ELDGraph";
import PrintableELDLog from "./ELDdocument";
import StatusToggle from "./StatusToggle";
import { transformLogData, getHOSDurationsForDate, formatMinutes } from "../../../utils/helpers";

const ELDLogsView = ({ driver, logs, currentStatus, trips, setIsPrintModalOpen, isPrintModalOpen, hosStats }) => {
  const [selectedTripId, setSelectedTripId] = useState(""); 
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10)); 

  console.log("TRips", logs)

  const filteredLogs = useMemo(() => {
    return logs?.filter(log => {
      const logStart = new Date(log.timestamp).setHours(0, 0, 0, 0); // Reset time to midnight
      const logEnd = log.endtime ? new Date(log.endtime).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0); // Same for endtime
  
      const selected = new Date(selectedDate).setHours(0, 0, 0, 0); // Ensure selectedDate is midnight
      
      return (
        (!selectedTripId || log.trip === selectedTripId) && // Only filter by trip_id if it's selected
        selected >= logStart && selected <= logEnd // Date-only comparison
      );
    }) || [];
  }, [logs, selectedTripId, selectedDate]);
  
console.log("filtered", filteredLogs)  
  const transformedData = transformLogData(filteredLogs);
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
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom:"20px" }}>
            <select value={selectedTripId} onChange={e => setSelectedTripId(e.target.value)}>
              <option value="">All Trips</option>
              {trips?.map((trip) => {
                const startCity = trip.start_location?.split(',')[0] || 'Start';
                const endCity = trip.destination_location?.split(',')[0] || 'End';
                return (
                  <option key={trip.id} value={trip.id}>
                    Trip #{trip.truck_data?.truck_number} — {startCity} → {endCity}
                  </option>
                );
              })}
            </select>

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
        <h3>HOS Recap</h3>
        <p><strong>🕒 Total On-Duty:</strong> {formatMinutes(todayDurations.onDutyToday)}</p>
        <p><strong>🚛 Total Driving Time:</strong> {formatMinutes(todayDurations.drivingToday)}</p>
        <p><strong>⚪ Off-Duty Time:</strong> {formatMinutes(todayDurations.offDutyToday)}</p>
        <p><strong>📅 Last 7 Days:</strong> {hosStats.totalLast7Days}h</p>
        <p><strong>⏳ Available Tomorrow:</strong> {hosStats.availableHoursTomorrow}h</p>
        <Warning>⚠️ 34-hour reset required soon!</Warning>
      </RightPanel>

      {isPrintModalOpen && (
        <PrintableELDLog driver={driver} logs={filteredLogs} todayDurations={todayDurations} selectedDate={selectedDate} hosStats={hosStats} onClose={() => setIsPrintModalOpen(false)} />
      )}
    </Container>
  );
};

export default ELDLogsView;

const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  flex-wrap: nowrap; /* Ensures no wrapping */
`;

const LeftPanel = styled.div`
  width: 220px;
  background: #2c3e50;
  color: white;
  padding: 15px;
  border-radius: 8px;
  min-height: 100%; /* Ensures the panel stretches vertically */
`;

const MainSection = styled.div`
  flex: 1;
  background: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  min-height: 100%; /* Prevents it from pushing other elements below */
`;

const RightPanel = styled.div`
  width: 250px;
  background: #fef8e4;
  padding: 15px;
  border-radius: 8px;
  min-height: 100%; /* Ensures it aligns with the left panel */
  height: auto; /* Prevents it from growing too tall */
`;

const GraphContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 40px;
  background: #ddd;
  height: 200px;
  width: 100%; /* Adjust the width to fit within the MainSection */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  width: 100%; /* Ensures full width for the header */
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

