import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchELDLogsByDriver,
  createELDLog,
  fetchDriverTrips,
  updateTrip,
  createTripLog,
  fetchDriverHosStats,
} from "../../../api/endPoints";
import ELDLogsView from "./ELDLogsView";
import StatusToggle from "./StatusToggle";
import StatusUpdateModal from "./StatusUpdateModal";
import { reverseGeocode } from "../../../utils/helpers";
import styled from "styled-components";
import useTripLogger from "../../../hooks/useTripLogger";
import TripList from "./DriversTripList";
import TripSimulator from "../../simulation/TripSimulator";

const DriverELDLogs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const logs = useSelector((state) => state.eldLogs?.eldLogs?.data ?? []);
  const trips = useSelector((state) => state.trips?.trips??[]);
  const hosStats = useSelector((state) => state.drivers?.hosStats ?? {});

  const activeTrips = trips?.filter(
    (trip) => trip.status === "scheduled" || trip.status === "in_progress"
  );

 
const currentTrip = trips?.find((trip) => trip.status === "in_progress");
const currentTripId = currentTrip?.id;
const isActiveTrip = currentTrip?.status === "in_progress";

// This hook will help log live locations using GPS when we have active trip
// useTripLogger(currentTripId, isActiveTrip);


  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("off_duty");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
   const [latestMiles, setLatestMiles] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: "",
    longitude: "",
    location_name: "",
  });

  const [formData, setFormData] = useState({
    distance_covered: "",
    remarks: "",
    latitude: "",
    longitude: "",
    is_fueling: false,
  });

  

 

  const locationFetched = useRef(false); // Prevent repeated setting

  const driver = {
    driverId:user?.driver_profile_id,
    name: user?.first_name,
    coDriver: "None",
    truckNumber: "#1023",
    carrier: user?.carrier_data?.name,
    carrierAddress: user?.carrier_data?.address,
    totalMiles: latestMiles,
  };

  // Geolocation function
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            console.error("Geolocation not supported in this browser.");
            return reject("Geolocation not supported.");
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(`Location fetched: Latitude = ${latitude}, Longitude = ${longitude}`);

                const location_name = await reverseGeocode(latitude, longitude);
                console.log("Location name fetched: ", location_name);

                const location = { latitude, longitude, location_name };
                setCurrentLocation(location); // Update the state with new location
                resolve(location); // Resolve with the location object
            } catch (error) {
                console.error("Error during reverse geocoding: ", error);
                reject("Reverse geocoding failed.");
            }
        }, (err) => {
            console.error("Geolocation error: ", err.message);
            reject("Geolocation error: " + err.message);
        });
    });
};

  useEffect(() => {
    dispatch(fetchELDLogsByDriver(user?.driver_profile_id));
    dispatch(fetchDriverTrips(user?.driver_profile_id));

    if (!locationFetched.current) {
      getCurrentLocation()
        .then((loc) => {
        //   setCurrentLocation(loc);
          locationFetched.current = true;
        })
        .catch((error) => console.error("Error fetching location:", error));
    }
  }, [dispatch]);

  const handleStatusChange = (status) => {
    const disAllowedStatusChange = (status !== "off_duty" && !isActiveTrip);

    if (disAllowedStatusChange ) {
  
    alert("You can't change to this status without an active trip.");
    return; // Prevent status change if no active trip exists
  }
    setCurrentStatus(status);
    setPendingStatus(status);
    setStatusModalOpen(true);
    setFormData({
      distance_covered: "",
      remarks: "",
      latitude: "",
      longitude: "",
      is_fueling: false,
    });
  };

  const handleLogCreation = async () => {
    try {
      let latitude = formData.latitude || currentLocation.latitude;
      let longitude = formData.longitude || currentLocation.longitude;
      let location_name = currentLocation.location_name;
      
      // Try to fetch geolocation if not already present
      if (!latitude || !longitude) {
        try {
          const location = await getCurrentLocation();
          latitude = location.latitude;
          longitude = location.longitude;
          location_name = location.location_name;
          setCurrentLocation(location);
        } catch (geoError) {
          console.warn("Geolocation failed:", geoError);
          alert("We couldn't fetch your location. Please enable location access in your browser settings or enter location manually.");
        }
      }

      // Still no coords? Let user manually fill them or cancel
      if (!latitude || !longitude) {
        const proceed = window.confirm("Location coordinates are empty. Submit the log without location?");
        if (!proceed) return;
      }

      const payload = {
        driver: user?.driver_profile_id,
        trip:currentTripId,
        hos_status: pendingStatus,
        ...formData,
        latitude,
        longitude,
      };

      const tripLogData = {
        latitude,
        longitude,
        location_name,
        source: "manual",
        timestamp: new Date().toISOString(),
      };

      await dispatch(createELDLog(payload));
      dispatch(fetchELDLogsByDriver(user?.driver_profile_id));
      dispatch(fetchDriverHosStats(user?.driver_profile_id));

      if (currentTripId) {
        await dispatch(createTripLog({ currentTripId, tripLogData }));
      }

      setStatusModalOpen(false);
    } catch (err) {
      console.error("Failed to create ELD log or Trip log:", err);
    }
  };

  useEffect(() => {
    if (logs?.length > 0) {
      const sortedLogs = [...logs].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      const latestLog = sortedLogs[sortedLogs.length - 1];

      setCurrentStatus(latestLog.hos_status || "off_duty");
      setLatestMiles(latestLog.distance_covered || 0);
    
    }
  }, [logs]);

  return (
    <Container>
 {currentTrip && <TripSimulator trip={currentTrip} />}
      <TripList trips={activeTrips}  />

      <StatusToggle
        onStatusChange={handleStatusChange}
        activeStatus={currentStatus}
        hosStats={hosStats}
      />
     
      <ELDLogsView
        driver={driver}
        logs={logs}
        currentStatus={currentStatus}
        setIsPrintModalOpen={setIsPrintModalOpen}
        isPrintModalOpen={isPrintModalOpen}
        hosStats={hosStats}
        trips={trips}
      />

      <StatusUpdateModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onSubmit={handleLogCreation}
        status={pendingStatus}
        formData={formData}
        setFormData={setFormData}
        currentLocation={currentLocation}
      />
    </Container>
  );
};

export default DriverELDLogs;

const Container = styled.div`
  padding: 16px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
