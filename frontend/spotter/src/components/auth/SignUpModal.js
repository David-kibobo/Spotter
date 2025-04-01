import React, { useState } from "react";
import styled from "styled-components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const SignupModal = ({ onClose, onSwitch }) => {
  const [phone, setPhone] = useState("");

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Carrier Sign Up</h2>
        <StyledInput type="text" placeholder="Full Name" required />
        <StyledInput type="email" placeholder="Email" required />

        {/* Phone Number Input */}
        <PhoneWrapper>
          <PhoneInput
            country={"us"} 
            value={phone}
            onChange={(phone) => setPhone(phone)}
            inputStyle={{
              width: "100%",
              height: "42px",
              fontSize: "16px",
              paddingLeft: "50px", // Ensures text does not overlap with the flag
            }}
            buttonStyle={{
              borderRadius: "5px 0 0 5px",
              border: "1px solid #ccc",
              paddingLeft: "0px"
            }}
          />
        </PhoneWrapper>

        <StyledInput type="password" placeholder="Password" required />
        <StyledInput type="password" placeholder="Confirm Password" required />
        <SubmitButton>Sign Up</SubmitButton>
        <SwitchText>
          Already have an account? <span onClick={onSwitch}>Login</span>
        </SwitchText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SignupModal;

// Styled Components
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
  width: 380px; /* Increased width */
  text-align: center;
  border-radius: 10px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
`;

const StyledInput = styled.input`
  width: 90%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const PhoneWrapper = styled.div`
  margin: 10px 0;
  width:95%;
  padding:12px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #f04e30;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 12px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SwitchText = styled.p`
  margin-top: 12px;

  span {
    color: #f04e30;
    cursor: pointer;
    font-weight: bold;
  }
`;
