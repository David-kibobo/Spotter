import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { transformLogData, formatMinutes } from '../../../utils/helpers';
import ELDGraph from './ELDGraph';

const PrintableELDLog = ({ driver, logs, onClose, hosStats, todayDurations, selectedDate }) => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 180, 0);
    pdf.save(`ELD_Log_${driver.name}.pdf`);
  };

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
              <p><strong>Truck:</strong> {driver.truckNumber} | <strong>Miles Driven:</strong> {driver.milesDriven} mi</p>
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
                <strong>Last 7 Days:</strong> {`${hosStats.totalLast7Days}h (${hosStats.availableHoursTomorrow}h remaining)`}
              </p>
              <Warning>⚠️ 34-hour reset required soon!</Warning>
            </ComplianceSection>
          </StyledPrintArea>
          <PrintButton onClick={handlePrint}>🖨️ Print / Save as PDF</PrintButton>
        </ScrollableArea>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PrintableELDLog;

// Styled components remain unchanged

// --- STYLED COMPONENTS --- (Keep your existing styles)
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
