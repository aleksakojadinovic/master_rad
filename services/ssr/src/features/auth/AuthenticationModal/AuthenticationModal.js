import { useLoginMutation } from '@/api/auth';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

const modalStyles = {
  top: '50%',
  left: '50%',
  right: 'auto',
  bottom: 'auto',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
};

const modalContentStyles = {
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '5px',
  width: '300px',
};

function AuthenticationModal({ onClose }) {
  const [username, setUsername] = useState('ethan');
  const [password, setPassowrd] = useState('ethan');

  const [triggerLogin, { data, isSuccess, isLoading }] = useLoginMutation();

  const handleLogin = () => {
    triggerLogin({ username, password });
  };

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    const { accessToken } = data;
    Cookies.set('accessToken', accessToken);

    window.location.reload();
  }, [isSuccess, data]);

  return (
    <Modal sx={modalStyles} open keepMounted onClose={onClose}>
      <Box sx={modalContentStyles}>
        <Box
          display="flex"
          justifyContent="center"
          marginBottom="20px"
          position="relative"
        >
          <Typography variant="h6" component="h2">
            Login
          </Typography>
          <Box position="absolute" top="0" right="5px">
            <Button onClick={onClose}>X</Button>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center">
          <form>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Box marginTop="12px">
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassowrd(e.target.value)}
              />
            </Box>
            <Box marginTop="12px" marginBottom="20px">
              <Button
                fullWidth
                variant="contained"
                disabled={isLoading}
                onClick={handleLogin}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

export default AuthenticationModal;
