import React from "react";
import styled from "styled-components";


const StatusUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  status,
  formData,
  setFormData,
  currentLocation,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox>
        <h2>Log Status: {status}</h2>

        <Label>Distance Covered (mi)</Label>
        <Input
          type="number"
          value={formData.distance_covered}
          placeholder="Indicate the odometer distance"
          onChange={(e) =>
            setFormData({ ...formData, distance_covered: e.target.value })
          }
        />

        <Label>Remarks</Label>
        <Input
          type="text"
          value={formData.remarks}
          onChange={(e) =>
            setFormData({ ...formData, remarks: e.target.value })
          }
        />

        <Label>Latitude (optional)</Label>
        <Input
          type="number"
          value={formData.latitude || currentLocation.latitude}
          onChange={(e) =>
            setFormData({ ...formData, latitude: e.target.value })
          }
          placeholder="Leave blank to use current location"
        />

        <Label>Longitude (optional)</Label>
        <Input
          type="number"
          value={formData.longitude || currentLocation.longitude}
          onChange={(e) =>
            setFormData({ ...formData, longitude: e.target.value })
          }
          placeholder="Leave blank to use current location"
        />

        <Label>
          <input
            type="checkbox"
            checked={formData.is_fueling}
            onChange={(e) =>
              setFormData({ ...formData, is_fueling: e.target.checked })
            }
          />
          {" "}Is Fueling?
        </Label>

        <ButtonGroup>
          <Button onClick={onClose} style={{ background: "#aaa" }}>
            Cancel
          </Button>
          <Button onClick={onSubmit} style={{ background: "#28a745", color: "#fff" }}>
            Submit
          </Button>
        </ButtonGroup>
      </ModalBox>
    </Overlay>
  );
};

export default StatusUpdateModal;


const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Label = styled.label`
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;