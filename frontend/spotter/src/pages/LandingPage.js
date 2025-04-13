import React, { useState } from "react";
import styled from "styled-components";
import {
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaRoute,
  FaUserPlus,
  FaUsers,
  FaArrowRight,
  FaHome,
  FaStar,
  FaPhone,
  FaTimes, 
  FaBars
} from "react-icons/fa";
import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignUpModal";
const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);

  const openLogin = () => {
    setLoginOpen(true);
    setSignupOpen(false);
  };

  const openSignup = () => {
    setSignupOpen(true);
    setLoginOpen(false);
  };

  return (
    <PageContainer>
      {/* Navbar */}
      <Navbar>
        <LeftContainer>
        <Logo>Spotter</Logo>
        <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
  {menuOpen ? <FaTimes /> : <FaBars />}
</Hamburger>
        </LeftContainer>
       


    {/* Collapsible Navigation Links + Auth Buttons (On Mobile) */}
    <NavContainer menuOpen={menuOpen}>
      <NavLinks>
        <NavLink href="#"><FaHome /> Home</NavLink>
        <NavLink href="#"><FaStar /> Features</NavLink>
        <NavLink href="#"><FaRoute /> How It Works</NavLink>
        <NavLink href="#"><FaPhone /> Contact</NavLink>
      </NavLinks>

      {/* Auth Buttons (Moved Below NavLinks on Mobile) */}
      {/* Auth Buttons Inside Menu (Only on Mobile) */}
      {/* <MobileMenuAuthButtons menuOpen={menuOpen}>
        <LoginButton>Login</LoginButton>
        <SignupButton>Sign Up</SignupButton>
      </MobileMenuAuthButtons> */}
    </NavContainer>
    <MobileAuthButtons>
  <LoginButton onClick={openLogin}>Login</LoginButton>
  <SignupButton onClick={openSignup}>Sign Up</SignupButton>
</MobileAuthButtons>

     {/* Auth Buttons for Desktop View (Hidden on Mobile) */}
    <DesktopAuthButtons>
      <LoginButton onClick={openLogin}>Login</LoginButton>
      <SignupButton onClick={openSignup}>Sign Up</SignupButton>
    </DesktopAuthButtons>
      </Navbar>

   
      {/* Modals */}
      {isLoginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSwitch={openSignup} />}
      {isSignupOpen && <SignupModal onClose={() => setSignupOpen(false)} onSwitch={openLogin} />}
      {/* Hero Section */}
<HeroSection>
  <HeroContent>
    <HeroTitle>Effortless Load Management for Truckers & Dispatchers</HeroTitle>
    <HeroText>Track trips, manage routes, and stay compliant with ease. Join us today!</HeroText>
    <CTAButton onClick={openSignup}>
      Get Started <FaArrowRight />
    </CTAButton>
  </HeroContent>
</HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <Feature>
          <FaClock size={40} color="#f04e30" />
          <FeatureTitle>Real-Time Trip Logs</FeatureTitle>
          <FeatureText>Automatically update trip logs every 10 minutes.</FeatureText>
        </Feature>
        <Feature>
          <FaCheckCircle size={40} color="#f04e30" />
          <FeatureTitle>HOS Compliance</FeatureTitle>
          <FeatureText>Ensure adherence to Hours of Service (HOS) rules.</FeatureText>
        </Feature>
        <Feature>
          <FaTruck size={40} color="#f04e30" />
          <FeatureTitle>Easy Load Tracking</FeatureTitle>
          <FeatureText>Assign and manage loads seamlessly.</FeatureText>
        </Feature>
      </FeaturesSection>

      {/* How It Works Section */}
      <HowItWorks>
        <Step>
          <StepNumber>
            <FaUserPlus />
          </StepNumber>
          <StepText>Sign up and create your account.</StepText>
        </Step>
        <Step>
          <StepNumber>
            <FaUsers />
          </StepNumber>
          <StepText>Add your trucks, drivers, and dispatchers.</StepText>
        </Step>
        <Step>
          <StepNumber>
            <FaRoute />
          </StepNumber>
          <StepText>Start managing your trips and loads.</StepText>
        </Step>
      </HowItWorks>

      {/* CTA Section */}
      <CTASection>
        <CTAHeading>Ready to Simplify Trucking?</CTAHeading>
        <CTAButton onClick={openSignup}>
          Join Now <FaArrowRight />
        </CTAButton>
      </CTASection>

      {/* Footer */}
      <Footer>
        <FooterText>© 2025 Spotter. All rights reserved.</FooterText>
      </Footer>
    </PageContainer>
  );
};

