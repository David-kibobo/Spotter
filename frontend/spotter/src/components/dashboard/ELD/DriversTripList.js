import React, { useState } from "react";
import styled from "styled-components";
import { updateTrip } from "../../../api/endPoints";
import { useDispatch } from "react-redux";
import TripDetailsModal from "../Trips/TripDetailsModal";
import { formatDateTime, statusMap } from "../../../utils/helpers";
import TripSimulator from "../../simulation/TripSimulator";

const DriversTripList = ({ trips }) => {
  const dispatch = useDispatch();

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [simulatedTrip, setSimulatedTrip] = useState(null); 
 
  const [isSimulating, setIsSimulating] = useState(false); 
  const [simulationActive, setSimulationActive] = useState(false);

  const handleStart = () => setSimulationActive(true);
  const handleStop = () => setSimulationActive(false);

  const handleStartTrip = (tripId) => {
    dispatch(updateTrip({ id: tripId, tripData: { status: "in_progress" } }));
  };

  const handleEndTrip = (tripId) => {
    dispatch(updateTrip({ id: tripId, tripData: { status: "completed" } }));
  };

  const handleCancelTrip = (tripId) => {
    dispatch(updateTrip({ id: tripId, tripData: { status: "cancelled" } }));
  };

  return (
    <div>
      {trips?.length > 0 ? (
        trips.map((trip) => {
          const { date, time } = formatDateTime(trip.start_time);

          return (
            <TripCard key={trip.id} onClick={() => setSelectedTrip(trip)}>
              <div>
                <p>
                  <strong>{trip.start_location}</strong> ➝{" "}
                  <strong>{trip.destination_location}</strong>
                </p>
                <span>📅 {date} at {time}</span>
                <StatusBadge status={ trip.status}>{statusMap[trip.status]}</StatusBadge>
              </div>

              {trip.status === "scheduled" && (
                <>
                  <Button onClick={() => handleStartTrip(trip.id)} start>
                    Start Trip
                  </Button>
                  <Button onClick={() => handleCancelTrip(trip.id)} cancel>
                    Cancel Trip
                  </Button>
                </>
              )}

{trip.status === "in_progress" && (
  <>
    <Button
      onClick={(e) => {
        e.stopPropagation();
        handleEndTrip(trip.id);
      }}
    >
      End Trip
    </Button>

    {trip.start_latitude && trip.start_longitude &&
     trip.destination_latitude && trip.destination_longitude ? (
      <Button
      onClick={(e) => {
        e.stopPropagation();
    
        const isThisTripSimulating = simulatedTrip?.id === trip.id && isSimulating;
    
        if (isThisTripSimulating) {
          setSimulatedTrip(null);
          setIsSimulating(false);
          handleStop(); // ✅ stop engine
        } else {
          setSimulatedTrip(trip);
          setIsSimulating(true);
          handleStart(); // ✅ start engine
        }
      }}
    >
      {simulatedTrip?.id === trip.id && isSimulating
        ? "Stop Simulation"
        : "Simulate Trip"}
    </Button>
    
      ) : (
        <Warning>Missing coordinates ⚠</Warning>
      )}
  </>
)}




              {!trip.has_load && <Warning>No Load Assigned ⚠</Warning>}
            </TripCard>
          );
        })
      ) : (
        <NoTrips>No trips found.</NoTrips>
      )}

      {/* Trip Details Modal */}
      {selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          userRole={"Driver"}
        />
      )}

      {/* Trip Simulator Modal */}
      {simulatedTrip && (
        <TripSimulator
          trip={simulatedTrip}
           simulationActive={simulationActive} 
        />
      )}
    </div>
  );
};

export default DriversTripList;


const TripCard = styled.div`
  background: #f9f9f9;
  padding: 20px;
  margin: 10px 0;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StatusBadge = styled.div`
  padding: 5px 10px;
  background-color: ${(props) =>
    props.status === "Scheduled" ? "#3498db" : "#e74c3c"};
  color: white;
  border-radius: 5px;
  font-weight: bold;
  margin-top: 10px;
`;

const Warning = styled.span`
  color: #e74c3c;
  font-weight: bold;
`;

const Button = styled.button`
  background-color: ${(props) =>
    props.cancel ? "#FF6347" : props.start ? "#4CAF50" : "#008CBA"}; /* Red for cancel, green for start, blue for end */
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    background-color: ${(props) =>
      props.cancel
        ? "#e53e2b"
        : props.start
        ? "#45a049"
        : "#007B9E"}; /* Darker shade on hover */
  }
`;

const NoTrips = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-style: italic;
  margin-top: 10px;
`;