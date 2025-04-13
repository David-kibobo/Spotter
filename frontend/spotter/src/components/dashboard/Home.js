import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MapComponent from "./maps/MapComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchELDLogs, fetchActiveTrips, fetchDrivers, fetchTrips, fetchTripLogs } from "../../api/endPoints"; 
import { format } from "date-fns";
import { statusMap } from "../../utils/helpers";
import MapView from "./maps/MapView";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState(null);


  
  const logsToday = useSelector((state) => state.eldLogs?.eldLogs?.data);
  // const drivers = useSelector((state) => state.drivers?.drivers?.data ?? []);
  const activeTrips = useSelector((state) => state.trips?.activeTrips); 
  const trips=useSelector((state) => state.trips?.trips); 
  const allTripLogs=useSelector((state)=> state.tripLogs?.tripLogs)


// Transforming logs data to our desired form for presentation
const displayLogs = logsToday?.map((log) => ({
  id: log.id,
  driver: `${log.driver_name || "Unknown"}`,
  time: format(new Date(log.timestamp), "hh:mm a"),
  status: statusMap[log.hos_status] || log.hos_status,
  location: log.location_name || "Unknown Location",
}));

  useEffect(() => {
    dispatch(fetchELDLogs());
  dispatch(fetchTrips());
    dispatch(fetchActiveTrips());
    dispatch(fetchTripLogs());
  }, [dispatch]);

  return (
    <Content>
      {/* Overview Section */}
      <Overview>
        <StatCard>🚛 Active Trips: <span>{trips?.length}</span></StatCard>
        <StatCard>📄 Logs Today: <span>{logsToday?.length}</span></StatCard>
        {(userRole === "carrier" || userRole === "dispatcher") && (
          <StatCard>⚠️ Violations: <span>1</span></StatCard>
        )}
      </Overview>

      {/* Map Section */}
      <MapContainer>
        {/* <MapComponent userRole={userRole} /> */}
        <MapView trips={trips} tripLogsAll={allTripLogs}/>
      </MapContainer>

      {/* Logs Section */}
       <LogsContainer>
      <h3>Today's ELD Logs</h3>
      {displayLogs?.map((log) => (
        <p key={log.id}>{log.driver} - {log.time} - {log.status}</p>
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
