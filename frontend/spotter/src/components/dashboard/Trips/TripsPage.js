
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CreateTripModal from "./CreateTripModal";
import TripDetailsModal from "./TripDetailsModal";
import { fetchDrivers, fetchTrucks, fetchTrips, fetchDriverTrips } from "../../../api/endPoints";
import { useDispatch, useSelector } from "react-redux";
import DriverELDLogs from "../ELD/DriverELDLogs";
import DriversTripList from "../ELD/DriversTripList";
import { formatDateTime } from "../../../utils/helpers";


const TripsPage = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("default");
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const drivers = useSelector((state) => state.drivers?.drivers?.data ?? []);
  const trucks = useSelector((state) => state.trucks?.trucks.data?? []);
  const trips = useSelector((state) => state.trips?.trips ?? []);
  const { user } = useSelector((state) => state.auth);

  const userRole = user?.role;
  
  useEffect(() => {
    if (user?.role === "Driver") {
      // Fetch only driver's trips if the user is a driver
      dispatch(fetchDriverTrips(user?.driver_profile_id));
    } else {
      // Fetch all trips, drivers, and trucks if the user is not a driver
      dispatch(fetchTrips());
      dispatch(fetchDrivers());
      dispatch(fetchTrucks());
    }
  }, [dispatch, user?.role]);

  // Filter trips based on the selected tab
  const filteredTrips = selectedTab === "default"
    ? trips
    : trips.filter((trip) => trip.status === selectedTab);

  // Further filter trips if the user is a driver
  const driverTrips = userRole === "Driver" ? filteredTrips.filter((trip) => trip.driver_data?.user.id === user.id) : filteredTrips;

  return (
    <Container>
      <Sidebar>
        <h2>📌 Trips</h2>
        <NavButton onClick={() => setSelectedTab("default")}>📋 All Trips</NavButton>
        <NavButton onClick={() => setSelectedTab("scheduled")}>🟢 Upcoming Trips</NavButton>
        <NavButton onClick={() => setSelectedTab("in_progress")}>🟡 Ongoing Trips</NavButton>
        <NavButton onClick={() => setSelectedTab("completed")}>🔵 Completed Trips</NavButton>
      </Sidebar>

      <MainPanel>
        <Header>
          {userRole=== "Driver" ?<h2>🚛 Your Trips</h2>:<h2>🚛 Manage Trips</h2>}
          {userRole !== "Driver" && (
            <CreateTripButton  onClick={() => setIsCreateTripModalOpen(true)}>➕ Create Trip</CreateTripButton>
          )}
        </Header>

        {userRole === "Driver" ? (
          // Driver View: Show only the driver's trips
          <TripSection>
            <DriversTripList trips={driverTrips} setSelectedTrip={setSelectedTrip} />
          </TripSection>
        ) : (
          // Dispatcher/Carrier Owner View: Show all trips
          <TripSection>
            <h3>
              {selectedTab === "scheduled" && "🟢 Upcoming Trips"}
              {selectedTab === "in_progress" && "🟡 Ongoing Trips"}
              {selectedTab === "completed" && "🔵 Completed Trips"}
            </h3>
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) =>{ const { date, time } = formatDateTime(trip.start_time);
              return (
                <TripCard key={trip.id} onClick={() => setSelectedTrip(trip)}>
                  <p>
                    <strong>{trip.start_location}</strong> ➝ <strong>{trip.destination_location}</strong>
                  </p>
                  <span>📅 {date} at {time}</span>
                </TripCard>
              )}
            )) : (
              <NoTrips>No trips found in this category.</NoTrips>
            )}
          </TripSection>
        )}
      </MainPanel>

      {/* Create Trip Modal */}
      {isCreateTripModalOpen && <CreateTripModal trucks={trucks} drivers={drivers} onClose={() => setIsCreateTripModalOpen(false)} />}

      {/* Trip Details Modal */}
      {selectedTrip && <TripDetailsModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} userRole={userRole} />}
    </Container>
  );
};

export default TripsPage;

//  Styled Components

const Container = styled.div`
  display: flex;
  height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 8px;
  }
`;

const NavButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #34495e;
  color: white;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  white-space: nowrap;

  &:hover {
    background: #1f2f3d;
  }

  @media (max-width: 768px) {
    width: auto;
    margin-top: 0;
    margin-right: 10px;
    padding: 8px 12px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 10px;
  }
`;

const MainPanel = styled.div`
  flex: 1;
  background: #f8f9fa;
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const CreateTripButton = styled.button`
  padding: 10px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #2980b9;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const TripSection = styled.div`
  margin-top: 20px;
`;

const TripCard = styled.div`
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
`;

const NoTrips = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-style: italic;
  margin-top: 10px;
`;
