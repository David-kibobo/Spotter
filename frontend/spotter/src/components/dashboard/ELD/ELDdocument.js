import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ELDGraph from "./ELDGraph";

const PrintableELDLog = ({ driver, logs, onClose }) => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    pdf.save(`ELD_Log_${driver.name}.pdf`);
  };

  // Calculate total status times
  const statusTotals = logs.reduce((acc, log) => {
    acc[log.status] = (acc[log.status] || 0) + log.duration;
    return acc;
  }, {});

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <ScrollableArea>
          <PrintArea ref={printRef}>
            <Header>
              <h1>Driver’s Daily Log</h1>
              <p><strong>Driver:</strong> {driver.name} | <strong>Co-Driver:</strong> {driver.coDriver || "N/A"}</p>
              <p><strong>Truck:</strong> {driver.truckNumber} | <strong>Miles Driven:</strong> {driver.milesDriven} mi</p>
              <p><strong>Carrier:</strong> {driver.carrier}</p>
              <p><strong>Carrier’s Office:</strong> {driver.officeAddress}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </Header>

            {/* ELD Graph Section */}
            <GraphSection>
              <h3>ELD Graph</h3>
              <ELDGraph />
            </GraphSection>

            {/* Log Entries */}
            <LogSection>
              <h3>Today's Log Entries</h3>
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
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td>{log.time}</td>
                      <td>{log.status}</td>
                      <td>{log.duration} min</td>
                      <td>{log.remarks || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </LogTable>
            </LogSection>

            {/* Compliance Summary */}
            <ComplianceSection>
              <h3>Compliance Summary</h3>
              <p><strong>Total On-Duty Today:</strong> {statusTotals["On-Duty"] || 0} min</p>
              <p><strong>Total Driving Today:</strong> {statusTotals["Driving"] || 0} min</p>
              <p><strong>Total Rest (Off-Duty + Sleeper Berth):</strong> {(statusTotals["Off-Duty"] || 0) + (statusTotals["Sleeper Berth"] || 0)} min</p>
              <p><strong>Last 7 Days:</strong> 63h (7h remaining)</p>
              <Warning>⚠️ 34-hour reset required soon!</Warning>
            </ComplianceSection>
          </PrintArea>
        </ScrollableArea>

        {/* Print Button */}
        <PrintButton onClick={handleDownloadPDF}>📥 Download PDF</PrintButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PrintableELDLog;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

const ScrollableArea = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 70vh;
  padding-right: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  border: none;
  background: transparent;
  color: black;  
  font-size: 12px; 
  font-weight: bold;
  cursor: pointer;
  z-index: 1100;
`;

const PrintButton = styled.button`
  padding: 10px 15px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    background: #1a252f;
  }
`;

const PrintArea = styled.div`
  background: white;
  padding: 20px;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  background: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 14px;

  h1 {
    grid-column: span 2;
    text-align: center;
    font-size: 20px;
    margin-bottom: 10px;
  }

  p {
    margin: 3px 0;
  }

  strong {
    color: #2c3e50;
  }
`;

const GraphSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
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
`;

const ComplianceSection = styled.div`
  margin-top: 20px;
`;

const Warning = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 10px;
`;
