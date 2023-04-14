"use client";

import { useGetMeQuery } from "@/api/auth/client";
import { Box, Button } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const AuthenticationModal = dynamic(() =>
  import("../AuthenticationModal/AuthenticationModal")
);

function NavigationBar() {
  useGetMeQuery();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClose = () => setIsAuthModalOpen(false);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <div>Logo</div>
      <div>
        {isAuthModalOpen && <AuthenticationModal onClose={handleClose} />}
        <Button
          onClick={() => setIsAuthModalOpen(true)}
          onClose={handleClose}
          disabled={isAuthModalOpen}
        >
          Login
        </Button>
      </div>
    </Box>
  );
}

export default NavigationBar;
