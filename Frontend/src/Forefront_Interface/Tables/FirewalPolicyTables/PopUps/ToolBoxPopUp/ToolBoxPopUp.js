import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FiUsers } from 'react-icons/fi';
import { FcGlobe } from 'react-icons/fc';
import { FaNetworkWired } from 'react-icons/fa';
import Protocols from './ProtocolPage';
import './ToolBoxPopUp.css'
import { handleSelectItem } from '../AccessRulePopUp/Utilities/Page3-4-5Utilities';

const ToolBoxPopUp = ({ 
  onClose,
  }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const items = ['Common Protocols',
  'Infrastructure',
  'Mail',
  'Instant Messaging',
  'Remote Terminal',
  'Streaming Media',
  'VPN and IPsec',
  'Web',
  'Authentication',
  'Server Protocols',
  'IPv6 Infrastructure',
  'All Protocols'];
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
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
          ToolBox
        </Typography>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="properties-tabs">
          <Tab label="Protocols" />
          <Tab label="Users" />
          <Tab label="Network Objects" />
        </Tabs>
        {selectedTab === 0 && (
          <Protocols
            items = {items}
            handleSelectItem = {(index, event) => handleSelectItem(selectedItems, setSelectedItems, false)(index, event)}
            selectedItems = {selectedItems}
          />
        )}
        {selectedTab === 1 && (
          <>
            <div className="icon-text-container-toolbar">
                <FiUsers/> 
                <p> All Users</p>
            </div>
          </>
        )}
        {selectedTab === 2 && (
          <>
            <div className="icon-text-container-toolbar">
                <FcGlobe/>
                <p>External</p>
            </div>
            <div className="icon-text-container-toolbar">
                <FaNetworkWired></FaNetworkWired>
                <p>Internal Network</p>
            </div>
            <div className="icon-text-container-toolbar">
                <FaNetworkWired></FaNetworkWired>
                <p>Local Host</p>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
}  

export default ToolBoxPopUp;