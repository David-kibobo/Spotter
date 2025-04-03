import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../api/endPoints";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose, onSwitch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/dashboard"); // Redirect to dashboard on success
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Login</h2>

        {error && <ErrorText>{error}</ErrorText>}

        <form onSubmit={handleSubmit}>
          <StyledInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <StyledInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </SubmitButton>
        </form>

        <SwitchText>
          Don't have an account? <span onClick={onSwitch}>Sign Up</span>
        </SwitchText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;

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
  margin-bottom:10px;
`;

const SubmitButton = styled.button`
  background: #f04e30;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;

  &:hover {
    background: #d94328;
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
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

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
`;
