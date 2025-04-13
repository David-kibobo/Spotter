import React from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";

const GlobalSpinner = () => {
  const isLoading = useSelector((state) => state.ui.isLoading);

  if (!isLoading) return null;

  return (
    <Overlay>
      <Spinner />
    </Overlay>
  );
};

export default GlobalSpinner;

// Spinner Styles
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 5px solid #999;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
