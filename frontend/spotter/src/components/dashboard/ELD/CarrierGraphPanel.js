import React from "react";
import styled from "styled-components";
import ELDGraph from "./ELDGraph";
import { formatDateTime } from "../../../utils/helpers";

const CarrierGraphPanel = ({ logs, transformedData, driver, selectedDate }) => {
  return (
    <>
      <GraphContainer>
        <ELDGraph logs={logs} />
      </GraphContainer>
      <LogSection>
      <h3>Log Entries for {selectedDate} - {driver.name}</h3>
          <LogTable>
            <thead>
              <tr>
                <th>Time</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {transformedData.map((log, index) => (
                <tr key={index}>
                  <td> {log.date}-{log.time}</td>
                  <td>{log.status}</td>
                  <td>{log.duration} </td>
                  <td>{log.remarks || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </LogTable>
        </LogSection>
      {/* <LogEntries>
        <h3>Log Entries for {selectedDate} - {driver.name}</h3>
        {transformedData.map((entry, index) => (
          <LogItem key={index}>
            <span>{entry.time}</span>
            <span>{entry.status}</span>
            <span>{entry.duration}</span>
            <span>{entry.remarks}</span>
          </LogItem>
        ))}
      </LogEntries> */}
    </>
  );
};

export default CarrierGraphPanel;

const GraphContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 40px;
  background: #ddd;
  height: 200px;
  width: 100%; 
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
const LogSection = styled.div`
  margin-top: 20px;
`;

const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background: #f4f4f4;
  }

  @media (max-width: 600px) {
    th, td {
      font-size: 12px;
      padding: 6px;
    }
  }
`;