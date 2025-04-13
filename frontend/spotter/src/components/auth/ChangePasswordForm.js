import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { changePassword } from "../../api/endPoints";
import { toast } from "react-toastify";

const ChangePasswordModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
  
    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }
  
    try {
      const resultAction = await dispatch(
        changePassword({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        })
      );
  
      if (changePassword.fulfilled.match(resultAction)) {
        setSuccessMsg("Password updated successfully.");
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
  
        // Delay closing to show the success message briefly
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        const errorMessage =
          resultAction.payload || "Something went wrong.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      setError("Something went wrong.");
      toast.error("Something went wrong.");
    }
  };
  
  return (
    <Backdrop>
      <Modal>
        <ModalHeader>
          <h3>Change Password</h3>
          <CloseBtn onClick={onClose}>✖</CloseBtn>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <Error>{error}</Error>}
          {successMsg && <Success>{successMsg}</Success>}
          <SubmitButton type="submit">Update</SubmitButton>
        </form>
      </Modal>
    </Backdrop>
  );
};

export default ChangePasswordModal;

/* Styled Components */
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor:pointer;

  &:hover {
    background: #34495e;
  }
`;

const Error = styled.p`
  color: #e74c3c;
  margin-bottom: 10px;
`;

const Success = styled.p`
  color: #2ecc71;
  margin-bottom: 10px;
`;
