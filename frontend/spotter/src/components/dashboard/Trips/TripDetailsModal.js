

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchLoads, fetchTripLogs } from "../../../api/endPoints";
import { useDispatch, useSelector } from "react-redux";
import {  TileLayer, Marker, Popup, Polyline } from "react-leaflet";

import CreateLoadModal from "./CreateLoadModal"; 
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapView from "../maps/MapView";

const TripDetailsModal = ({ trip, onClose, onCreateLoad, userRole }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLoads());
    dispatch(fetchTripLogs(trip.id)); // Fetch trip logs based on the trip ID
  }, [dispatch, trip.id]);

  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const loads = useSelector((state) => state.loads?.loads ?? []);
  const loadsForThisTrip = loads.filter((load) => load.trip === trip.id);

   const tripLogs = useSelector((state) => state.tripLogs?.tripLogs ?? []);
  // Coordinates for the start and destination locations
  const startCoordinates = trip.start_coordinates || [37.7749, -122.4194]; 
  const destinationCoordinates = trip.destination_coordinates || [34.0522, -118.2437]; 

  // Extract coordinates from trip logs (assuming lat, lng in logs)
  const tripPath = tripLogs.map((log) => [log.latitude, log.longitude]);

  return (
    <ModalOverlay>
      <ModalContent>
        {/* Header */}
        <ModalHeader>
          <h2>🚛 Trip Details</h2>
          <CloseButton onClick={onClose}>✖</CloseButton>
        </ModalHeader>

        {/* Trip Info */}
        <TripInfo>
          <p><strong>🚚 Truck:</strong> {trip.truck_data?.truck_number}</p>
          <p><strong>👤 Driver:</strong> {trip.driver_data?.user.first_name} {trip.driver_data?.user.last_name}</p>
          <p><strong>📍 From:</strong> {trip.start_location} ➝ <strong>To:</strong> {trip.destination_location}</p>
          <p><strong>📏 Distance:</strong> {trip.estimated_distance} miles</p>
        </TripInfo>

        {/* Map Section */}
        <MapSection>
          <MapContainer>
          <MapView selectedTrip={trip}/>
          </MapContainer>
         
         
          
        </MapSection>

        {/* Loads Section */}
        <h3>📦 Loads</h3>
        {loadsForThisTrip && loadsForThisTrip.length > 0 ? (
          <LoadsContainer>
            {loadsForThisTrip.map((load, index) => (
              <LoadCard key={index}>
                <LoadTitle>📦 {load.commodity} - {load.weight} lbs</LoadTitle>
                <LoadDetails>
                  <span>📍 {load.pickup_location} ➝ {load.dropoff_location}</span>
                  <span>🕒 {load.pickup_time} - {load.dropoff_time}</span>
                </LoadDetails>
              </LoadCard>
            ))}
          </LoadsContainer>
        ) : (
          <NoLoadsMessage>No loads added yet.</NoLoadsMessage>
        )}

        {/* Create Load Button */}
        <ButtonContainer>
          {userRole !== "Driver" && <CreateLoadButton onClick={() => setIsLoadModalOpen(true)}>➕ Add Load</CreateLoadButton>}
        </ButtonContainer>

        {/* Create Load Modal */}
        {isLoadModalOpen && <CreateLoadModal tripId={trip.id} onClose={() => setIsLoadModalOpen(false)} onCreateLoad={onCreateLoad} />}
      </ModalContent>
    </ModalOverlay>
  );
};

export default TripDetailsModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: left;
  animation: fadeIn 0.3s ease-in-out;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #e74c3c;
  &:hover {
    color: #c0392b;
  }
`;

const TripInfo = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 16px;
`;

const MapSection = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  background: #ecf0f1;
`;

const LoadsContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
  flex-shrink: 0;
`;

const LoadCard = styled.div`
  background: #ecf0f1;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const LoadTitle = styled.p`
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const LoadDetails = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  display: flex;
  flex-direction: column;
`;

const NoLoadsMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin: 10px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const CreateLoadButton = styled.button`
  background: #27ae60;
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
  &:hover {
    background: #219150;
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