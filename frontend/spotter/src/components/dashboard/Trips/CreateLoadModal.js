import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { createLoad, fetchLoads } from "../../../api/endPoints"; 
import { roundTo6 } from "../../../utils/helpers";

const CreateLoadModal = ({ tripId, onClose, onCreateLoad }) => {
  const dispatch = useDispatch();
  useEffect(()=>{dispatch(fetchLoads())}, [dispatch])
  // Custom Pin Icon
  const pinIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [loadData, setLoadData] = useState({
    description: "",
    commodity: "",
    shipper: "",
    weight: null,
    pickup_location: "",
    pickup_latitude: null,
    pickup_longitude: null,
    delivery_location: "",
    delivery_latitude: null,
    delivery_longitude: null,
    pickup_time: "",
    delivery_time: null,
    status: "pending",
  });

  const [showMap, setShowMap] = useState(false);
  const [locationType, setLocationType] = useState(null); // "pickup" or "dropoff"

  const handleInputChange = (e) => {
    setLoadData({ ...loadData, [e.target.name]: e.target.value });
  };

  const handleMapClick = async (e) => {
    if (locationType) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        const locationName = data.display_name || "Unknown Location";

        setLoadData((prev) => ({
          ...prev,
          [`${locationType}_latitude`]: roundTo6(lat),
          [`${locationType}_longitude`]: roundTo6(lng),
          [`${locationType}_location`]: locationName,
        }));
      } catch (error) {
        console.error("Error fetching location name:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   
    const result = await dispatch(createLoad({ loadData, tripId }));

    if (createLoad.fulfilled.match(result)) {
    
      alert("Trip created successfully!");
      onClose(); 
    } else {
   
      alert(result.payload || "Failed to create trip.");
    }
  };
  

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <h2>➕ Create Load</h2>
          <CloseButton onClick={onClose}>✖</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Description */}
          <Label>📝 Description</Label>
          <InputRow>
            <Input
              name="description"
              value={loadData.description}
              onChange={handleInputChange}
              placeholder="Enter load description"
            />
          </InputRow>


          {/* Commodity */}
          <Label>📦 Commodity</Label>
          <InputRow>
            <Input
              name="commodity"
              value={loadData.commodity}
              onChange={handleInputChange}
              placeholder="Enter commodity"
            />

          </InputRow>

          {/* Shipper */}
          <Label>🚚 Shipper</Label>
          <InputRow>
            <Input
              name="shipper"
              value={loadData.shipper}
              onChange={handleInputChange}
              placeholder="Enter shipper name"
            />
          </InputRow>



          {/* Pickup Location */}
          <Label>📍 Pickup Location</Label>
          <InputRow>
            <Input
              name="pickup_location"
              value={loadData.pickup_location}
              onChange={handleInputChange}
              placeholder="Enter pickup location..."
            />
            <Button
            type="button"
              onClick={() => {
                setLocationType("pickup");
                setShowMap(true);
              }}
            >
              📍 Pick on Map
            </Button>
          </InputRow>
          <InputRow>
            <Input name="pickup_latitude" value={loadData.pickup_latitude} placeholder="Latitude" readOnly />
            <Input name="pickup_longitude" value={loadData.pickup_longitude} placeholder="Longitude" readOnly />
          </InputRow>

          {/* Delivery Location */}
          <Label>📍 Delivery Location</Label>
          <InputRow>
            <Input
              name="delivery_location"
              value={loadData.delivery_location}
              onChange={handleInputChange}
              placeholder="Enter delivery location..."
            />
            <Button
            type="button"
              onClick={() => {
                setLocationType("delivery");
                setShowMap(true);
              }}
            >
              📍 Pick on Map
            </Button>
          </InputRow>
          <InputRow>
            <Input name="delivery_latitude" value={loadData.delivery_latitude} placeholder="Latitude" readOnly />
            <Input name="delivery_longitude" value={loadData.delivery_longitude} placeholder="Longitude" readOnly />
          </InputRow>

          {/* Weight */}
          <InputRow>
            <Label>⚖️ Weight (tons)</Label>
            <Input
              name="weight"
              type="number"
              value={loadData.weight || ''} // Ensure value is either a number or empty string
              onChange={handleInputChange}
              placeholder="Enter weight in tons"
              step="0.01" // Allow decimal points
            />
          </InputRow>



          {/* Pickup Time */}
          <InputRow>
            <Label>⏰ Pickup Time</Label>
            <Input
              name="pickup_time"
              type="datetime-local"
              value={loadData.pickup_time}
              onChange={handleInputChange}
            />
          </InputRow>

          {/* Delivery Time */}

          <InputRow>

            <Label>⏳ Delivery Time</Label>
            <Input
              name="delivery_time"
              type="datetime-local"
              value={loadData.delivery_time}
              onChange={handleInputChange}
            />
          </InputRow>
          {/* Status */}
          <Label>📌 Load Status</Label>
          <Select name="status" value={loadData.status} onChange={handleInputChange}>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </Select>

          {/* Submit Button */}
          <SubmitButton type="submit"> ✅ Create Load</SubmitButton>
        </Form>

        {/* Map Modal */}
        {showMap && (
          <MapOverlay>
            <MapContainer
              center={[37.7749, -122.4194]}
              zoom={4}
              style={{ height: "400px", width: "600px", borderRadius: "8px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onClick={handleMapClick} />
              {/* Pin marker */}
              {loadData.pickup_latitude && loadData.pickup_longitude && (
                <Marker position={[loadData.pickup_latitude, loadData.pickup_longitude]} icon={pinIcon} />
              )}
              {loadData.delivery_latitude && loadData.delivery_longitude && (
                <Marker position={[loadData.delivery_latitude, loadData.delivery_longitude]} icon={pinIcon} />
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

export default CreateLoadModal;

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

const Form = styled.form`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-top: 10px;
  display: block;
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
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
