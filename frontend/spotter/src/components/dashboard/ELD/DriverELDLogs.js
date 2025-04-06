import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchELDLogsByDriver, createELDLog } from "../../../api/endPoints";
import ELDLogsView from "./ELDLogsView";
import StatusToggle from "./StatusToggle";
import { reverseGeocode } from "../../../utils/helpers";

const DriverELDLogs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const logs = useSelector((state) => state.eldLogs?.eldLogs?.data ?? []);
    console.log("ELD LOGS", logs)
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState("Off-Duty");

    const [currentLocation, setCurrentLocation] = useState({
        latitude: null,
        longitude: null,
        location_name: "",
    });
    const [distanceCovered, setDistanceCovered] = useState(0);
    const [isFueling, setIsFueling] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [hosStats, setHosStats] = useState({
        totalLast7Days: 0,
        totalToday: 0,
        availableHoursTomorrow: 0,
        consecutiveOffDutyHours: 0,
        lastFuelingMiles: 0,
        totalMiles: 0,
      });
    const driver = {
        name: user?.first_name,
        coDriver: "None",
        truckNumber: "#1023",
        carrier: user?.carrier_data?.name,
        carrierAddress: user?.carrier_data?.address,
        totalMiles: 450,
    };

    // Get current geolocation and reverse geocode to get location name
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject("Geolocation not supported.");
            }

            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const location_name = await reverseGeocode(latitude, longitude); // Reverse geocode to get location name

                    const location = { latitude, longitude, location_name };
                    setCurrentLocation(location); // Update the state with new location
                    resolve(location); // Resolve with the location object
                } catch (error) {
                    reject("Reverse geocoding failed.");
                }
            }, (err) => {
                reject("Geolocation error: " + err.message);
            });
        });
    };



    useEffect(() => {
        dispatch(fetchELDLogsByDriver(user?.driver_profile_id));

        // Fetch geolocation and location name first
        getCurrentLocation()
            .then((location) => {
                console.log("Location fetched successfully:", location);
            })
            .catch((error) => {
                console.error("Error fetching location:", error);
            });
    }, [dispatch]);


    // Handle status change
    const handleStatusChange = async (status) => {
        setCurrentStatus(status);

        // Ensure location data is ready before dispatching
        if (currentLocation.latitude && currentLocation.location_name) {
            const logData = {
                driver: user.driver_profile_id,
                hos_status: status,
                timestamp: new Date().toISOString(),
                trip_id: null, // Set trip_id if applicable
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                location_name: currentLocation.location_name,
                distance_covered: distanceCovered,
                is_fueling: isFueling,
                remarks: remarks,
                manual_edit: false,
                malfunction_flag: false,
            };

            try {
                await dispatch(createELDLog(logData)); // ✅ now waits
                dispatch(fetchELDLogsByDriver(user?.driver_profile_id)); // ✅ fetch after successful post
              } catch (err) {
                console.error("Failed to create ELD log:", err);
              }
        } else {
            console.log("Location data is not ready yet. Status not logged.");
        }
    };

    // ✅ Update currentStatus when logs change
    useEffect(() => {
        if (logs?.length > 0) {
            const sortedLogs = [...logs].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
            const latestLog = sortedLogs[sortedLogs.length - 1];

            setCurrentStatus(latestLog.hos_status || "Off-Duty");
            setHosStats({
                totalLast7Days: parseFloat(latestLog.total_hours_past_8_days),
                totalToday: parseFloat(latestLog.total_hours_last_5_days),
                availableHoursTomorrow: parseFloat(latestLog.available_hours_tomorrow),
                consecutiveOffDutyHours: parseFloat(latestLog.consecutive_off_duty_hours),
                lastFuelingMiles: parseFloat(latestLog.distance_covered),
                totalMiles: parseFloat(latestLog.distance_covered), 
              });
        }
    }, [logs]);


    return (
        <div>
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
            />
        </div>
    );
};

export default DriverELDLogs;
