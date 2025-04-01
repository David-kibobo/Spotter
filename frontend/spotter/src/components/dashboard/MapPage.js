import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import styled from "styled-components";

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: "/icons/start-marker.png",
  iconSize: [32, 32],
});

const currentIcon = new L.Icon({
  iconUrl: "/icons/current-marker.png",
  iconSize: [32, 32],
});

const destinationIcon = new L.Icon({
  iconUrl: "/icons/destination-marker.png",
  iconSize: [32, 32],
});

// Mock trip data
const trips = [
  {
    id: 1,
    driver: "John Doe",
    start: [40.7128, -74.006], // New York
    current: [41.2033, -77.1945], // Pennsylvania
    destination: [42.3601, -71.0589], // Boston
    path: [
      [40.7128, -74.006], 
      [40.73061, -73.935242], 
      [41.2033, -77.1945], 
      [42.3601, -71.0589]
    ],
  },
  {
    id: 2,
    driver: "Sarah Lee",
    start: [34.0522, -118.2437], // Los Angeles
    current: [36.7783, -119.4179], // Fresno
    destination: [37.7749, -122.4194], // San Francisco
    path: [
      [34.0522, -118.2437], 
      [34.95, -118.45], 
      [36.7783, -119.4179], 
      [37.7749, -122.4194]
    ],
  },
];

const MapPage = () => {
  const [selectedTrip, setSelectedTrip] = useState(trips[0]);

  return (
    <Container>
      <h2>📍 Map View</h2>
      <TripSelector>
        <label>Select Trip:</label>
        <select onChange={(e) => setSelectedTrip(trips.find(t => t.id === Number(e.target.value)))}>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.driver}'s Trip
            </option>
          ))}
        </select>
      </TripSelector>

      <MapContainer center={selectedTrip.current} zoom={6} scrollWheelZoom={true} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Start Marker */}
        <Marker position={selectedTrip.start} icon={startIcon}>
          <Popup>Start: {selectedTrip.driver}</Popup>
        </Marker>

        {/* Current Position Marker */}
        <Marker position={selectedTrip.current} icon={currentIcon}>
          <Popup>Current Location</Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={selectedTrip.destination} icon={destinationIcon}>
          <Popup>Destination</Popup>
        </Marker>

        {/* Path Polyline */}
        <Polyline positions={selectedTrip.path} color="blue" />
      </MapContainer>
    </Container>
  );
};

export default MapPage;

const Container = styled.div`
  padding: 20px;
`;

const TripSelector = styled.div`
  margin-bottom: 10px;
  label {
    font-weight: bold;
    margin-right: 10px;
  }
  select {
    padding: 5px;
  }
`;
