import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { createTripLog } from "../../api/endPoints";
import { reverseGeocode } from "../../utils/helpers";

const TripSimulator = ({ trip }) => {
  const dispatch = useDispatch();
  const apiKey = "5b3ce3597851110001cf62484b782d072ea84cf68385389ae56dcf32"; // Public demo key – replace with your own if rate limited

  useEffect(() => {
    if (!trip) return;

    const simulateTrip = async () => {
      try {
        // Coordinates should be in numeric format, not as strings
        const start = [parseFloat(trip.start_longitude), parseFloat(trip.start_latitude)];
        const end = [parseFloat(trip.destination_longitude), parseFloat(trip.destination_latitude)];

        // const start =[ 8.681495,49.41461];  // start coordinate 
        // const end =  [8.687872,49.420318];  // end coordinate 
       
        const res = await axios.post(
          `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,  
          {
            coordinates: [start, end],  // Coordinates as arrays of numbers
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`, // API key
              "Content-Type": "application/json",
              "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            },
          }
        );

        console.log("ORS Response:", res?.data);

        // Extract coordinates from the response
        const coords = res.data.features[0].geometry.coordinates;

        // Simulate trip logging based on coordinates
        for (let [lng, lat] of coords) {
          const location_name = await reverseGeocode(lat, lng);

          const log = {
            latitude: lat,
            longitude: lng,
            location_name,
            speed: Math.min(50 + Math.random() * 10).toFixed(2), 
            source: "simulated",
          };

          dispatch(createTripLog({ currentTripId: trip.id, tripLogData: log }));

          await new Promise((r) => setTimeout(r, 7000)); // wait 2 seconds
        }
      } catch (err) {
        console.error("Simulation error:", err);
      }
    };

    simulateTrip();
  }, [trip, dispatch]);

  return null; // this runs in the background
};

export default TripSimulator;
