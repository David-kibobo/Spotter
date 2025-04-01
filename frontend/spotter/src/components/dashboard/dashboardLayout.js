// // import React from "react";
// // import styled from "styled-components";

// // const Dashboard = () => {
// //   return (
// //     <DashboardContainer>
// //       {/* Sidebar Navigation */}
// //       <Sidebar>
// //         <h2>SpotterDB</h2>
// //         <NavItem>📍 Map</NavItem>
// //         <NavItem>📄 ELD Logs</NavItem>
// //         <NavItem>🚚 Trips</NavItem>
// //         <NavItem>⚙️ Settings</NavItem>
// //       </Sidebar>

// //       {/* Main Dashboard Area */}
// //       <MainContent>
// //         <Header>
// //           <h1>Dashboard</h1>
// //         </Header>

// //         <Content>
// //           <Overview>
// //             <StatCard>🚛 Active Trips: <span>5</span></StatCard>
// //             <StatCard>📄 Logs Today: <span>12</span></StatCard>
// //             <StatCard>⚠️ Violations: <span>1</span></StatCard>
// //           </Overview>

// //           <MapContainer>
// //             <p>📍 Map will go here</p>
// //           </MapContainer>

// //           <LogsContainer>
// //             <h3>Recent ELD Logs</h3>
// //             <p>Driver A - 10:30 AM - On Duty</p>
// //             <p>Driver B - 11:15 AM - Rest Break</p>
// //           </LogsContainer>
// //         </Content>
// //       </MainContent>
// //     </DashboardContainer>
// //   );
// // };

// // export default Dashboard;

// // /* Styled Components */
// // const DashboardContainer = styled.div`
// //   display: flex;
// //   height: 100vh;
// // `;

// // const Sidebar = styled.div`
// //   width: 250px;
// //   background: #2c3e50;
// //   color: white;
// //   padding: 20px;
// //   display: flex;
// //   flex-direction: column;
// // `;

// // const NavItem = styled.div`
// //   padding: 15px;
// //   margin: 5px 0;
// //   cursor: pointer;
// //   &:hover {
// //     background: #34495e;
// //   }
// // `;

// // const MainContent = styled.div`
// //   flex: 1;
// //   padding: 20px;
// //   background: #f4f4f4;
// // `;

// // const Header = styled.div`
// //   text-align: center;
// // `;

// // const Content = styled.div`
// //   margin-top: 20px;
// // `;

// // const Overview = styled.div`
// //   display: flex;
// //   justify-content: space-around;
// // `;

// // const StatCard = styled.div`
// //   background: white;
// //   padding: 15px;
// //   border-radius: 8px;
// //   text-align: center;
// // `;

// // const MapContainer = styled.div`
// //   background: #ddd;
// //   height: 300px;
// //   margin: 20px 0;
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// // `;

// // const LogsContainer = styled.div`
// //   background: white;
// //   padding: 15px;
// //   border-radius: 8px;
// // `;
// import React, { useState } from "react";
// import styled from "styled-components";
// import { Link, Outlet } from "react-router-dom";

// const Dashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <DashboardContainer>
//       {/* Sidebar Navigation */}
//       <Sidebar isCollapsed={isCollapsed}>
//         <ToggleBtn onClick={() => setIsCollapsed(!isCollapsed)}>
//           {isCollapsed ? "☰" : "✖"}
//         </ToggleBtn>
//         <h2>{isCollapsed ? "" : "SpotterDB"}</h2>
//         <NavItem as={Link} to="/dashboard" isCollapsed={isCollapsed}>
//           🏠 {isCollapsed ? "" : "Home"}
//         </NavItem>
//         <NavItem as={Link} to="view-map" isCollapsed={isCollapsed}>
//           📍 {isCollapsed ? "" : "Map"}
//         </NavItem>
//         <NavItem as={Link} to="eld-logs" isCollapsed={isCollapsed}>
//           📄 {isCollapsed ? "" : "ELD Logs"}
//         </NavItem>
//         <NavItem as={Link} to="trips" isCollapsed={isCollapsed}>
//           🚚 {isCollapsed ? "" : "Trips"}
//         </NavItem>
//         <NavItem as={Link} to="settings" isCollapsed={isCollapsed}>
//           ⚙️ {isCollapsed ? "" : "Settings"}
//         </NavItem>
//       </Sidebar>

//       {/* Main Dashboard Content */}
//       <MainContent isCollapsed={isCollapsed}>
//         <Header>
//           <h1>Dashboard</h1>
//         </Header>

//         <ContentWrapper>
//           <Outlet /> {/* Dynamically loads DashboardHome or another page */}
//         </ContentWrapper>
//       </MainContent>
//     </DashboardContainer>
//   );
// };

