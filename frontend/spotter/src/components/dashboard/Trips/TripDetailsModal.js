import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CreateLoadModal from "./CreateLoadModal"; // Import the modal

const TripDetailsModal = ({ trip, onClose, onCreateLoad }) => {
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [loads, setLoads] = useState([]);

  // Fetch Loads when Modal Opens
//   useEffect(() => {
//     const fetchLoads = async () => {
//       try {
//         const response = await api.get(`/loads/?trip_id=${trip.id}`); // Filter by trip
//         setLoads(response.data);
//       } catch (error) {
//         console.error("Failed to fetch loads:", error);
//       }
//     };

//     fetchLoads();
//   }, [trip.id]);

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
          <p><strong>🚚 Truck:</strong> {trip.truck}</p>
          <p><strong>👤 Driver:</strong> {trip.driver}</p>
          <p><strong>📍 From:</strong> {trip.start_location} ➝ <strong>To:</strong> {trip.destination}</p>
          <p><strong>📏 Distance:</strong> {trip.estimated_distance} miles</p>
        </TripInfo>

        {/* Loads Section */}
        <h3>📦 Loads</h3>
        {loads && loads.length > 0 ? (
          <LoadsContainer>
            {loads.map((load, index) => (
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
          <CreateLoadButton onClick={() => setIsLoadModalOpen(true)}>➕ Add Load</CreateLoadButton>
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
`;

// Header with Close Button
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

// Close Button
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

// Trip Information Section
const TripInfo = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 16px;
`;

// Loads Container
const LoadsContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
`;

// Load Card
const LoadCard = styled.div`
  background: #ecf0f1;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

// Load Title
const LoadTitle = styled.p`
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
`;

// Load Details
const LoadDetails = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  display: flex;
  flex-direction: column;
`;

// Message when no loads are available
const NoLoadsMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin: 10px 0;
`;

// Button Container
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

// Create Load Button
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

