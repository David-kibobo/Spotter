import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchTripLogs, fetchTrips, fetchDrivers} from "../../../api/endPoints";


// Marker Icons
const startIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const currentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
  iconSize: [32, 32],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/841/841561.png",
  iconSize: [32, 32],
});


const MapPage = () => {
  const dispatch = useDispatch();

  const trips = useSelector((state) => state.trips?.trips ?? []);
  const tripLogs = useSelector((state) => state.tripLogs?.tripLogs ?? []);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [pathCoords, setPathCoords] = useState([]);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchTrips());
    dispatch(fetchDrivers());
  }, [dispatch]);

  // Fetch logs when trip is selected
  useEffect(() => {
    if (selectedTrip) {
      dispatch(fetchTripLogs(selectedTrip.id));
    }
  }, [dispatch, selectedTrip]);

  // Update path from Redux tripLogs
  useEffect(() => {
    if (!tripLogs || tripLogs.length === 0) {
      if (pathCoords.length !== 0) setPathCoords([]);
      return;
    }
  
    const coords = tripLogs.map((log) => [log.latitude, log.longitude]);
  
    const isSame =
      coords.length === pathCoords.length &&
      coords.every((coord, i) =>
        coord[0] === pathCoords[i]?.[0] && coord[1] === pathCoords[i]?.[1]
      );
  
    if (!isSame) {
      setPathCoords(coords);
    }
  }, [tripLogs]);
  
  const start = pathCoords[0];
  const current = pathCoords[pathCoords.length - 1];
  const destination =
    selectedTrip?.destination_latitude && selectedTrip?.destination_longitude
      ? [selectedTrip.destination_latitude, selectedTrip.destination_longitude]
      : null;

  return (
    <Container>
      <h2>📍 Map View</h2>

      <TripSelector>
        <label>Select Trip:</label>
        <select
          onChange={(e) => {
            const trip = trips.find((t) => t.id === e.target.value);
            setSelectedTrip(trip);
          }}
        >
          <option value="">-- Select Trip --</option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.driver_data?.user?.first_name || `Trip ${trip.id}`}
            </option>
          ))}
        </select>
      </TripSelector>

      {current && (
        <MapContainer
          center={current}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
            {/* Outer trail (glow effect) */}
<Polyline
  positions={pathCoords}
  pathOptions={{
    color: "#fff",       // white glow
    weight: 14,          // thicker than main line
    opacity: 0.9,
  }}
/>

{/* Main red path */}
<Polyline
  positions={pathCoords}
  pathOptions={{
    color: "#d32f2f",    
    weight: 6,
    opacity: 1,
  }}
/>

          


          {start && (
            <Marker position={start} icon={startIcon}>
              <Popup>Start Location</Popup>
            </Marker>
          )}

          <Marker position={current} icon={currentIcon}>
            <Popup>Current Position</Popup>
          </Marker>

          {destination && (
            <Marker position={destination} icon={destinationIcon}>
              <Popup>Destination</Popup>
            </Marker>
          )}

          {pathCoords.length > 1 && <Polyline positions={pathCoords} color="blue" />}
        </MapContainer>
      )}
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
