import React from "react";
import styled from "styled-components";
import ELDGraph from "./ELDGraph";

const CarrierGraphPanel = ({ logs, transformedData, driver, selectedDate }) => {
  return (
    <>
      <GraphContainer>
        <ELDGraph logs={logs} />
      </GraphContainer>

      <LogEntries>
        <h3>Log Entries for {selectedDate} - {driver.name}</h3>
        {transformedData.map((entry, index) => (
          <LogItem key={index}>
            <span>{entry.time}</span>
            <span>{entry.status}</span>
            <span>{entry.duration}</span>
            <span>{entry.remarks}</span>
          </LogItem>
        ))}
      </LogEntries>
    </>
  );
};

export default CarrierGraphPanel;

const GraphContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 40px;
  background: #ddd;
  height: 200px;
  width: 100%; /* Adjust the width to fit within the MainSection */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const LogEntries = styled.div`
  margin-top: 30px;
`;

const LogItem = styled.div`
  display: flex;
  justify-content: space-between;
  background: white;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
`;
