import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import DriverCard from "./DriverCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchELDLogsByDriver, fetchDrivers, fetchDriverHosStats } from "../../../api/endPoints";
import CarrierGraphPanel from "./CarrierGraphPanel";
import HOSRecapPanel from "./HOSRecapPanel";
import PrintableELDLog from "./ELDdocument";
import { transformLogData, getHOSDurationsForDate, formatMinutes } from "../../../utils/helpers";

const CarrierELDLogsView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    
    dispatch(fetchDrivers());
    
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);
  const drivers = useSelector((state) => state.drivers?.drivers?.data ?? []);
  const logs = useSelector((state) => state.eldLogs?.eldLogs?.data ?? []);
  const trips = useSelector((state) => state.trips?.trips ?? []);
  const hosStats = useSelector((state) => state.drivers?.hosStats ?? {});

  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("off_duty");
  const [latestMiles, setLatestMiles] = useState(0);

  const selectedDriver = drivers?.find((d) => d.id === selectedDriverId);

  useEffect(() => {
    if (selectedDriverId && selectedDate) {
      dispatch(fetchELDLogsByDriver({ driverId: selectedDriverId, date: selectedDate }));
      dispatch(fetchDriverHosStats( {driverId: selectedDriverId, date: selectedDate }));
    }
  }, [selectedDriverId, selectedDate, dispatch]);
  
  const filteredLogs = logs;


  
 
  useEffect(() => {
    if (filteredLogs?.length > 0) {
      const sortedLogs = [...filteredLogs].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      const latestLog = sortedLogs[sortedLogs.length - 1];
      setCurrentStatus(latestLog.hos_status || "off_duty");
      setLatestMiles(latestLog?.distance_covered || 0);
    }
  }, [filteredLogs]);

  const transformedData = transformLogData(filteredLogs);
  const todayDurations = getHOSDurationsForDate(filteredLogs, selectedDate);

  const driver = {
    name: selectedDriver?.user?.first_name,
    coDriver: "None",
    truckNumber: selectedDriver?.truck_data?.truck_number,
    carrier: selectedDriver?.carrier_data?.name,
    carrierAddress: selectedDriver?.carrier_data?.address,
    totalMiles: latestMiles
  };

  return (
    <Container>
      <Sidebar>
        <h3>👥 Drivers</h3>
        {drivers.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            isSelected={driver.id === selectedDriverId}
            currentStatus={currentStatus}
            onSelect={() => setSelectedDriverId(driver.id)}
          />
        ))}
      </Sidebar>

      <MainSection>
        <Header>
          <h2>📄 ELD Logs - Carrier View</h2>
          <Controls>
            <DatePicker
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {selectedDriver && (
              <DownloadButton onClick={() => setIsPrintModalOpen(true)}>
                📥 View/Print
              </DownloadButton>
            )}
          </Controls>
        </Header>

        {selectedDriver ? (
          <CarrierGraphPanel
            logs={filteredLogs}
            transformedData={transformedData}
            driver={driver}
            selectedDate={selectedDate}
          />
        ) : (
          <NoDriverSelected>Please select a driver to view logs.</NoDriverSelected>
        )}
      </MainSection>

      <RightPanel>
        <HOSRecapPanel hosStats={hosStats} todayDurations={todayDurations} driver={driver} filteredLogs={filteredLogs} />
      </RightPanel>

      {isPrintModalOpen && selectedDriver && (
        <PrintableELDLog
          driver={driver}
          logs={filteredLogs}
          todayDurations={todayDurations}
          selectedDate={selectedDate}
          hosStats={hosStats}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </Container>
  );
};

export default CarrierELDLogsView;



// const Container = styled.div`
//   display: flex;
//   gap: 20px;
//   padding: 20px;
// `;

// const Sidebar = styled.div`
//   width: 250px;
//   background: #2c3e50;
//   padding: 15px;
//   color: white;
//   border-radius: 8px;
//   height: 100%;
// `;

// const MainSection = styled.div`
//   flex: 1;
//   background: #f4f4f4;
//   padding: 20px;
//   border-radius: 8px;
// `;

// // const Header = styled.div`
// //   display: flex;
// //   justify-content: space-between;
// //   flex-wrap: wrap;
// // `;
// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-direction: column;
//   gap: 10px;
//   width: 100%; /* Ensures full width for the header */
// `;
// const Controls= styled.div`
// display : flex;
// gap: 10px;
// margin-bottom: 20px;

// `
// const DatePicker = styled.input`
//   padding: 5px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
// `;

// const DownloadButton = styled.button`
//   padding: 8px 15px;
//   background: #2c3e50;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   font-size: 14px;
//   &:hover {
//     background: #1a252f;
//   }
// `;
// const RightPanel = styled.div`
//   width: 250px;
//   background: #fef8e4;
//   padding: 15px;
//   border-radius: 8px;
// `;

// // const DatePicker = styled.input`
// //   padding: 5px;
// //   border-radius: 5px;
// //   border: 1px solid #ccc;
// // `;

// // const DownloadButton = styled.button`
// //   padding: 8px 15px;
// //   background: #2c3e50;
// //   color: white;
// //   border: none;
// //   border-radius: 5px;
// //   cursor: pointer;
// // `;

// const NoDriverSelected = styled.div`
//   margin-top: 50px;
//   font-size: 18px;
//   color: #555;
//   text-align: center;
// `;
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
const Sidebar = styled.div`
  width: 250px;
  background: #2c3e50;
  padding: 15px;
  color: white;
  border-radius: 8px;
  height: 100%;
`;
const Controls= styled.div`
display : flex;
gap: 10px;
margin-bottom: 20px;
`
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
const NoDriverSelected = styled.div`
  margin-top: 50px;
  font-size: 18px;
  color: #555;
  text-align: center;
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
    flex-direction: column;
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
