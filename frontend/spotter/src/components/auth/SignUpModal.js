// import React, { useState } from "react";
// import styled from "styled-components";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { signupUser } from "../../api/endPoints";

// const SignupModal = ({ onClose, onSwitch }) => {
//   const [phone, setPhone] = useState("");

//   return (
//     <ModalOverlay>
//       <ModalContent>
//         <CloseButton onClick={onClose}>&times;</CloseButton>
//         <h2>Carrier Sign Up</h2>
//         <StyledInput type="text" placeholder="Full Name" required />
//         <StyledInput type="email" placeholder="Email" required />

//         {/* Phone Number Input */}
//         <PhoneWrapper>
//           <PhoneInput
//             country={"us"} 
//             value={phone}
//             onChange={(phone) => setPhone(phone)}
//             inputStyle={{
//               width: "100%",
//               height: "42px",
//               fontSize: "16px",
//               paddingLeft: "50px", 
//             }}
//             buttonStyle={{
//               borderRadius: "5px 0 0 5px",
//               border: "1px solid #ccc",
//               paddingLeft: "0px"
//             }}
//           />
//         </PhoneWrapper>

//         <StyledInput type="password" placeholder="Password" required />
//         <StyledInput type="password" placeholder="Confirm Password" required />
//         <SubmitButton>Sign Up</SubmitButton>
//         <SwitchText>
//           Already have an account? <span onClick={onSwitch}>Login</span>
//         </SwitchText>
//       </ModalContent>
//     </ModalOverlay>
//   );
// };

// export default SignupModal;

// // Styled Components
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.6);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 100;
// `;

// const ModalContent = styled.div`
//   background: white;
//   padding: 25px;
//   width: 380px; /* Increased width */
//   text-align: center;
//   border-radius: 10px;
//   position: relative;
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 10px;
//   right: 15px;
//   font-size: 22px;
//   background: none;
//   border: none;
//   cursor: pointer;
// `;

// const StyledInput = styled.input`
//   width: 90%;
//   padding: 12px;
//   margin: 10px 0;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   font-size: 16px;
// `;

// const PhoneWrapper = styled.div`
//   margin: 10px 0;
//   width:95%;
//   padding:12px;
// `;

// const SubmitButton = styled.button`
//   width: 100%;
//   padding: 12px;
//   background-color: #f04e30;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   font-size: 16px;
//   cursor: pointer;
//   margin-top: 12px;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const SwitchText = styled.p`
//   margin-top: 12px;

//   span {
//     color: #f04e30;
//     cursor: pointer;
//     font-weight: bold;
//   }
// `;
import React, { useState } from "react";
import styled from "styled-components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../api/endPoints";

const SignupModal = ({ onClose, onSwitch }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    carrierName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle phone input change
  const handlePhoneChange = (phone) => {
    setFormData({ ...formData, phone });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.carrierName ||
      !formData.phone
    ) {
      alert("All fields are required!");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const signupData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      carrier_name: formData.carrierName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    try {
      const resultAction = await dispatch(signupUser(signupData));
      if (signupUser.fulfilled.match(resultAction)) {
        setSuccessMessage("Signup successful! You can now log in.");
        setTimeout(() => onSwitch(), 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Carrier Sign Up</h2>

        {/* {error && <ErrorText>{error}</ErrorText>} */}
        {successMessage && <SuccessText>{successMessage}</SuccessText>}

        <form onSubmit={handleSubmit}>
          <StyledInput
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <StyledInput
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <StyledInput
            type="text"
            name="carrierName"
            placeholder="Carrier Name"
            value={formData.carrierName}
            onChange={handleChange}
            required
          />
          <StyledInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Phone Number Input */}
          <PhoneWrapper>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{
                width: "100%",
                height: "42px",
                fontSize: "16px",
                paddingLeft: "50px",
              }}
            />
          </PhoneWrapper>

          <StyledInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <StyledInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </SubmitButton>
        </form>

        <SwitchText>
          Already have an account? <span onClick={onSwitch}>Login</span>
        </SwitchText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SignupModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  width: 350px; /* Fixed modal width */
  text-align: center;
  border-radius: 10px;
  position: relative;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
`;

const StyledInput = styled.input`
  width: 100%;  /* Ensures inputs do not overflow */
  box-sizing: border-box;  /* Prevents extra width issues */
  padding: 10px;
  margin: 6px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const PhoneWrapper = styled.div`
  width: 100%; /* Makes it match other inputs */
  box-sizing: border-box;
  margin: 6px 0;
  `;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #f04e30;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const SwitchText = styled.p`
  margin-top: 8px;
  font-size: 14px;

  span {
    color: #f04e30;
    cursor: pointer;
    font-weight: bold;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
`;

const SuccessText = styled.p`
  color: green;
  font-size: 14px;
`;