export default LandingPage;

//
// Styled Components
//
const PageContainer = styled.div`
  font-family: Arial, sans-serif;
`;

// ✅ Navbar - Mobile Friendly
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background: #222;
  color: white;
  position: relative;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    display: ${(props) => (props.menuOpen ? "flex" : "none")};
    background: #222;
    position: absolute;
    top: 60px;
    left: 0;
    padding: 10px;
  }
`;
const Logo = styled.h1`
  font-size: 1.5rem;
`;
// const Hamburger = styled.div`
//   display: none; /* Hide on large screens */
//   font-size: 2rem;
//   cursor: pointer;

//   @media (max-width: 768px) {
//     display: block;
//   }
// `;
const NavLinks = styled.div`
  display: flex;
  gap: 40px; /* Increase spacing */
  flex: 1; /* Make it take up equal space */
  justify-content: center; /* Center the nav links */

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    text-align: center;
  }
`;
const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// const AuthButtons = styled.div`
//   display: flex;
//   gap: 13px;

//   @media (max-width: 768px) {
//     flex-direction: row;
//     position: absolute;
//     top: 15px;
//     right: 20px;
//   }
// `;

const DesktopAuthButtons = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    display: none;
  }
`;
const MobileAuthButtons = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    right: 20px;
    top: 15px;
    gap: 10px;
  }
`;

// const MobileMenuAuthButtons = styled.div`
//   display: ${(props) => (props.menuOpen ? "flex" : "none")};
//   flex-direction: column;
//   align-items: center;
//   gap: 10px;
//   margin-top: 15px;
// `;

const Hamburger = styled.div`
  font-size: 24px;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;
const LoginButton = styled.button`
  background: transparent;
  color: white;
  padding: 8px 15px; /* Reduce padding on mobile */
  font-size: 14px; /* Smaller font size */
  border: 2px solid white;
  border-radius: 5px;
  cursor: pointer;
  min-width: 80px; /* Reduce width on mobile */
  text-align: center;

  &:hover {
    background: white;
    color: #222;
  }

  @media (max-width: 768px) {
    padding: 6px 12px; /* Smaller padding */
    font-size: 12px; /* Smaller text */
    min-width: 70px; /* Smaller width */
  }
`;

const SignupButton = styled.button`
  background: #f04e30;
  color: white;
  padding: 8px 15px; /* Reduce padding */
  font-size: 14px; /* Smaller font size */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  min-width: 90px; /* Reduce width */
  text-align: center;

  &:hover {
    background: #d94328;
  }

  @media (max-width: 768px) {
    padding: 6px 12px; /* Smaller padding */
    font-size: 12px; /* Smaller text */
    min-width: 80px; /* Smaller width */
  }
`;

// ✅ Hero Section - Mobile Friendly
const HeroSection = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  background: url('/hero-bg.jpg') no-repeat center center/cover;
  color: white;
  text-align: center;
  padding: 20px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Dark overlay */
  }

  @media (max-width: 768px) {
    height: auto;
    padding: 40px 20px;
  }
`;

const HeroContent = styled.div`
  max-width: 600px;
  position: relative; /* Ensure text is above overlay */
  z-index: 1;
`;


const HeroTitle = styled.h2`
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.2rem;
  margin: 15px 0;
`;


const CTAButton = styled.button`
  background: #f04e30;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// ✅ Features Section - Mobile Friendly
const FeaturesSection = styled.section`
  display: flex;
  justify-content: space-around;
  padding: 50px 0;
  background: #f9f9f9;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
`;

const Feature = styled.div`
  max-width: 300px;
  text-align: center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const FeatureText = styled.p`
  font-size: 1rem;
`;

// ✅ How It Works - Mobile Friendly
const HowItWorks = styled.section`
  display: flex;
  justify-content: space-around;
  padding: 50px 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
`;

const Step = styled.div`
  max-width: 250px;
  text-align: center;
`;

const StepNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  background: #f04e30;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
`;

const StepText = styled.p`
  font-size: 1rem;
`;

// ✅ CTA Section - Mobile Friendly
const CTASection = styled.section`
  text-align: center;
  padding: 50px 0;
  background: #222;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content */
`;
const CTAHeading = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
`;


// ✅ Footer - Mobile Friendly
const Footer = styled.footer`
  text-align: center;
  padding: 20px 0;
  background: #222;
  color: white;
`;

const FooterText = styled.p`
  font-size: 1rem;
`;
