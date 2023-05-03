// AddProtocolPopup.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const AddProtocolPopup = ({ open, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [port, setPort] = useState('');
  const [protocol, setProtocol] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    port: "",
    protocol: "",
  });

  const validateInputs = () => {
    let isValid = true;
    let errors = {
      name: "",
      port: "",
      protocol: "",
    };
  
    if (name.trim() === "") {
        isValid = false;
        errors.name = "Name is required";
    } else if (name.includes(" ")) { // Add a new condition for checking space in the name
        isValid = false;
        errors.name = "Name should not contain spaces";
    }
  
    if (port.trim() === "") {
      isValid = false;
      errors.port = "Port is required";
    } else if (!/^[0-9]+$/.test(port)) {
      isValid = false;
      errors.port = "Port should be a number";
    } else if (Number(port) < 1 || Number(port) > 65535) {
      isValid = false;
      errors.port = "Port should be between 1 and 65535 (both inclusive)";
    }
  
    if (protocol.trim() === "") {
      isValid = false;
      errors.protocol = "Protocol is required";
    } else if (!["tcp", "udp"].includes(protocol.toLowerCase())) {
      isValid = false;
      errors.protocol = "Protocol should be either 'TCP' or 'UDP'";
    }
  
    setErrorMessages(errors);
    return isValid;
  };
  
  const handleSave = () => {
    if (validateInputs()) {
      onSave({ Name: name, Port: port, Protocol: protocol });
      setName('');
      setPort('');
      setProtocol('');
    }
  };

  const handleCancel = () => {
    onCancel();
    setName('');
    setPort('');
    setProtocol('');
  };

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="add-protocol-popup">
      <DialogTitle id="add-protocol-popup">Add Protocol</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(errorMessages.name)}
            helperText={errorMessages.name}
          />
          <TextField
            label="Port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            error={Boolean(errorMessages.port)}
            helperText={errorMessages.port}
          />
          <TextField
            label="Protocol"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            error={Boolean(errorMessages.protocol)}
            helperText={errorMessages.protocol}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProtocolPopup;
