import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchTripLogs } from "../../../api/endPoints";

// Icons
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

const defaultIcon = new L.Icon.Default();

const MapView = ({ selectedTrip = null, trips = [], tripLogsAll = {} }) => {
  const dispatch = useDispatch();
  const tripLogs = useSelector((state) => state.tripLogs?.tripLogs ?? []);
  const [pathCoords, setPathCoords] = useState([]);

  // Fetch logs if selectedTrip exists
  useEffect(() => {
    if (selectedTrip?.id) {
      dispatch(fetchTripLogs(selectedTrip.id));
      
    }
  }, [dispatch, selectedTrip]);

  // Update pathCoords if trip is selected
  useEffect(() => {
    if (selectedTrip && tripLogs?.length > 0) {
      const coords = tripLogs.map((log) => [log.latitude, log.longitude]);
      setPathCoords(coords);
    } else {
      setPathCoords([]);
    }
  }, [tripLogs, selectedTrip]);
  console.log("Selected tRIP", pathCoords && pathCoords);
//   Grouping triplogs by tri_id.
  const groupedLogs = tripLogs.reduce((acc, log) => {
    const tripId = log.trip;
    if (!acc[tripId]) acc[tripId] = [];
    acc[tripId].push(log);
    return acc;
  }, {});
  
  const center = selectedTrip && pathCoords.length
    ? pathCoords[pathCoords.length - 1]
    : [37.7749, -95.7129]; // fallback center

  return (
    <MapWrapper>
      <MapContainer center={center} zoom={1} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🟡 Single Trip Mode */}
        {selectedTrip && pathCoords.length > 0 && (
           
          <>
            {/* Glow */}
            <Polyline positions={pathCoords} pathOptions={{ color: "#fff", weight: 14, opacity: 0.9 }} />
            {/* Main Path */}
            <Polyline positions={pathCoords} pathOptions={{ color: "#d32f2f", weight: 6 }} />

            <Marker position={pathCoords[0]} icon={startIcon}>
              <Popup>Start</Popup>
            </Marker>

            <Marker position={pathCoords[pathCoords.length - 1]} icon={currentIcon}>
              <Popup>Current</Popup>
            </Marker>

            {selectedTrip.destination_latitude && selectedTrip.destination_longitude && (
              <Marker
                position={[selectedTrip.destination_latitude, selectedTrip.destination_longitude]}
                icon={destinationIcon}
              >
                <Popup>Destination</Popup>
              </Marker>
            )}
          </>
        )}

        {/* 🔵 Multi Trip Mode (paths + markers) */}

        {!selectedTrip && trips.length > 0 && Object.keys(groupedLogs).length > 0 && (
          <>
            {trips.map((trip) => {
              const logs = groupedLogs[trip.id];
              if (!logs || logs.length < 1) return null;

              const coords = logs.map((log) => [log.latitude, log.longitude]);
              const start = coords[0];
              const current = coords[coords.length - 1];
              const destination =
                trip.destination_latitude && trip.destination_longitude
                  ? [trip.destination_latitude, trip.destination_longitude]
                  : null;
              const driverName = trip.driver_data?.user?.first_name || `Trip ${trip.id}`;

              return (
                <React.Fragment key={trip.id}>
                  {/* Trail */}
                  <Polyline
                    positions={coords}
                    pathOptions={{ color: "#2e7d32", weight: 5, opacity: 0.8 }}
                  />

                  {/* Start */}
                  <Marker position={start} icon={startIcon}>
                    <Popup>{driverName} - Start</Popup>
                  </Marker>

                  {/* Current */}
                  <Marker position={current} icon={currentIcon}>
                    <Popup>{driverName} - Current</Popup>
                  </Marker>

                  {/* Destination */}
                  {destination && (
                    <Marker position={destination} icon={destinationIcon}>
                      <Popup>{driverName} - Destination</Popup>
                    </Marker>
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </MapContainer>
    </MapWrapper>
  );
};

export default MapView;

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
