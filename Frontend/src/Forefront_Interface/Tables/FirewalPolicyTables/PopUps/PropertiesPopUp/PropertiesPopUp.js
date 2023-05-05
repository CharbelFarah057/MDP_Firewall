import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import General from './GeneralPage';
import Action from './ActionPage';
import Protocols from './ProtocolsPage';
import From from './FromPage';
import To from './ToPage';
import Users from './UsersPage';
import {handleRuleAppliesToChange,
  handleAddItem, 
  handleRemoveItems, 
  handleSelectItem, 
  handleSavePortsPopup } from '../AccessRulePopUp/Utilities/Page3-4-5Utilities.js';
import './PropertiesPopUp.css'
const PropertiesPopUp = ({ 
  onClose,
  onUpdate,
  totalRows,
  id,
  order,
  name,
  action,
  tcp_protocol,
  udp_protocol,
  source_network,
  destination_network,
  description,
  ports,
  userContext,
  ruleType}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  // General Page States
  const [rowId] = useState(id);
  const [orderInput] = useState(order);
  const [nameInput, setNameInput] = useState(name);
  const [descInput, setDescInput] = useState(description);
  // Action Page States
  const [actInput, setActInput] = useState(action);
  // Protocols Page States
  const [ruleAppliesTo, setRuleAppliesTo] = useState(Object.keys(tcp_protocol)[0]);
  const [items, setItems] = useState([...Object.values(tcp_protocol), ...Object.values(udp_protocol)]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [PortsPopupData, setPortsPopupData] = useState(ports);
  const [PageActionErrorMessage, setPageActionErrorMessage] = useState("");

  // From Page States
  const [sourceItems, setSourceItems] = useState(source_network);
  const [selectedRuleSources, setSelectedRuleSources] = useState(new Set());
  const [FromPageErrorMessage, setFromPageErrorMessage] = useState("");
  // To Page States
  const [destinationItems, setDestinationItems] = useState(destination_network);
  const [selectedRuleDestinations, setSelectedRuleDestinations] = useState(new Set());
  const [ToPageErrorMessage, setToPageErrorMessage] = useState("");

  const [propertiesErrorMessage, setPropertiesErrorMessage] = useState("");

  // const [modificationMade, setModificationMade] = useState(false);

  const handleChange = (event, newValue) => {
    if (newValue === 3 && items.length === 0) {
      setPageActionErrorMessage("At least one protocol must be added to the list of selected protocols.");
    } else if (newValue === 4 && sourceItems.length === 0) {
      setFromPageErrorMessage("At least one source must be added to the list of selected sources.");
    } else if (newValue === 5 && destinationItems.length === 0) {
      setToPageErrorMessage("At least one destination must be added to the list of selected destinations.");
    }
    else {
      setSelectedTab(newValue);
    }
  };

  const handleOkClick = () => {
    onClose()
    console.log("OK")
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="properties-modal-title"
      aria-describedby="properties-modal-description"
    >
      <Box sx={{ width: '80%', maxWidth: 800, bgcolor: 'background.paper', p: 2, mx: 'auto', my: '5%', borderRadius: 1 }}>
        <Typography id="properties-modal-title" variant="h6" component="h2">
          Properties
        </Typography>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="properties-tabs">
          <Tab label="General" />
          <Tab label="Action" />
          <Tab label="Protocols" />
          <Tab label="From" />
          <Tab label="To" />
          <Tab label="Users" />
          <Tab label="Schedule" />
        </Tabs>
        {/* Conditionally render tab content here */}
        {selectedTab === 0 && (
          <General
            nameInput={nameInput}
            setNameInput = {setNameInput}
            descInput={descInput}
            setDescInput = {setDescInput}
            rowId={orderInput}
            totalRows={totalRows}
          />
        )}
        {selectedTab === 1 && (
          <Action
            actInput={actInput}
            setActInput = {setActInput}
          />
        )}
        {selectedTab === 2 && (
          <Protocols
            ruleAppliesTo={ruleAppliesTo}
            handleRuleAppliesToChange={handleRuleAppliesToChange(setRuleAppliesTo, setItems)}
            items={items}
            handleAddItem={() => handleAddItem(setItems, items)}
            handleRemoveItems={() => handleRemoveItems(setItems, items, selectedItems, setSelectedItems)}
            handleSelectItem={(index, event) => handleSelectItem(selectedItems, setSelectedItems)(index, event)}
            selectedItems={selectedItems}
            errorMessage={PageActionErrorMessage}
            PortsPopupData = {PortsPopupData}
            handleSavePortsPopup={handleSavePortsPopup(setPortsPopupData)}
          />
        )}
        {selectedTab === 3 && (
          <From
            sourceItems={sourceItems}
            handleAddItem={() => handleAddItem(setSourceItems, sourceItems)}
            handleRemoveItems={() => handleRemoveItems(setSourceItems, sourceItems, selectedRuleSources, setSelectedRuleSources)}
            handleSelectItem={(index, event) => handleSelectItem(selectedRuleSources, setSelectedRuleSources)(index, event)}
            selectedRuleSources={selectedRuleSources}
            errorMessage={FromPageErrorMessage}
          />
        )}
        {selectedTab === 4 && (
          <To
            destinationItems={destinationItems}
            handleAddItem={() => handleAddItem(setDestinationItems, destinationItems)}
            handleRemoveItems={() => handleRemoveItems(setDestinationItems, destinationItems, selectedRuleDestinations, setSelectedRuleDestinations)}
            handleSelectItem={(index, event) => handleSelectItem(selectedRuleDestinations, setSelectedRuleDestinations)(index, event)}
            selectedItems={selectedRuleDestinations}
            errorMessage={ToPageErrorMessage}
          />
        )}
        {selectedTab === 5 && (
          <Users />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button onClick={handleOkClick} variant="outlined" sx={{ marginRight: 1 }}>
            Ok
          </Button>
          <Button onClick={onClose} variant="outlined" sx={{ marginRight: 1 }}>
            Cancel
          </Button>
        </Box>
          {propertiesErrorMessage && ( <div className="error-message-container">
          {propertiesErrorMessage}
          </div>)}
      </Box>
    </Modal>
  );
}  

export default PropertiesPopUp;