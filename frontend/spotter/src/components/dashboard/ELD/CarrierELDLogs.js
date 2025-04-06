import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ELDLogsView from "./ELDLogsView";
import styled from "styled-components";
import { fetchELDLogs } from "../../../api/endPoints";

const CarrierELDLogs = () => {
  const dispatch = useDispatch();
  const { logs: allLogs, loading, error } = useSelector((state) => state.eldLogs);

  const [selectedLogSet, setSelectedLogSet] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchELDLogs());
  }, [dispatch]);

  if (selectedLogSet) {
    return (
      <ELDLogsView
        driver={selectedLogSet.driver}
        logs={selectedLogSet.logs}
        currentStatus={"Driving"}
        setIsPrintModalOpen={setIsPrintModalOpen}
        isPrintModalOpen={isPrintModalOpen}
        onBack={() => setSelectedLogSet(null)}
      />
    );
  }

  return (
    <Container>
      <h2>📄 All Driver ELD Logs</h2>
      {loading ? (
        <p>Loading ELD logs...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : allLogs?.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        allLogs?.map((entry, index) => (
          <LogCard key={index} onClick={() => setSelectedLogSet(entry)}>
            <p><strong>👤 Driver:</strong> {entry.driver.name}</p>
            <p><strong>🚛 Truck:</strong> {entry.driver.truckNumber}</p>
            <p><strong>🛣️ Total Entries:</strong> {entry.logs.length}</p>
            <p><strong>🕒 Last Log:</strong> {entry.logs[entry.logs.length - 1]?.time || "N/A"}</p>
            <ViewButton>🔍 View Full Logs</ViewButton>
          </LogCard>
        ))
      )}
    </Container>
  );
};

export default CarrierELDLogs;

// Styled Components (unchanged)
const Container = styled.div`
  padding: 20px;
`;

const LogCard = styled.div`
  background: #f4f4f4;
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    background: #eaeaea;
  }
`;

const ViewButton = styled.button`
  margin-top: 10px;
  padding: 6px 10px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #1a252f;
  }
`;
