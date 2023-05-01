import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from '@mui/material';

const Action = ({actInput, setActInput}) => {
  const [logRequests, setLogRequests] = React.useState(false);

  const handleActionChange = (event) => {
    setActInput(event.target.value);
  };

  const handleLogRequestsChange = (event) => {
    setLogRequests(event.target.checked);
  };

  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Action to take when the rule conditions are met
        </FormLabel>
        <RadioGroup
          aria-label="action"
          value={actInput}
          onChange={handleActionChange}
          row={false}
        >
          <FormControlLabel
            value="Accept"
            control={<Radio />}
            label="Accept"
          />
          <FormControlLabel
            value="Drop"
            control={<Radio />}
            label="Drop"
          />
        </RadioGroup>
      </FormControl>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={logRequests}
              onChange={handleLogRequestsChange}
            />
          }
          label="Log requests matching the rule"
        />
      </div>
    </div>
  );
};

export default Action;
