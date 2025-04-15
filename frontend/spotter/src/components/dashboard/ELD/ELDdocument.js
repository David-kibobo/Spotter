import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { transformLogData, formatMinutes } from '../../../utils/helpers';
import ELDGraph from './ELDGraph';

const PrintableELDLog = ({ driver, logs, onClose, hosStats, todayDurations, selectedDate }) => {
  const printRef = useRef();

const {total_hours_past_8_days, available_hours_tomorrow}=hosStats;

  const transformedData = transformLogData(logs);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `ELD_Log_${driver.name}`,
    pageStyle: `
      @page { size: auto; margin: 5mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        ${StyledPrintArea} { padding: 0; }
      }
    `,
  });

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <ScrollableArea>
          <StyledPrintArea ref={printRef}>
          <Header>
              <h1>Driver’s Daily Log</h1>
              <p><strong>Driver:</strong> {driver.name} | <strong>Co-Driver:</strong> {driver.coDriver || "N/A"}</p>
              <p><strong>Truck:</strong> {driver.truckNumber} | <strong>Miles Driven:</strong> {driver.totalMiles} mi</p>
              <p><strong>Carrier:</strong> {driver.carrier}</p>
              <p><strong>Carrier’s Office:</strong> {driver?.carrierAddress}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
            </Header>

            <GraphSection>
              <h3>ELD Graph</h3>
              <ELDGraph logs={logs} />
            </GraphSection>

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
                  {transformedData.map((log, index) => (
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

            <ComplianceSection>
              <h3>Compliance Summary</h3>
              <p><strong>Total On-Duty Today:</strong> {formatMinutes(todayDurations.onDutyToday) || 0}</p>
              <p><strong>Total Driving Today:</strong> {formatMinutes(todayDurations.drivingToday) || 0}</p>
              <p><strong>Total Rest (Off-Duty + Sleeper Berth):</strong> {formatMinutes((todayDurations.offDutyToday || 0) + (todayDurations.sleeperToday || 0))}</p>
              <p>
                <strong>Last 7 Days:</strong> {`${total_hours_past_8_days}h (${available_hours_tomorrow}h remaining)`}
              </p>
              {total_hours_past_8_days>=65 && <Warning>⚠️ 34-hour reset may be needed soon.</Warning>}
            </ComplianceSection>
          </StyledPrintArea>
          <PrintButton onClick={handlePrint}>🖨️ Print / Save as PDF</PrintButton>
        </ScrollableArea>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PrintableELDLog;

const StyledPrintArea = styled.div`
  background: white;
  padding: 20px;
  @media print {
    padding: 0;
    width: 100%;
  }
`;

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

  @media print {
    display: none;
  }
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

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const ScrollableArea = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 70vh;
  padding-right: 10px;

  @media (max-width: 600px) {
    padding-right: 0;
  }
`;

const CloseButton = styled.button`
  position: fixed; /* Make it fixed so it stays in view */
  top: 10px;
  right: 10px;
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  @media print {
    display: none;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }
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

  @media print {
    display: none;
  }
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

  @media (max-width: 600px) {
    font-size: 13px;
    grid-template-columns: 1fr;
    
    h1 {
      font-size: 18px;
    }
  }
`;
const GraphSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0; /* Remove padding */
  margin-bottom: 20px;

  @media print {
    width: 100% !important;
    padding: 0 !important;
    margin: 0 auto;
    page-break-inside: avoid;
  }

  canvas {
    width: 100% !important;
    height: auto !important;
    display: block;
  }
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

const ComplianceSection = styled.div`
  margin-top: 20px;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const Warning = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 10px;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;
