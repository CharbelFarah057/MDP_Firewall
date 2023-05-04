import React from 'react';
import { Grid, TextField, FormControlLabel, Checkbox } from '@mui/material';

const General = ({
  nameInput,
  setNameInput,
  descInput,
  setDescInput,
  rowId,
  totalRows,
}) => {
  const handleNameChange = (event) => {
    setNameInput(event.target.value);
  };

  const handleDescChange = (event) => {
    setDescInput(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <label>Name:</label>
      </Grid>
      <Grid item xs={8}>
        <TextField value={nameInput} onChange={handleNameChange} fullWidth />
      </Grid>
      <Grid item xs={4}>
        <label>Description<br></br>(optional):</label>
      </Grid>
      <Grid item xs={8}>
        <TextField value={descInput} onChange={handleDescChange} fullWidth />
      </Grid>
      <Grid item xs={4}>
        <label>Type:</label>
      </Grid>
      <Grid item xs={8}>
        <span>Access Rule</span>
      </Grid>
      <Grid item xs={4}>
        <label>Evaluation order:</label>
      </Grid>
      <Grid item xs={8}>
        <span>
          Rule {rowId} of {totalRows}
        </span>
      </Grid>
    </Grid>
  );
};

export default General;
