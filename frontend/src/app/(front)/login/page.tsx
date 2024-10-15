import React from "react";
import { Metadata } from "next";
import { Box } from "@mui/material";
import LoginPage from "./Login";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page description",
  keywords: ["Login", "Next.js"],
};

export default function Login() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoginPage />
    </Box>
  );
}
