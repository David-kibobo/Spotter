import React from "react";
import styled from "styled-components";
import { statusMap } from "../../../utils/helpers";
import { useEffect, useState } from "react";



const DriverCard = ({ driver, onSelect, isSelected, selectedDate, currentStatus }) => {




  return (

    <Card onClick={onSelect} selected={isSelected}>
    <p><strong>{driver.user?.first_name}</strong></p>
    <p>Truck #{driver.truck_data?.truck_number}</p>
    <p>Status: {statusMap[currentStatus]}</p>
  </Card>
  )

  
};

export default DriverCard;


const Card = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background: ${({ selected }) => (selected ? "#34495e" : "#2c3e50")};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #1f2e3d;
  }
`;