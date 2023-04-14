"use client";

import { Box, Button } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const AuthenticationModal = dynamic(() =>
  import("../AuthenticationModal/AuthenticationModal")
);

function NavigationBar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <div>Logo</div>
      <div>
        {isAuthModalOpen && <AuthenticationModal />}
        <Button onClick={() => setIsAuthModalOpen(true)}>Login</Button>
      </div>
    </Box>
  );
}

export default NavigationBar;
