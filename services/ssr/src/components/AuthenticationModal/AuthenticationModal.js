"use client";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React from "react";

const modalStyles = {
  top: "50%",
  left: "50%",
  right: "auto",
  bottom: "auto",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
};

const modalContentStyles = {
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "3px",
  width: "300px",
};

function AuthenticationModal() {
  return (
    <Modal
      sx={modalStyles}
      open
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalContentStyles}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h6" component="h2">
            Login
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <form>
            <TextField label="Username" variant="outlined" />
            <Box sx={{ marginTop: "12px" }}>
              <TextField label="Password" variant="outlined" />
            </Box>
            <Box sx={{ marginTop: "12px", marginBottom: "20px" }}>
              <Button fullWidth variant="contained">
                Login
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

export default AuthenticationModal;
