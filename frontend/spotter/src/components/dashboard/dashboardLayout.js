import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser,fetchCurrentUser } from "../../api/endPoints";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();
    const { user, status } = useSelector((state) => state.auth);
  
    useEffect(() => {
      if (!user && status === "idle") {  // ✅ Prevents infinite re-fetching
        dispatch(fetchCurrentUser());
      }
    }, [dispatch, user, status]); 
 

  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/"); // Redirect to login page
  };

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

        {/* Logout Button */}
        <LogoutButton onClick={handleLogout}>🚪 {isCollapsed ? "" : "Logout"}</LogoutButton>
      </Sidebar>

      {/* Main Dashboard Content */}
      <MainContent isCollapsed={isCollapsed}>
        <Header>
          <h1>Welcome {user?.first_name}</h1>
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

const LogoutButton = styled.button`
  padding: 15px;
  margin: 5px 0;
  cursor: pointer;
  background: #2c3e50;
  border: none;
  color: white;
  font-size: 1rem;
  text-align: ${({ isCollapsed }) => (isCollapsed ? "center" : "left")};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ isCollapsed }) => (isCollapsed ? "center" : "flex-start")};

  &:hover {
    background: #c0392b;
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
