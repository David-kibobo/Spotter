import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector, } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchELDLogsByDriver,
  fetchDriverHosStats,
  fetchDriverTrips,
  updateTrip

} from "../../api/endPoints";
import { calculateMilesForDate, getHOSDurationsForDate, getLatestStatusForDriver } from "../../utils/helpers";
import HOSRecapPanel from "./ELD/HOSRecapPanel";
import MapView from "./maps/MapView";
import { statusMap } from "../../utils/helpers";
import StatusToggle from "./ELD/StatusToggle";
import { toast } from "react-toastify";

const DriverHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Redux state selectors
  const { user, status } = useSelector((state) => state.auth);
  const driverId = useSelector((state) => state.auth?.user?.driver_profile_id);
  const logs = useSelector((state) => state.eldLogs?.driverEldLogs?.data || []);
  const hosStats = useSelector((state) => state.drivers?.hosStats ?? []);
  const trips = useSelector((state) => state.trips?.trips || []);
  const currentTrip = trips?.find((trip) => trip.status === "in_progress");
  const miles = calculateMilesForDate(selectedDate, trips)


  const [latestMiles, setLatestMiles] = useState(0);

  useEffect(() => {
    if (driverId) {
      dispatch(fetchELDLogsByDriver({ driverId: driverId, date: selectedDate }));
      dispatch(fetchDriverHosStats({ driverId: driverId, date: selectedDate }));

      dispatch(fetchDriverTrips(driverId));
    }
  }, [driverId, selectedDate, dispatch]);
  const driver = {
    driverId: user?.driver_profile_id,
    name: user?.first_name,
    coDriver: "None",
    truckNumber: "#1023",
    carrier: user?.carrier_data?.name,
    carrierAddress: user?.carrier_data?.address,
    totalMiles: latestMiles,
  };

  const todayDurations = logs?.length
    ? getHOSDurationsForDate(logs, selectedDate)
    : {
      totalOnDuty: 0,
      totalDriving: 0,
      totalOffDuty: 0,
      totalSleeperBerth: 0,
    };

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );


  const latestLog = sortedLogs[sortedLogs.length - 1];
  const currentStatus = latestLog?.hos_status || "off_duty"

  const nextTrip = trips?.find((trip) => trip.status === "scheduled");
  const handleStartTrip = async (tripId) => {
    try {
      await dispatch(updateTrip({ id: tripId, tripData: { status: "in_progress" } })).unwrap();

      // ✅ Redirect to ELD Logs page for that trip
      navigate("eld-logs/driver");
    } catch (error) {
      console.error("Failed to start trip:", error);
      toast.error("Unable to start trip. Please try again.");
    }
  };

  return (
    <Container>
      <LeftPanel>
        <Section>
          <h3>👤 Driver Info</h3>
          <p><strong>Name:</strong> {driver?.name}</p>
          <p><strong>Truck:</strong> {driver?.truckNumber}</p>
          <p><strong>Carrier:</strong> {driver?.carrier}</p>
          <p><strong>Carrier Address:</strong> {driver?.carrierAddress}</p>
          <p><strong>Current Status:</strong> {statusMap[currentStatus]}</p>
          <p><strong>Total Miles Today:</strong> {miles || 0} mi</p>
        </Section>

        <Section>
          <h3>📦 Shipping</h3>
          <p><strong>BOL #:</strong> #45678</p>
          <p><strong>Commodity:</strong> XYZ Freight - Electronics</p>
        </Section>
        {nextTrip && (
          <Section>
            <h3>📅 Next Scheduled Trip</h3>
            <p><strong>From:</strong> {nextTrip.start_location}</p>
            <p><strong>To:</strong> {nextTrip.destination_location}</p>
            <p><strong>Start:</strong> {new Date(nextTrip.start_time).toLocaleString()}</p>
            <Button onClick={() => handleStartTrip(nextTrip.id)}
              disabled={nextTrip.status !== "scheduled"}
            >Start Trip</Button>
          </Section>
        )}

      </LeftPanel>

      <MainSection>
        <Section>
          {/* <h3>🚦 Change Status</h3> */}
          {/* <StatusToggle
    onStatusChange={handleStatusChange}
    activeStatus={currentStatus}
    hosStats={hosStats}
  /> */}
        </Section>

        <Header>
          <h2>👋 Hello, {driver?.name?.split(" ")[0] || "Driver"}!</h2>
          <p>Today is {new Date().toLocaleDateString()}</p>
        </Header>

        <AlertBox>
          {hosStats?.total_hours_past_8_days >= 60 ? (
            <p>⚠️ You're nearing your 70-hour limit. Plan a reset soon.</p>
          ) : (
            <p>✅ HOS within safe limits. Keep up the good work!</p>
          )}
          {hosStats?.lastFuelingMiles >= 900 && (
            <p>⛽ Fueling recommended soon. It's been {hosStats.lastFuelingMiles} miles.</p>
          )}
        </AlertBox>

        <Section>


        </Section>

        {currentTrip && (
          <Section>
            <h3>📍 Location Map</h3>

            <MapContainer>
              <MapView selectedTrip={currentTrip} />
            </MapContainer>

          </Section>
        )}
      </MainSection>
      <RightPanel>
        <HOSRecapPanel
          hosStats={hosStats}
          todayDurations={todayDurations}
          driver={driver}
          filteredLogs={logs}
          totalMiles={miles}
        />

      </RightPanel>
    </Container>
  );
};

export default DriverHomePage;

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
  width: 240px;
  background: #2c3e50;
  color: white;
  padding: 15px;
  border-radius: 8px;
  min-height: 100%;
  font-size: 14px;

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

const Header = styled.div`
  margin-bottom: 20px;

  h2 {
    margin-bottom: 5px;
  }
`;

const Section = styled.div`
  margin-top: 20px;

  h3 {
    margin-bottom: 10px;
    color: #ffd700;
  }

  p {
    margin: 4px 0;
  }
`;

const AlertBox = styled.div`
  background: #fff4e5;
  color: #8b4a00;
  padding: 10px 15px;
  border-left: 4px solid #ffae42;
  border-radius: 5px;
  margin-bottom: 25px;

  p {
    margin: 6px 0;
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
const Button = styled.button`
  padding: 8px 12px;
  background-color: #28a745;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #218838;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

`;

const MapContainer = styled.div`
  background: #ddd;
  height: 300px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
