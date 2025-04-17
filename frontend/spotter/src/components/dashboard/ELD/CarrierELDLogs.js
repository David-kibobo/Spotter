import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import DriverCard from "./DriverCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchELDLogsByDriver, fetchDrivers, fetchDriverHosStats, fetchELDLogs } from "../../../api/endPoints";
import CarrierGraphPanel from "./CarrierGraphPanel";
import HOSRecapPanel from "./HOSRecapPanel";
import PrintableELDLog from "./ELDdocument";
import { transformLogData, getHOSDurationsForDate, formatMinutes, calculateMilesForDate, getLatestStatusForDriver } from "../../../utils/helpers";


const CarrierELDLogsView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);
  const drivers = useSelector((state) => state.drivers?.drivers?.data ?? []);
  const logs = useSelector((state) => state.eldLogs?.eldLogs?.data ?? []);
  const driverLogs=useSelector((state) => state.eldLogs?.driverEldLogs?.data ?? []);
  const trips = useSelector((state) => state.trips?.trips ?? []);
  const hosStats = useSelector((state) => state.drivers?.hosStats ?? {});

  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const selectedDriver = drivers?.find((d) => d.id === selectedDriverId);

  useEffect(() => {
    if (selectedDriverId && selectedDate) {
      // dispatch(fetchELDLogs())
      dispatch(fetchELDLogsByDriver({ driverId: selectedDriverId, date: selectedDate }));
      dispatch(fetchDriverHosStats({ driverId: selectedDriverId, date: selectedDate }));
    }
  }, [selectedDriverId, selectedDate, dispatch]);

  const filteredLogs = driverLogs?.filter(log => log.driver === selectedDriverId);
  const driverTrips = trips.filter(trip => trip.driver === selectedDriverId);
  const miles = calculateMilesForDate(selectedDate, driverTrips);

  const transformedData = transformLogData(filteredLogs);

  const todayDurations = getHOSDurationsForDate(filteredLogs, selectedDate);


  const driver = {
    name: selectedDriver?.user?.first_name,
    coDriver: "None",
    truckNumber: selectedDriver?.truck_data?.truck_number,
    carrier: selectedDriver?.carrier_data?.name,
    carrierAddress: selectedDriver?.carrier_data?.address,
    
  };
  // For each driver, calculate the status based on the logs
  const driverStatus = drivers?.map(driver => {
  
    const currentStatus = getLatestStatusForDriver(driverLogs, selectedDate, driver.id);
    return {
      driverId: driver.id,
      status: currentStatus,
    };
  });

  // Now, when mapping drivers to DriverCard, we pass the correct status for each driver
  return (
    <Container>
      <Sidebar>
        <h3>👥 Drivers</h3>
        {drivers.map((driver) => {
          // Get the status for the current driver
          const driverStatusForCurrentDriver = driverStatus.find(status => status.driverId === driver.id)?.status || "off_duty";

          return (
            <DriverCard
              key={driver.id}
              driver={driver}
              isSelected={driver.id === selectedDriverId}
              currentStatus={driverStatusForCurrentDriver}
              onSelect={() => setSelectedDriverId(driver.id)}
            />
          );
        })}
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
            driver={driver}
            selectedDate={selectedDate}
            transformedData={transformedData}
          />
        ) : (
          <NoDriverSelected>Please select a driver to view logs.</NoDriverSelected>
        )}
      </MainSection>

      <RightPanel>
      <HOSRecapPanel hosStats={hosStats} totalMiles={miles} todayDurations={todayDurations} driver={driver} filteredLogs={filteredLogs} />
      
      </RightPanel>

      {isPrintModalOpen && selectedDriver && (
        <PrintableELDLog
          driver={driver}
          logs={filteredLogs}
          selectedDate={selectedDate}
          hosStats={hosStats}
          totalMiles={miles}
          todayDurations={todayDurations}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </Container>
  );
};

export default CarrierELDLogsView;



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
