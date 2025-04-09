import React, { useState } from "react";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { createTrip } from "../../../api/endPoints";
import CreateLoadModal from "./CreateLoadModal";
import { useDispatch } from "react-redux";

import { roundTo6 } from "../../../utils/helpers";
// Custom Pin Icon
const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


const CreateTripModal = ({ onClose, drivers, trucks }) => {
  const dispatch=useDispatch();
  const [tripData, setTripData] = useState({
    truck: "",
    driver: "",
    start_location: "",
    start_latitude: null,
    start_longitude: null,
    destination_location: "",
    destination_latitude: null,
    destination_longitude: null,
    estimated_distance: "",
    start_time: "",
    end_time: null,
    status: "scheduled",
  });
  const [showLoadModal, setShowLoadModal] = useState(false);

  const [loadData, setLoadData] = useState(null);

  const [locationType, setLocationType] = useState(null); // "start" or "destination"
  const [showMap, setShowMap] = useState(false); // Control map visibility

  // Handle form input changes
  const handleInputChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };


  // Handle location selection from map
  const handleMapClick = async (e) => {
    if (locationType) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      try {
        // Fetch address from OpenStreetMap's Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();

        // Extract the location name (display_name)
        const locationName = data.display_name || "Unknown Location";

        // Update the state with the new values
        setTripData((prev) => ({
          ...prev,
          [`${locationType}_latitude`]: roundTo6(lat),
          [`${locationType}_longitude`]:roundTo6(lng),
          [`${locationType}_location`]: locationName, // Autofill the input field
        }));
      } catch (error) {
        console.error("Error fetching location name:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const result = await dispatch(createTrip(tripData));
  
    if (createTrip.fulfilled.match(result)) {
      alert("Trip created successfully!");
      onClose(); // Close the modal after successful creation
    } else {
      // Either show payload (error from rejectWithValue) or fallback error
      alert(result.payload || "Failed to create trip.");
    }
  };
  
  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <h2>➕ Create Trip</h2>
          <CloseButton onClick={onClose}>✖</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Truck Selection */}
          <Label>🚛 Select Truck</Label>
          <Select name="truck" value={tripData.truck} onChange={handleInputChange}>
            <option value="">-- Choose Truck --</option>
            {trucks?.map((truck) => (
              <option key={truck.id} value={truck.id}>
                {truck.number} - {truck.model}
              </option>
            ))}
          </Select>

          {/* Driver Selection */}
          <Label>👤 Select Driver</Label>
          <Select name="driver" value={tripData.driver} onChange={handleInputChange}>
            <option value="">-- Choose Driver --</option>
            {drivers?.map((driver) => (
              <option key={driver.user.id} value={driver.id}>
                {driver.user.first_name}
              </option>
            ))}
          </Select>

          {/* Start Location */}
          <Label>📍 Start Location</Label>
          <InputRow>
            <Input name="start_location" value={tripData.start_location || " "} onChange={handleInputChange} placeholder="Enter start location..." />
            <Button type="button" onClick={() => { setLocationType("start"); setShowMap(true); }}>📍 Pick on Map</Button>
          </InputRow>
          <InputRow>
            <Input name="start_latitude" value={tripData.start_latitude || ""} placeholder="Latitude" readOnly />
            <Input name="start_longitude" value={tripData.start_longitude || ""} placeholder="Longitude" readOnly />
          </InputRow>

          {/* Destination */}
          <Label>📍 Destination</Label>
          <InputRow>
            <Input name="destination_location" value={tripData.destination_location} onChange={handleInputChange} placeholder="Enter destination..." />
            <Button type="button" onClick={() => { setLocationType("destination"); setShowMap(true); }}>📍 Pick on Map</Button>
          </InputRow>
          <InputRow>
            <Input name="destination_latitude" value={tripData.destination_latitude || ""} placeholder="Latitude" readOnly />
            <Input name="destination_longitude" value={tripData.destination_longitude || ""} placeholder="Longitude" readOnly />
          </InputRow>

          {/* Estimated Distance */}

          <InputRow>
            <Label>📏 Estimated Distance (miles)</Label>
            <Input name="estimated_distance" type="number" value={tripData.estimated_distance} onChange={handleInputChange} />

          </InputRow>

          {/* Start & End Time */}
          <InputRow>
            <Label>⏰ Start Time</Label>
            <Input name="start_time" type="datetime-local" value={tripData.start_time} onChange={handleInputChange} />

          </InputRow>
          <InputRow>
            <Label>⏳ End Time (optional)</Label>
            <Input name="end_time" type="datetime-local" value={tripData.end_time} onChange={handleInputChange} />

          </InputRow>

          {/* Create Load Button
         <ButtonInputRow>
         <CreateLoadButton onClick={() => setShowLoadModal(true)}>➕ Add Load</CreateLoadButton>
                  </ButtonInputRow>
         */}

          {/* Status */}

          <Label>📌 Trip Status</Label>
          <Select name="status" value={tripData.status} onChange={handleInputChange}>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">Ongoing</option>
            <option value="completed">Completed</option>
          </Select>



          {/* Submit Button */}
          <SubmitButton type="submit" > ✅ Create Trip</SubmitButton>
        </Form>

        {/* Load Modal
         {showLoadModal && <CreateLoadModal tripId="TEMP_TRIP_ID" onClose={() => setShowLoadModal(false)} onCreateLoad={handleCreateLoad} />} */}

        {/* Map Modal */}
        {showMap && (
          <MapOverlay>
            <MapContainer center={[37.7749, -122.4194]} zoom={4} style={{ height: "400px", width: "600px", borderRadius: "8px" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onClick={handleMapClick} />
              {/* Pin marker */}
              {tripData.start_latitude && tripData.start_longitude && (
                <Marker position={[tripData.start_latitude, tripData.start_longitude]} icon={pinIcon} />
              )}
              {tripData.destination_latitude && tripData.destination_longitude && (
                <Marker position={[tripData.destination_latitude, tripData.destination_longitude]} icon={pinIcon} />
              )}
            </MapContainer>
            <CloseMapButton onClick={() => setShowMap(false)}>✖ Close Map</CloseMapButton>
          </MapOverlay>
        )}

      </ModalContainer>
    </Overlay>
  );
};

const LocationMarker = ({ onClick }) => {
  useMapEvents({
    click: (e) => onClick(e),
  });
  return null;
};

export default CreateTripModal;

// Styled Components
const Overlay = styled.div`
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

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;
const CreateLoadButton = styled.button`
  background: #27ae60;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 15px;  /* Added spacing below */
`;

const Form = styled.form`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-top: 10px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
`;
const ButtonInputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
  justify-content: center; 
`;


const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  background: #2ecc71;
  margin-top: 15px;
`;

const MapOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 15px;
  border-radius: 8px;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseMapButton = styled(Button)`
  background: red;
  margin-top: 10px;
`;
