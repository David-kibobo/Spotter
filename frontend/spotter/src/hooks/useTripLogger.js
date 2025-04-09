import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createTripLog } from "../api/endPoints";
import { reverseGeocode } from "../utils/helpers";

const useTripLogger = (currentTripId, isActiveTrip) => {
  const dispatch = useDispatch();
  const [lastLocation, setLastLocation] = useState(null); // Store last known location

  useEffect(() => {
    if (!isActiveTrip || !currentTripId) return;

    const logLocation = async (latitude, longitude, speed) => {
      try {
  
        if (
          lastLocation &&
          Math.abs(lastLocation.latitude - latitude) < 0.0001 && // Rough distance threshold
          Math.abs(lastLocation.longitude - longitude) < 0.0001
        ) {
          return; // Skip logging if location hasn't changed significantly
        }

        const locationName = await reverseGeocode(latitude, longitude);
        console.log("Location_name", locationName)
        const tripLogData = {
          latitude:latitude,
          longitude:longitude,
          location_name: locationName,
          speed: speed || null, // Include speed if available
          source: "map_api",
        };
        // console.log("Latitude:", logData)

        dispatch(createTripLog({ currentTripId, tripLogData }));
        setLastLocation({ latitude, longitude }); // Update last known location
      } catch (error) {
        console.error("Error while logging trip location:", error);
      }
    };

    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, speed } = position.coords;
          
            logLocation(latitude, longitude, speed); // Pass speed to logLocation
          },
          (error) => {
            console.error("Geolocation error:", error.message);
          }
        );
      } else {
        console.error("Geolocation not supported in this browser.");
      }
    }, 10 * 60* 1000); // every 10 minutes

    return () => clearInterval(interval); // Cleanup on component unmount or dependency change
  }, [currentTripId, isActiveTrip, dispatch, lastLocation]); // Trigger useEffect when tripId or isActiveTrip changes
};

export default useTripLogger;
