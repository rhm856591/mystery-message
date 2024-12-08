import * as React from "react";
import { Html, Head, Preview, Body, Container, Heading, Text } from "@react-email/components";

interface verificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail: React.FC<Readonly<verificationEmailProps>> = ({ username, otp }) => {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code</Preview>
      <Body style={{ backgroundColor: "#f9f9f9", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <Heading style={{ textAlign: "center", color: "#1e90ff" }}>Hello, {username}!</Heading>
          <Text style={{ fontSize: "16px", textAlign: "center", margin: "20px 0" }}>
            Use the OTP below to complete your verification process:
          </Text>
          <div
            style={{
              textAlign: "center",
              padding: "15px",
              backgroundColor: "#f1f5f9",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#1e90ff", letterSpacing: "2px" }}>
              {otp}
            </Text>
          </div>
          <Text style={{ fontSize: "14px", textAlign: "center", color: "#6b7280" }}>
            This OTP is valid for 10 minutes. If you didn’t request it, you can safely ignore this email.
          </Text>
          <footer
            style={{
              marginTop: "30px",
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "10px",
            }}
          >
            <Text>&copy; 2024 Your Company. All rights reserved.</Text>
            <Text>123 Main Street, City, Country</Text>
          </footer>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
