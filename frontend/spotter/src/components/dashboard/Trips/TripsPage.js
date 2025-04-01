// // import React, { useState } from "react";
// // import styled from "styled-components";
// // import CreateTripModal from "./CreateTripModal"; // Importing the modal

// // const TripsPage = () => {
// //   const [selectedTab, setSelectedTab] = useState("default");
// //   const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

// //   const [trips, setTrips] = useState([
// //     { id: 1, status: "upcoming", origin: "New York", destination: "Chicago", date: "2025-04-10" },
// //     { id: 2, status: "ongoing", origin: "Los Angeles", destination: "Houston", date: "2025-04-08" },
// //     { id: 3, status: "completed", origin: "Seattle", destination: "Miami", date: "2025-03-30" },
// //   ]);

// //   const filteredTrips = selectedTab === "default" ? trips : trips.filter(trip => trip.status === selectedTab);

// //   return (
// //     <Container>
// //       {/* Sidebar */}
// //       <Sidebar>
// //         <h2>📌 Trips</h2>
// //         <NavButton onClick={() => setSelectedTab("default")}>📋 All Trips</NavButton>
// //         <NavButton onClick={() => setSelectedTab("upcoming")}>🟢 Upcoming Trips</NavButton>
// //         <NavButton onClick={() => setSelectedTab("ongoing")}>🟡 Ongoing Trips</NavButton>
// //         <NavButton onClick={() => setSelectedTab("completed")}>🔵 Completed Trips</NavButton>
// //       </Sidebar>

// //       {/* Main Panel */}
// //       <MainPanel>
// //         <Header>
// //           <h2>🚛 Manage Trips</h2>
// //           <CreateTripButton onClick={() => setIsModalOpen(true)}>➕ Create Trip</CreateTripButton>
// //         </Header>

// //         {/* Show default message if no tab is selected */}
// //         {selectedTab === "default" ? (
// //           <DefaultMessage>
// //             <h3>Welcome to Trips Management</h3>
// //             <p>Select a trip type to view details or create a new trip.</p>
// //           </DefaultMessage>
// //         ) : (
// //           <TripSection>
// //             <h3>
// //               {selectedTab === "upcoming" && "🟢 Upcoming Trips"}
// //               {selectedTab === "ongoing" && "🟡 Ongoing Trips"}
// //               {selectedTab === "completed" && "🔵 Completed Trips"}
// //             </h3>
// //             {filteredTrips.length > 0 ? (
// //               filteredTrips.map(trip => (
// //                 <TripCard key={trip.id}>
// //                   <p><strong>{trip.origin}</strong> ➝ <strong>{trip.destination}</strong></p>
// //                   <span>📅 {trip.date}</span>
// //                 </TripCard>
// //               ))
// //             ) : (
// //               <NoTrips>No trips found in this category.</NoTrips>
// //             )}
// //           </TripSection>
// //         )}
// //       </MainPanel>

// //       {/* Create Trip Modal */}
// //       {isModalOpen && <CreateTripModal onClose={() => setIsModalOpen(false)} />}
// //     </Container>
// //   );
// // };

// // export default TripsPage;

// // // Styled Components
// // const Container = styled.div`
// //   display: flex;
// //   height: 100vh;
// // `;

// // const Sidebar = styled.div`
// //   width: 250px;
// //   background: #2c3e50;
// //   color: white;
// //   padding: 20px;
// // `;

// // const NavButton = styled.button`
// //   width: 100%;
// //   padding: 10px;
// //   background: #34495e;
// //   color: white;
// //   border: none;
// //   margin-top: 10px;
// //   cursor: pointer;
// //   border-radius: 5px;
// //   &:hover {
// //     background: #1f2f3d;
// //   }
// // `;

// // const MainPanel = styled.div`
// //   flex: 1;
// //   background: #f8f9fa;
// //   padding: 20px;
// //   overflow-y: auto;
// // `;

// // const Header = styled.div`
// //   display: flex;
// //   justify-content: space-between;
// //   align-items: center;
// // `;

// // const CreateTripButton = styled.button`
// //   padding: 10px 15px;
// //   background: #3498db;
// //   color: white;
// //   border: none;
// //   border-radius: 5px;
// //   cursor: pointer;
// //   &:hover {
// //     background: #2980b9;
// //   }
// // `;

// // const DefaultMessage = styled.div`
// //   text-align: center;
// //   margin-top: 50px;
// // `;

