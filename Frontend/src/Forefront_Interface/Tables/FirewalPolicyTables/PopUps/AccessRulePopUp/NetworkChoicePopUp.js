// Protocol.js
import React, { useState, useEffect } from 'react';
import { FcGlobe } from 'react-icons/fc';
import { FaNetworkWired } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import './NetworkChoicePopUp.css'

const NetworkChoicePopUp = ({
    isOpen,
    onClose,
    handleSourceSelectItem,
    sourceselectedItems,
    addItems,
    itemsValue,
    setItemsValue
}) => {
  const items = ["External", "Internal", "Local Host"]
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleSelectCategory = (index, event) => {
    setSelectedRowIndex(index);
    handleSourceSelectItem(index, event);
  };

  const handleCancel = () => {
    setSelectedRowIndex(null);
    onClose();
  };

  useEffect(() => {
    if (selectedRowIndex !== null) {
        setItemsValue(`${items[selectedRowIndex]}`);
    }
    }, [selectedRowIndex]);

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
        <DialogTitle>Select Protocol</DialogTitle>
        <DialogContent>
            <Box sx = {{minHeight : "500px", minWidth : "500px"}}>
                <div className="networkchoice-main-items">
                    {items.map((item, index) => {
                        switch(item) {
                            case "External":
                                return (
                                    <div
                                    key={index}
                                    onClick={(event) => handleSelectCategory(index, event)}
                                    className={`item-toolbar${sourceselectedItems.has(index) ? " selected" : ""}`}
                                    >
                                    <FcGlobe/>
                                    <span style={{ marginLeft: "5px" }}>{item}</span>
                                    </div>
                                )
                            case "Internal":
                                return (
                                    <div
                                    key={index}
                                    onClick={(event) => handleSelectCategory(index, event)}
                                    className={`item-toolbar${sourceselectedItems.has(index) ? " selected" : ""}`}
                                    >
                                    <FaNetworkWired/>
                                    <span style={{ marginLeft: "5px" }}>{item}</span>
                                    </div>
                                )
                            case "Local Host":
                                return (
                                    <div
                                    key={index}
                                    onClick={(event) => handleSelectCategory(index, event)}
                                    className={`item-toolbar${sourceselectedItems.has(index) ? " selected" : ""}`}
                                    >
                                    <FaNetworkWired/>
                                    <span style={{ marginLeft: "5px" }}>{item}</span>
                                    </div>
                                )
                        } 
                    })}
                </div>
            </Box>
        </DialogContent>
      <DialogActions>
        <Button
            onClick={() => {
                addItems(itemsValue);
                handleCancel();
            }}
            >
            Add
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NetworkChoicePopUp;