import styled, { keyframes, css } from "styled-components";
import { canChangeStatus, statusMap } from "../../../utils/helpers";
import { toast } from "react-toastify";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const statuses = [
  { label: "driving", color: "#4CAF50", icon: "🟢" },
  { label: "on_duty", color: "#2196F3", icon: "🔵" },
  { label: "off_duty", color: "#f0f0f0", icon: "⚪", blinkColor: "#ddd", textColor: "#222" },
  { label: "sleeper_berth", color: "#8E44AD", icon: "🛏️" },
];

const StatusToggle = ({ onStatusChange, activeStatus, hosStats }) => {
  const handleToggle = (status) => {
    const isAllowed = canChangeStatus(status, activeStatus, hosStats);

    if (!isAllowed) {
      toast.warn("You can't switch to this status due to HOS rules.");
      return;
    }

    if (status !== activeStatus) {
      onStatusChange(status);
    }
  };



  return (
    <StatusContainer>
      {statuses.map(({ label, color, icon, blinkColor, textColor }) => {
        const isDisabled = !canChangeStatus(label, activeStatus, hosStats);
        return (
          <StatusButton
            key={label}
            isActive={activeStatus === label}
            color={color}
            blinkColor={blinkColor || color}
            textColor={textColor || "white"}
            onClick={() => handleToggle(label)}
            disabled={isDisabled}
            title={
              isDisabled
                ? `Can't switch to "${label}" – violates HOS rules.`
                : `Switch to ${label}`
            }
          >
             {statusMap[label]}
          </StatusButton>

        );
      })}
    </StatusContainer>
  );
};



const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #222;
  padding: 10px;
  border-radius: 10px;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 8px;
    gap: 6px;
  }
`;

const StatusButton = styled.button`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ isActive, textColor }) => (isActive ? textColor : "#fff")};
  background: ${({ color, isActive }) => (isActive ? color : "#555")};
  border: none;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: transform 0.2s ease, background 0.2s ease;
  position: relative;
  transform: ${({ isActive }) => (isActive ? "translateY(-5px)" : "translateY(0)")};

  ${({ isActive, blinkColor }) =>
    isActive &&
    css`
      animation: ${blink} 1s infinite;
      background: ${blinkColor};
    `}

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    padding: 10px 14px;
    font-size: 13px;
    width: 100%;
    text-align: center;
    border-radius: 12px;
  }
`;


export default StatusToggle;
