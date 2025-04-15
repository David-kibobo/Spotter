import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { createTripLog } from "../../api/endPoints";
import { reverseGeocode } from "../../utils/helpers";

const TripSimulator = ({ trip, simulationActive }) => {
  const dispatch = useDispatch();
  const apiKey = "5b3ce3597851110001cf62484b782d072ea84cf68385389ae56dcf32"; // Demo key
  const shouldContinue = useRef(true); // controls simulation loop

  useEffect(() => {
    shouldContinue.current = true;

    if (!trip || !simulationActive) return;

    const {
      id,
      start_latitude,
      start_longitude,
      destination_latitude,
      destination_longitude,
    } = trip;

    const allCoordsPresent =
      start_latitude !== undefined &&
      start_longitude !== undefined &&
      destination_latitude !== undefined &&
      destination_longitude !== undefined;

    if (!allCoordsPresent) {
      console.warn("Trip simulation skipped: Missing coordinates.");
      return;
    }

    const startLat = parseFloat(start_latitude);
    const startLng = parseFloat(start_longitude);
    const endLat = parseFloat(destination_latitude);
    const endLng = parseFloat(destination_longitude);

    if (
      isNaN(startLat) || isNaN(startLng) ||
      isNaN(endLat) || isNaN(endLng)
    ) {
      console.warn("Trip simulation skipped: Invalid coordinates.");
      return;
    }

    const simulateTrip = async () => {
      try {
        const start = [startLng, startLat];
        const end = [endLng, endLat];

        const res = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            coordinates: [start, end],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              Accept:
                "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            },
          }
        );

        const coords = res.data?.features?.[0]?.geometry?.coordinates;

        if (!coords || coords.length === 0) {
          console.warn("No route coordinates received from ORS.");
          return;
        }

        for (let [lng, lat] of coords) {
          if (!shouldContinue.current) {
            console.log("Simulation stopped.");
            break;
          }

          const location_name = await reverseGeocode(lat, lng);

          const log = {
            latitude: lat,
            longitude: lng,
            location_name,
            speed: Math.min(50 + Math.random() * 10).toFixed(2),
            source: "simulated",
          };

          dispatch(createTripLog({ currentTripId: id, tripLogData: log }));

          await new Promise((r) => setTimeout(r, 7000));
        }
      } catch (err) {
        console.error("Simulation error:", err);
      }
    };

    simulateTrip();

    return () => {
      shouldContinue.current = false; // Stop simulation on unmount or prop change
    };
  }, [trip, simulationActive, dispatch]);

  return null;
};

export default TripSimulator;

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import axios from "axios";

// import { createTripLog } from "../../api/endPoints";
// import { reverseGeocode } from "../../utils/helpers";

// const TripSimulator = ({ trip }) => {
//   const dispatch = useDispatch();
//   const apiKey = "5b3ce3597851110001cf62484b782d072ea84cf68385389ae56dcf32"; // Demo key

//   useEffect(() => {
//     if (!trip) return;

//     const {
//       id,
//       start_latitude,
//       start_longitude,
//       destination_latitude,
//       destination_longitude,
//     } = trip;

//     // Validate coordinates
//     const allCoordsPresent =
//       start_latitude !== undefined &&
//       start_longitude !== undefined &&
//       destination_latitude !== undefined &&
//       destination_longitude !== undefined;

//     if (!allCoordsPresent) {
//       console.warn("Trip simulation skipped: Missing coordinates.");
//       return;
//     }

//     const startLat = parseFloat(start_latitude);
//     const startLng = parseFloat(start_longitude);
//     const endLat = parseFloat(destination_latitude);
//     const endLng = parseFloat(destination_longitude);

//     // Prevent simulation if coordinates are not valid numbers
//     if (
//       isNaN(startLat) || isNaN(startLng) ||
//       isNaN(endLat) || isNaN(endLng)
//     ) {
//       console.warn("Trip simulation skipped: Invalid coordinates.");
//       return;
//     }

//     const simulateTrip = async () => {
//       try {
//         const start = [startLng, startLat];
//         const end = [endLng, endLat];

//         // Fetch route coordinates from OpenRouteService API
//         const res = await axios.post(
//           "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
//           {
//             coordinates: [start, end],
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${apiKey}`,
//               "Content-Type": "application/json",
//               Accept:
//                 "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
//             },
//           }
//         );

//         const coords = res.data?.features?.[0]?.geometry?.coordinates;

//         if (!coords || coords.length === 0) {
//           console.warn("No route coordinates received from ORS.");
//           return;
//         }

//         // Use Promise.all to handle reverse geocoding in parallel for all coordinates
//         // const locationPromises = coords.map(([lng, lat]) => reverseGeocode(lat, lng));
//         const locationNames = [];
//         for (let [lng, lat] of coords) {
//           const name = await reverseGeocode(lat, lng);
//           locationNames.push(name);
//           await new Promise(r => setTimeout(r, 300)); // add small delay
//         }
        

//         // Prepare logs in a batch
//         const logs = coords.map((coord, index) => {
//           const [lng, lat] = coord;
//           const location_name = locationNames[index];
//           return {
//             latitude: lat,
//             longitude: lng,
//             location_name,
//             speed: Math.min(50 + Math.random() * 10).toFixed(2),
//             source: "simulated",
//           };
//         });

//         // Dispatch all logs in batch
//         dispatch(createTripLog({ currentTripId: id, tripLogData: logs }));

//         // Optional: Reduce delay to 1 second between logs or remove it entirely
//         // await new Promise((r) => setTimeout(r, 1000)); // Optional delay (1 second) or set to 0 for no delay

//       } catch (err) {
//         console.error("Simulation error:", err);
//       }
//     };

//     simulateTrip();
//   }, [trip, dispatch]);

//   return null; // Background component, renders nothing
// };

// export default TripSimulator;
