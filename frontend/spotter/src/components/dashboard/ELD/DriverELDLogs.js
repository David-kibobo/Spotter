
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
import ELDLogsView from "./DriverELDLogsView";
import StatusToggle from "./StatusToggle";
import StatusUpdateModal from "./StatusUpdateModal";
import { reverseGeocode } from "../../../utils/helpers";
import styled from "styled-components";
import useTripLogger from "../../../hooks/useTripLogger";
import DriversTripList from "./DriversTripList";
import TripSimulator from "../../simulation/TripSimulator";
import { toast } from "react-toastify";

const DriverELDLogs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const logs = useSelector((state) => state.eldLogs?.driverEldLogs?.data ?? []);
  const trips = useSelector((state) => state.trips?.trips ?? []);
  const hosStats = useSelector((state) => state.drivers?.hosStats ?? {});

  const activeTrips = trips?.filter(
    (trip) => trip.status === "scheduled" || trip.status === "in_progress"
  );

  const currentTrip = trips?.find((trip) => trip.status === "in_progress");
  const currentTripId = currentTrip?.id;
  const isActiveTrip = currentTrip?.status === "in_progress";

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("off_duty");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [latestMiles, setLatestMiles] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

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

  const locationFetched = useRef(false);

  const driver = {
    driverId: user?.driver_profile_id,
    name: user?.first_name,
    coDriver: "None",
    truckNumber: "#1023",
    carrier: user?.carrier_data?.name,
    carrierAddress: user?.carrier_data?.address,
    totalMiles: latestMiles,
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject("Geolocation not supported.");
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const location_name = await reverseGeocode(latitude, longitude);

            const location = { latitude, longitude, location_name };
            setCurrentLocation(location);
            resolve(location);
          } catch (error) {
            reject("Reverse geocoding failed.");
          }
        },
        (err) => {
          reject("Geolocation error: " + err.message);
        }
      );
    });
  };

  useEffect(() => {
    dispatch(fetchELDLogsByDriver(user?.driver_profile_id));
    dispatch(fetchDriverTrips(user?.driver_profile_id));

    if (!locationFetched.current) {
      getCurrentLocation().catch(() => {});
      locationFetched.current = true;
    }
  }, [dispatch]);

  const handleStatusChange = (status) => {
    if (status !== "off_duty" && !isActiveTrip) {
      alert("You can't change to this status without an active trip.");
      return;
    }

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

      if (!latitude || !longitude) {
        try {
          const location = await getCurrentLocation();
          latitude = location.latitude;
          longitude = location.longitude;
          location_name = location.location_name;
        } catch {
          const proceed = window.confirm("Submit log without location?");
          if (!proceed) return;
        }
      }

      const payload = {
        driver: user?.driver_profile_id,
        trip: currentTripId,
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
      await dispatch(fetchELDLogsByDriver({ driverId: user?.driver_profile_id }));
      await dispatch(fetchDriverHosStats({ driverId: user?.driver_profile_id }));

      if (currentTripId) {
        await dispatch(createTripLog({ currentTripId, tripLogData }));
      }

      setStatusModalOpen(false);
    } catch (err) {
      console.error("Failed to create ELD log or Trip log:", err);
    }
  };

//  Updating current log status
  useEffect(() => {
    
    if (logs.length > 0) {
      const sortedLogs = [...logs].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      const latestLog = sortedLogs[sortedLogs.length - 1];
      setCurrentStatus(latestLog.hos_status || "off_duty");
    }
  }, [logs]);

  return (
    <Container>
      {/* This will log location if enabled */}
      {/* {currentTrip && <TripSimulator trip={currentTrip} />} */}

      <DriversTripList trips={activeTrips} />

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
