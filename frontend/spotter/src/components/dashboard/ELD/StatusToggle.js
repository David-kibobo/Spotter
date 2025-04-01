import styled, { keyframes, css } from "styled-components";
import { useState } from "react";

// Blinking Animation
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

// Status Data
const statuses = [
  { label: "Driving", color: "#4CAF50", icon: "🟢" }, // Green
  { label: "On-Duty", color: "#2196F3", icon: "🔵" }, // Blue
  { label: "Off-Duty", color: "#f0f0f0", icon: "⚪", blinkColor: "#ddd", textColor: "#222" }, // Light Gray Blink
  { label: "Sleeper Berth", color: "#8E44AD", icon: "🛏️" }, // Purple
];

const StatusToggle = () => {
  const [activeStatus, setActiveStatus] = useState(null);

  const handleToggle = (status) => {
    setActiveStatus(status === activeStatus ? null : status);
  };

  return (
    <StatusContainer>
      {statuses.map(({ label, color, icon, blinkColor, textColor }) => (
        <StatusButton
          key={label}
          isActive={activeStatus === label}
          color={color}
          blinkColor={blinkColor || color} // Default to the same color if not specified
          textColor={textColor || "white"} // Default white text
          onClick={() => handleToggle(label)}
        >
          {icon} {label}
        </StatusButton>
      ))}
    </StatusContainer>
  );
};

// Styled Components
const StatusContainer = styled.div`
  display: flex;
  flex-direction: row; /* FIXED: Horizontal Layout */
  align-items: center;
  justify-content: center;
  gap: 8px; /* Space between buttons */
  background: #222;
  padding: 10px;
  border-radius: 10px;
`;

const StatusButton = styled.button`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ isActive, textColor }) => (isActive ? textColor : "#fff")};
  background: ${({ color, isActive }) => (isActive ? color : "#555")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  position: relative;

  /* Moves active status UP, inactive status stays flat */
  transform: ${({ isActive }) => (isActive ? "translateY(-5px)" : "translateY(0)")};

  /* Blinking effect when active */
  ${({ isActive, blinkColor }) =>
    isActive &&
    css`
      animation: ${blink} 1s infinite;
      background: ${blinkColor}; /* Use modified blink color */
    `}

  &:hover {
    opacity: 0.8;
  }
`;

export default StatusToggle;
