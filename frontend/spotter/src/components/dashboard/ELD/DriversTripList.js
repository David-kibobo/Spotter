// import React from "react";
// import styled from "styled-components";
// import { updateTrip } from "../../../api/endPoints";
// import { useDispatch } from "react-redux";




  

// const TripList = ({ activeTrips, onStartTrip, trips }) => {
//     const dispatch=useDispatch()
//     const handleStartTrip = (tripId) => {
//         dispatch(updateTrip({ id: tripId, tripData: { status: "in_progress" } }));
//       };
      
//       const handleEndTrip = (tripId) => {
//         dispatch(updateTrip({ id: tripId, tripData: { status: "completed" } }));
//       };
      
//       const handleCancelTrip = (tripId) => {
//         dispatch(updateTrip({ id: tripId, tripData: { status: "cancelled" } }));
//       };
//   return (
//     <div>
//      {activeTrips?.length > 0 ? (
//   activeTrips.map((trip) => (
//     <TripCard key={trip.id}>
//       <div>
//         <p><strong>{trip.start_location}</strong> ➝ <strong>{trip.destination_location}</strong></p>
//         <span>📅 {trip.start_time}</span>
//         <StatusBadge> {trip.status}</StatusBadge>
//       </div>
//       {/* Show the Start Trip, End Trip, or Cancel Trip button based on current status */}
//       {trip.status === "scheduled" && (
//         <Button onClick={() => handleStartTrip(trip.id)}>Start Trip</Button>
//       )}
//       {trip.status === "in_progress" && (
//         <Button onClick={() => handleEndTrip(trip.id)}>End Trip</Button>
//       )}
//       {trip.status === "scheduled" && (
//         <Button onClick={() => handleCancelTrip(trip.id)} cancel>
//           Cancel Trip
//         </Button>
//       )}
//       {/* 🚨 Show load status */}
//       {!trip.has_load && <Warning>No Load Assigned ⚠</Warning>}
//     </TripCard>
//   ))
// ) : (
//   <p>No active trips.</p>
// )}
//     </div>
//   );
// };

// export default TripList;

import React from "react";
import styled from "styled-components";
import { updateTrip } from "../../../api/endPoints";
import { useDispatch } from "react-redux";

const DriversTripList = ({ trips, setSelectedTrip  }) => {
  const dispatch = useDispatch();

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
        trips.map((trip) => (
          <TripCard key={trip.id} onClick={() => setSelectedTrip(trip)}>
            <div>
              <p>
                <strong>{trip.start_location}</strong> ➝{" "}
                <strong>{trip.destination_location}</strong>
              </p>
              <span>📅 {trip.start_time}</span>
              <StatusBadge status={trip.status}> {trip.status}</StatusBadge>
            </div>

            {/* Action buttons shown based on trip status */}
            {trip.status === "scheduled" && (
              <>
                <Button onClick={() => handleStartTrip(trip.id)}>Start Trip</Button>
                <Button onClick={() => handleCancelTrip(trip.id)} cancel>
                  Cancel Trip
                </Button>
              </>
            )}

            {trip.status === "in_progress" && (
              <Button onClick={() => handleEndTrip(trip.id)}>End Trip</Button>
            )}

            {/* Load status */}
            {!trip.has_load && <Warning>No Load Assigned ⚠</Warning>}
          </TripCard>
        ))
      ) : (
        <NoTrips>No trips found.</NoTrips>
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