import React, { useState } from "react";
import styled from "styled-components";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("drivers");
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showTruckForm, setShowTruckForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Dummy Data
  const drivers = [{ id: 1, name: "John Doe", license: "DL123456", truck: "101" }];
  const trucks = [{ id: 1, number: "101", make: "Freightliner", model: "Cascadia", year: "2022" }];

  // Open Edit Modal
  const handleEdit = (data, type) => {
    setEditMode(true);
    setSelectedData(data);
    type === "driver" ? setShowDriverForm(true) : setShowTruckForm(true);
  };

  // Open Delete Confirmation Modal
  const handleDelete = (data) => {
    setSelectedData(data);
    setShowDeleteConfirm(true);
  };

  // Close Modals
  const closeModal = () => {
    setShowDriverForm(false);
    setShowTruckForm(false);
    setEditMode(false);
    setShowDeleteConfirm(false);
    setSelectedData(null);
  };

  return (
    <AdminContainer>
      <h2>Admin Panel</h2>

      {/* Tabs */}
      <TabContainer>
        <TabButton active={activeTab === "drivers"} onClick={() => setActiveTab("drivers")}>
          Drivers
        </TabButton>
        <TabButton active={activeTab === "trucks"} onClick={() => setActiveTab("trucks")}>
          Trucks
        </TabButton>
      </TabContainer>

      {/* Drivers List */}
      {activeTab === "drivers" && (
        <Section>
          <Button onClick={() => setShowDriverForm(true)}>➕ Add Driver</Button>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>License #</th>
                <th>Truck</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver.name}</td>
                  <td>{driver.license}</td>
                  <td>{driver.truck}</td>
                  <td>
                    <ActionButton onClick={() => handleEdit(driver, "driver")}>✏️ Edit</ActionButton>
                    <ActionButton onClick={() => handleDelete(driver)}>❌ Delete</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}

      {/* Trucks List */}
      {activeTab === "trucks" && (
        <Section>
          <Button onClick={() => setShowTruckForm(true)}>➕ Add Truck</Button>
          <Table>
            <thead>
              <tr>
                <th>Truck #</th>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map((truck) => (
                <tr key={truck.id}>
                  <td>{truck.number}</td>
                  <td>{truck.make}</td>
                  <td>{truck.model}</td>
                  <td>{truck.year}</td>
                  <td>
                    <ActionButton onClick={() => handleEdit(truck, "truck")}>✏️ Edit</ActionButton>
                    <ActionButton onClick={() => handleDelete(truck)}>❌ Delete</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}

      {/* Add/Edit Driver Modal */}
      {showDriverForm && (
        <ModalOverlay>
          <Modal>
            <h3>{editMode ? "Edit Driver" : "Add Driver"}</h3>
            <input type="text" placeholder="Driver Name" defaultValue={selectedData?.name || ""} />
            <input type="text" placeholder="License Number" defaultValue={selectedData?.license || ""} />
            <select defaultValue={selectedData?.truck || ""}>
              <option>Select Truck</option>
              <option>101</option>
            </select>
            <ModalActions>
              <Button onClick={closeModal}>Save</Button>
              <CancelButton onClick={closeModal}>Cancel</CancelButton>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}

      {/* Add/Edit Truck Modal */}
      {showTruckForm && (
        <ModalOverlay>
          <Modal>
            <h3>{editMode ? "Edit Truck" : "Add Truck"}</h3>
            <input type="text" placeholder="Truck Number" defaultValue={selectedData?.number || ""} />
            <input type="text" placeholder="Make" defaultValue={selectedData?.make || ""} />
            <input type="text" placeholder="Model" defaultValue={selectedData?.model || ""} />
            <input type="text" placeholder="Year" defaultValue={selectedData?.year || ""} />
            <ModalActions>
              <Button onClick={closeModal}>Save</Button>
              <CancelButton onClick={closeModal}>Cancel</CancelButton>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}

      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <ModalOverlay>
          <Modal>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this {activeTab === "drivers" ? "driver" : "truck"}?</p>
            {selectedData && (
              <DeleteDetails>
                {activeTab === "drivers" ? (
                  <>
                    <strong>Name:</strong> {selectedData.name} <br />
                    <strong>License #:</strong> {selectedData.license} <br />
                    <strong>Truck:</strong> {selectedData.truck}
                  </>
                ) : (
                  <>
                    <strong>Truck #:</strong> {selectedData.number} <br />
                    <strong>Make:</strong> {selectedData.make} <br />
                    <strong>Model:</strong> {selectedData.model} <br />
                    <strong>Year:</strong> {selectedData.year}
                  </>
                )}
              </DeleteDetails>
            )}
            <ModalActions>
              <Button onClick={() => alert("Deleted Successfully!")}>OK</Button>
              <CancelButton onClick={closeModal}>Cancel</CancelButton>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </AdminContainer>
  );
};

export default AdminPanel;

/* Styled Components */
const AdminContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  background: ${({ active }) => (active ? "#007bff" : "#ddd")};
  color: white;
  cursor: pointer;
`;

const Section = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  th, td {
    border: 1px solid #ddd;
    padding: 10px;
  }
`;
const Button = styled.button`
  background: #28a745;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background: #dc3545;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  font-size: 16px;
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
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DeleteDetails = styled.div`
  margin-top: 10px;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
`;
const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
`;