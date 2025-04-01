import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

// Sample marker positions (Replace with real API data later)
const drivers = [
  { id: 1, name: "Driver A", lat: 40.7128, lng: -74.006 },
  { id: 2, name: "Driver B", lat: 34.0522, lng: -118.2437 },
];

const MapComponent = () => {
  return (
    <MapWrapper>
      <MapContainer center={[37.7749, -95.7129]} zoom={4} scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Display markers for drivers */}
        {drivers.map((driver) => (
          <Marker key={driver.id} position={[driver.lat, driver.lng]}>
            <Popup>
              {driver.name} is here 🚛
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default MapComponent;

// Styled Component for Map
const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;
