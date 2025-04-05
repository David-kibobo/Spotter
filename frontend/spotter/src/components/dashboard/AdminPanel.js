import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDriver, fetchDrivers, fetchTrucks, addTruck, updateTruck, updateDriver, deleteTruck } from "../../api/endPoints";
import { clearError } from "../../redux/slices/driversSlice";
import { clearTrucksError } from "../../redux/slices/trucksSlice";
import styled from "styled-components";

const AdminPanel = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDrivers());
    dispatch(fetchTrucks());
  }, [dispatch]);
  const drivers = useSelector((state) => state.drivers?.drivers?.data ?? []);
  const trucks = useSelector((state) => state.trucks?.trucks?.data ?? []);
  const { loading: driversLoading, error: driversError } = useSelector((state) => state.drivers);
  const { loading: trucksLoading, error: trucksError } = useSelector((state) => state.trucks);

  const [selectedData, setSelectedData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [activeTab, setActiveTab] = useState("drivers");
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showTruckForm, setShowTruckForm] = useState(false);
  const [editMode, setEditMode] = useState(false);




  // Handle Form Submission for Drivers
  const handleDriverSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const driverData = {
      email: formData.get("email"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      license_number: formData.get("license_number"),
      truck: formData.get("truck") || null,  // handle optional truck
    };

    if (editMode && selectedData) {
      const id = selectedData?.user?.id;  
      dispatch(updateDriver({ id, driverData }));  
     
    } else {
      dispatch(createDriver(driverData));
    }

    // Reset form state
    setShowDriverForm(false);
    setEditMode(false);
    setSelectedData(null);
  };


  // Function to get unassigned trucks
  const getAvailableTrucks = () => {
    const assignedTruckIds = new Set(drivers.map(d => d.truck));
    return trucks.filter(truck => !assignedTruckIds.has(truck.id));
  };


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

  const confirmDelete = () => {
    if (activeTab === "trucks") {
      dispatch(deleteTruck(selectedData.id));
    }
    setShowDeleteConfirm(false);
  };
  // Close Modals
  const closeModal = () => {
    setShowDriverForm(false);
    setShowTruckForm(false);
    setEditMode(false);
    setShowDeleteConfirm(false);
    setSelectedData(null);
  };
  // Handle Form Submission for Trucks
  const handleTruckSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const truckData = {
      truck_number: formData.get("number"),
      vin: formData.get("vin"),  // VIN
      make: formData.get("make"),
      model: formData.get("model"),
      year: formData.get("year"),
    };
    if (editMode && selectedData) {
      const id = selectedData?.id;  
      dispatch(updateTruck({ id, truckData }));  
     
    } else {
      dispatch(addTruck(truckData)); // Dispatch API call
    }

    // Reset form state
  
    setEditMode(false);
    setSelectedData(null);
      setShowTruckForm(false);
  };


  return (
    <AdminContainer>
      <h2>Admin Panel</h2>
      {/* Handling errors from Drivers */}
      {driversError && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          Driver Error: {driversError}
          <button onClick={() => dispatch(clearError("drivers"))}>X</button>
        </div>
      )}

      {/* Handling errors from Trucks */}
      {trucksError && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          Truck Error: {trucksError}
          <button onClick={() => dispatch(clearTrucksError("trucks"))}>X</button>
        </div>
      )}

      {/* Tabs */}
      <TabContainer>
        <TabButton active={activeTab === "drivers"} onClick={() => setActiveTab("drivers")}>
          Drivers
        </TabButton>
        <TabButton active={activeTab === "trucks"} onClick={() => setActiveTab("trucks")}>
          Trucks
        </TabButton>
      </TabContainer>

      {/* Drivers Section */}
      {activeTab === "drivers" && (
        <Section>
          <Button onClick={() => setShowDriverForm(true)}>➕ Add Driver</Button>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>License #</th>
                <th>Truck</th>
                <th>Phone #</th>
                <th> Actions </th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver?.user.first_name} {driver?.user.last_name}</td>
                  <td>{driver?.license_number}</td>
                  <td>
                    {(() => {
                      const assignedTruck = trucks.find(t => t.id === driver.truck);
                      return assignedTruck ? assignedTruck.truck_number : "Unassigned";
                    })()}
                  </td>

                  <td>{driver?.user.phone}</td>
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

      {/* Trucks Section */}
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
              {trucks?.map((truck) => (
                <tr key={truck.id}>
                  <td>{truck.truck_number}</td>
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
            <ModalHeader>
              <h3>{editMode ? "Edit Driver" : "Add Driver"}</h3>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleDriverSubmit}>
              <Input type="email" name="email" placeholder="Email" defaultValue={selectedData?.user?.email || ""} required />
              <Input type="text" name="first_name" placeholder="First Name" defaultValue={selectedData?.user?.first_name || ""} required />
              <Input type="text" name="last_name" placeholder="Last Name" defaultValue={selectedData?.user?.last_name || ""} required />
              <Input type="text" name="phone" placeholder="Phone Number" defaultValue={selectedData?.user?.phone || ""} required />
              {!editMode && (
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  defaultValue={selectedData?.user?.password || ""}
                  required
                />
              )}
              <Input type="text" name="license_number" placeholder="License Number" defaultValue={selectedData?.license_number || ""} required />
              <StyledLabel htmlFor="truck">Assign Truck (optional)</StyledLabel>
              <StyledSelect name="truck" defaultValue={selectedData?.truck || ""}>
                <option value="">-- Select Truck --</option>
                {getAvailableTrucks().map((truck) => (
                  <option key={truck.id} value={truck.id}>
                    {truck.truck_number} - {truck.make} {truck.model}
                  </option>
                ))}
              </StyledSelect>



              <ModalActions>
                <SaveButton type="submit">{editMode ? "Update" : "Save"}</SaveButton>
                <CancelButton onClick={closeModal}>Cancel</CancelButton>
              </ModalActions>
            </form>
          </Modal>
        </ModalOverlay>
      )}

      {/* Add/Edit Truck Modal */}

      {showTruckForm && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <h3>{editMode ? "Edit Truck" : "Add Truck"}</h3>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleTruckSubmit}>
              <Input type="text" name="number" placeholder="Truck Number" defaultValue={selectedData?.number || ""} required />
              <Input type="text" name="vin" placeholder="VIN" defaultValue={selectedData?.vin || ""} required />
              <Input type="text" name="make" placeholder="Make" defaultValue={selectedData?.make || ""} required />
              <Input type="text" name="model" placeholder="Model" defaultValue={selectedData?.model || ""} required />
              <Input type="text" name="year" placeholder="Year" defaultValue={selectedData?.year || ""} required />

              <ModalActions>
                <SaveButton type="submit">{editMode ? "Update" : "Save"}</SaveButton>
                <CancelButton onClick={closeModal}>Cancel</CancelButton>
              </ModalActions>
            </form>
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
              <Button onClick={confirmDelete}>OK</Button>
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

const SaveButton = styled(Button)`
  background: #007bff;
`;

const CancelButton = styled(Button)`
  background: #dc3545;
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
  padding: 25px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom:10px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
 `;
const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 5px;
  font-size: 16px;
`;
const DeleteDetails = styled.div`
  margin-top: 10px;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 4px;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fff;
  appearance: none;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
  }
`;