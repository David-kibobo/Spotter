import React from "react";
import styled from "styled-components";

const LoginModal = ({ onClose, onSwitch }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Login</h2>
        <StyledInput type="email" placeholder="Email" required />
        <StyledInput type="password" placeholder="Password" required />
        <SubmitButton>Login</SubmitButton>
        <SwitchText>
          Don't have an account? <span onClick={onSwitch}>Sign Up</span>
        </SwitchText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background: white;
  padding: 25px;
  width: 320px;
  text-align: center;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background: #f04e30;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #d94328;
  }
`;

const SwitchText = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #444;
  cursor: pointer;

  span {
    color: #f04e30;
    text-decoration: underline;
    cursor: pointer;
  }
`;
