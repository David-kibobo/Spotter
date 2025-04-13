import React, { useState } from "react";
import styled from "styled-components";
import ChangePasswordModal from "../../auth/ChangePasswordForm";

const SettingsPage = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modal) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <Container>
      <Title>Settings</Title>
      <SettingsGrid>
        <SettingCard onClick={() => openModal("change-password")}>
          🛡️ Change Password
        </SettingCard>
        <SettingCard>
          👤 Edit Profile (Coming Soon)
        </SettingCard>
        <SettingCard>
          🔔 Notification Settings (Coming Soon)
        </SettingCard>
      </SettingsGrid>

      {/* Modals */}
      {activeModal === "change-password" && (
        <ChangePasswordModal onClose={closeModal} />
      )}
    </Container>
  );
};

export default SettingsPage;

/* Styled Components */
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SettingCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f8f9fa;
    transform: scale(1.02);
  }
`;