// // const TripSection = styled.div`
// //   margin-top: 20px;
// // `;

// // const TripCard = styled.div`
// //   background: white;
// //   padding: 15px;
// //   margin: 10px 0;
// //   border-radius: 8px;
// //   box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
// //   display: flex;
// //   justify-content: space-between;
// //   align-items: center;
// // `;

// // const NoTrips = styled.p`
// //   color: #7f8c8d;
// //   text-align: center;
// //   font-style: italic;
// //   margin-top: 10px;
// // `;
// import React, { useState } from "react";
// import styled from "styled-components";
// import CreateTripModal from "./CreateTripModal";
// import TripDetailsModal from "./TripDetailsModal"; // Importing Trip Details Modal

// const TripsPage = () => {
//   const [selectedTab, setSelectedTab] = useState("default");
//   const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
//   const [selectedTrip, setSelectedTrip] = useState(null); // Track selected trip

//   const trips = [
//     { id: 1, truck: "Volvo 123", driver: "John Doe", start_location: "New York", destination: "Chicago", estimated_distance: 800, actual_distance: 750, start_time: "2025-04-10 08:00", end_time: null, status: "upcoming" },
//     { id: 2, truck: "Kenworth 456", driver: "Jane Smith", start_location: "Los Angeles", destination: "Houston", estimated_distance: 1500, actual_distance: 1400, start_time: "2025-04-08 06:00", end_time: "2025-04-10 18:00", status: "completed" },
//   ];

//   const filteredTrips = selectedTab === "default" ? trips : trips.filter(trip => trip.status === selectedTab);

//   return (
//     <Container>
//       {/* Sidebar */}
//       <Sidebar>
//         <h2>📌 Trips</h2>
//         <NavButton onClick={() => setSelectedTab("default")}>📋 All Trips</NavButton>
//         <NavButton onClick={() => setSelectedTab("upcoming")}>🟢 Upcoming Trips</NavButton>
//         <NavButton onClick={() => setSelectedTab("ongoing")}>🟡 Ongoing Trips</NavButton>
//         <NavButton onClick={() => setSelectedTab("completed")}>🔵 Completed Trips</NavButton>
//       </Sidebar>

//       {/* Main Panel */}
//       <MainPanel>
//         <Header>
//           <h2>🚛 Manage Trips</h2>
//           <CreateTripButton onClick={() => setIsCreateTripModalOpen(true)}>➕ Create Trip</CreateTripButton>
//         </Header>

//         {selectedTab === "default" ? (
//           <DefaultMessage>
//             <h3>Welcome to Trips Management</h3>
//             <p>Select a trip type to view details or create a new trip.</p>
//           </DefaultMessage>
//         ) : (
//           <TripSection>
//             <h3>
//               {selectedTab === "upcoming" && "🟢 Upcoming Trips"}
//               {selectedTab === "ongoing" && "🟡 Ongoing Trips"}
//               {selectedTab === "completed" && "🔵 Completed Trips"}
//             </h3>
//             {filteredTrips.length > 0 ? (
//               filteredTrips.map(trip => (
//                 <TripCard key={trip.id} onClick={() => setSelectedTrip(trip)}> {/* Click to open details */}
//                   <p><strong>{trip.start_location}</strong> ➝ <strong>{trip.destination}</strong></p>
//                   <span>📅 {trip.start_time}</span>
//                 </TripCard>
//               ))
//             ) : (
//               <NoTrips>No trips found in this category.</NoTrips>
//             )}
//           </TripSection>
//         )}
//       </MainPanel>

//       {/* Create Trip Modal */}
//       {isCreateTripModalOpen && <CreateTripModal onClose={() => setIsCreateTripModalOpen(false)} />}

//       {/* Trip Details Modal */}
//       {selectedTrip && <TripDetailsModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />}
//     </Container>
//   );
// };

// export default TripsPage;

// // Styled Components
// const Container = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// const Sidebar = styled.div`
//   width: 250px;
//   background: #2c3e50;
//   color: white;
//   padding: 20px;
// `;

// const NavButton = styled.button`
//   width: 100%;
//   padding: 10px;
//   background: #34495e;
//   color: white;
//   border: none;
//   margin-top: 10px;
//   cursor: pointer;
//   border-radius: 5px;
//   &:hover {
//     background: #1f2f3d;
//   }
// `;

// const MainPanel = styled.div`
//   flex: 1;
//   background: #f8f9fa;
//   padding: 20px;
//   overflow-y: auto;
// `;

// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const CreateTripButton = styled.button`
//   padding: 10px 15px;
//   background: #3498db;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   &:hover {
//     background: #2980b9;
//   }
// `;

// const DefaultMessage = styled.div`
//   text-align: center;
//   margin-top: 50px;
// `;

// const TripSection = styled.div`
//   margin-top: 20px;
// `;

// const TripCard = styled.div`
//   background: white;
//   padding: 15px;
//   margin: 10px 0;
//   border-radius: 8px;
//   box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   cursor: pointer;
// `;

// const NoTrips = styled.p`
//   color: #7f8c8d;
//   text-align: center;
//   font-style: italic;
//   margin-top: 10px;
// `;

import React, { useState } from "react";
import styled from "styled-components";
import CreateTripModal from "./CreateTripModal";
import TripDetailsModal from "./TripDetailsModal";

const TripsPage = () => {
  const [selectedTab, setSelectedTab] = useState("default");
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const trips = [
    { 
      id: 1, truck: "Volvo 123", driver: "John Doe", 
      start_location: "New York", destination: "Chicago", 
      estimated_distance: 800, actual_distance: null, 
      start_time: "2025-04-10 08:00", end_time: null, 
      status: "upcoming", hasLoad: false // 🚨 No load assigned
    },
    { 
      id: 2, truck: "Kenworth 456", driver: "Jane Smith", 
      start_location: "Los Angeles", destination: "Houston", 
      estimated_distance: 1500, actual_distance: 1400, 
      start_time: "2025-04-08 06:00", end_time: "2025-04-10 18:00", 
      status: "completed", hasLoad: true
    },
  ];

  const filteredTrips = selectedTab === "default" ? trips : trips.filter(trip => trip.status === selectedTab);

  return (
    <Container>
      <Sidebar>
        <h2>📌 Trips</h2>
        <NavButton onClick={() => setSelectedTab("default")}>📋 All Trips</NavButton>
        <NavButton onClick={() => setSelectedTab("upcoming")}>🟢 Upcoming Trips</NavButton>
        <NavButton onClick={() => setSelectedTab("ongoing")}>🟡 Ongoing Trips</NavButton>
        <NavButton onClick={() => setSelectedTab("completed")}>🔵 Completed Trips</NavButton>
      </Sidebar>

      <MainPanel>
        <Header>
          <h2>🚛 Manage Trips</h2>
          <CreateTripButton onClick={() => setIsCreateTripModalOpen(true)}>➕ Create Trip</CreateTripButton>
        </Header>

        {selectedTab === "default" ? (
          <DefaultMessage>
            <h3>Welcome to Trips Management</h3>
            <p>Select a trip type to view details or create a new trip.</p>
          </DefaultMessage>
        ) : (
          <TripSection>
            <h3>
              {selectedTab === "upcoming" && "🟢 Upcoming Trips"}
              {selectedTab === "ongoing" && "🟡 Ongoing Trips"}
              {selectedTab === "completed" && "🔵 Completed Trips"}
            </h3>
            {filteredTrips.length > 0 ? (
              filteredTrips.map(trip => (
                <TripCard key={trip.id} onClick={() => setSelectedTrip(trip)}>
                  <div>
                    <p><strong>{trip.start_location}</strong> ➝ <strong>{trip.destination}</strong></p>
                    <span>📅 {trip.start_time}</span>
                  </div>
                  {/* 🚨 Show load status */}
                  {!trip.hasLoad && <Warning>No Load Assigned ⚠</Warning>}
                </TripCard>
              ))
            ) : (
              <NoTrips>No trips found in this category.</NoTrips>
            )}
          </TripSection>
        )}
      </MainPanel>

      {isCreateTripModalOpen && <CreateTripModal onClose={() => setIsCreateTripModalOpen(false)} />}
      {selectedTrip && <TripDetailsModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />}
    </Container>
  );
};

export default TripsPage;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;
`;

const NavButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #34495e;
  color: white;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background: #1f2f3d;
  }
`;

const MainPanel = styled.div`
  flex: 1;
  background: #f8f9fa;
  padding: 20px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateTripButton = styled.button`
  padding: 10px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #2980b9;
  }
`;

const DefaultMessage = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const TripSection = styled.div`
  margin-top: 20px;
`;

const TripCard = styled.div`
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Warning = styled.span`
  color: #e74c3c;
  font-weight: bold;
`;

const NoTrips = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-style: italic;
  margin-top: 10px;
`;

