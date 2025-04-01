import React, { useState } from "react";
import styled from "styled-components";

const CreateLoadModal = ({ tripId, onClose, onCreateLoad }) => {
  const [commodity, setCommodity] = useState("");
  const [weight, setWeight] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLoad = {
      commodity,
      weight,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      pickup_time: pickupTime,
      dropoff_time: dropoffTime,
    };

    // Pass new load data back to TripsPage
    onCreateLoad(tripId, newLoad);
    onClose(); // Close modal
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Create Load</h2>
        <form onSubmit={handleSubmit}>
          <Input placeholder="Commodity" value={commodity} onChange={(e) => setCommodity(e.target.value)} required />
          <Input placeholder="Weight (lbs)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          <Input placeholder="Pickup Location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required />
          <Input placeholder="Dropoff Location" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} required />
          <Input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required />
          <Input type="datetime-local" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} required />

          <SubmitButton type="submit">📦 Add Load</SubmitButton>
        </form>
        <CloseButton onClick={onClose}>❌ Close</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateLoadModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background: #27ae60;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background: #e74c3c;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;