// export default Dashboard;

// /* Styled Components */
// const DashboardContainer = styled.div`
//   display: flex;
// `;

// const Sidebar = styled.div`
//   width: ${({ isCollapsed }) => (isCollapsed ? "60px" : "200px")};
//   background: #2c3e50;
//   color: white;
//   padding: 20px;
//   position: fixed; /* Keep it fixed on the left */
//   left: 0;
//   top: 0;
//   height: 100vh; /* Full viewport height */
//   overflow-y: auto; /* Enable scrolling if content is too long */
//   transition: width 0.3s ease-in-out;
// `;

// const ToggleBtn = styled.button`
//   background: none;
//   border: none;
//   color: white;
//   font-size: 20px;
//   cursor: pointer;
//   margin-bottom: 10px;
// `;

// const NavItem = styled(Link)`
//   padding: 15px;
//   margin: 5px 0;
//   cursor: pointer;
//   text-align: ${({ isCollapsed }) => (isCollapsed ? "center" : "left")};
//   display: flex;
//   align-items: center;
//   justify-content: ${({ isCollapsed }) => (isCollapsed ? "center" : "flex-start")};
//   text-decoration: none;
//   color: white;

//   &:hover {
//     background: #34495e;
//   }
// `;

// const MainContent = styled.div`
//   flex: 1;
//   padding: 20px;
//   background: #f4f4f4;
//   margin-left: ${({ isCollapsed }) => (isCollapsed ? "90px" : "250px")}; /* Adjust for sidebar */
//   transition: margin-left 0.3s ease-in-out;
//   min-height: 100vh; /* Ensure it stretches */
// `;

// const Header = styled.div`
//   text-align: center;
//   padding-bottom: 20px;
// `;

// const ContentWrapper = styled.div`
//   overflow-y: auto;
//   max-height: calc(100vh - 60px); /* Adjust based on header height */
//   padding-bottom: 20px;

//   /* Hide scrollbar for Webkit (Chrome, Safari) */
//   &::-webkit-scrollbar {
//     display: none;
//   }

//   /* Hide scrollbar for Firefox */
//   scrollbar-width: none;
  
//   /* Hide scrollbar for Internet Explorer/Edge */
//   -ms-overflow-style: none;
// `;

import React, { useState } from "react";
import styled from "styled-components";
import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <DashboardContainer>
      {/* Sidebar Navigation */}
      <Sidebar isCollapsed={isCollapsed}>
        <ToggleBtn onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? "☰" : "✖"}
        </ToggleBtn>
        <h2>{isCollapsed ? "" : "SpotterDB"}</h2>
        <NavItem as={Link} to="/dashboard" isCollapsed={isCollapsed}>
          🏠 {isCollapsed ? "" : "Home"}
        </NavItem>
        <NavItem as={Link} to="view-map" isCollapsed={isCollapsed}>
          📍 {isCollapsed ? "" : "Map"}
        </NavItem>
        <NavItem as={Link} to="eld-logs" isCollapsed={isCollapsed}>
          📄 {isCollapsed ? "" : "ELD Logs"}
        </NavItem>
        <NavItem as={Link} to="trips" isCollapsed={isCollapsed}>
          🚚 {isCollapsed ? "" : "Trips"}
        </NavItem>
        <NavItem as={Link} to="admin-panel" isCollapsed={isCollapsed}>
          🛠 {isCollapsed ? "" : "Admin"}
        </NavItem>
        <NavItem as={Link} to="settings" isCollapsed={isCollapsed}>
          ⚙️ {isCollapsed ? "" : "Settings"}
        </NavItem>
      </Sidebar>

      {/* Main Dashboard Content */}
      <MainContent isCollapsed={isCollapsed}>
        <Header>
          <h1>Dashboard</h1>
        </Header>

        <ContentWrapper>
          <Outlet /> {/* Dynamically loads pages */}
        </ContentWrapper>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;

/* Styled Components */
const DashboardContainer = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? "60px" : "200px")};
  background: #2c3e50;
  color: white;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  transition: width 0.3s ease-in-out;
`;

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const NavItem = styled(Link)`
  padding: 15px;
  margin: 5px 0;
  cursor: pointer;
  text-align: ${({ isCollapsed }) => (isCollapsed ? "center" : "left")};
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => (isCollapsed ? "center" : "flex-start")};
  text-decoration: none;
  color: white;

  &:hover {
    background: #34495e;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background: #f4f4f4;
  margin-left: ${({ isCollapsed }) => (isCollapsed ? "90px" : "250px")};
  transition: margin-left 0.3s ease-in-out;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  padding-bottom: 20px;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 60px);
  padding-bottom: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;
