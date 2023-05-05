// Protocol.js
import React, { useState, useEffect, useCallback } from 'react';
import {AiOutlineFolder} from 'react-icons/ai';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import searchIcon from "../../../../../Images/search-magnifying-glass.svg";
import closeIcon from "../../../../../Images/cross-close.svg";
import Authentication from '../../../Data/Authentication.json'
import CommonProtocols from '../../../Data/commonProtocol.json'
import data from '../../../Data/data.json'
import Infrastructure from '../../../Data/Infrastructure.json'
import InstantMessaging from '../../../Data/instantMessaging.json'
import IPv6Infrastructure from '../../../Data/ipv6Infrastructure.json'
import Mail from '../../../Data/mail.json'
import RemoteTerminal from '../../../Data/remoteTerminal.json'
import ServerProtocols from '../../../Data/serverProtocols.json'
import StreamingMedia from '../../../Data/streamingMedia.json'
import VPNandIPsec from '../../../Data/vpnAndIPsec.json'
import Web from '../../../Data/web.json'
import { filterRows } from '../../TableUtilities';
import './ChoseProtocol.css'

const ChoseProtocol = ({
    isOpen,
    onClose,
    handleFolderSelectItem,
    folderselectedItems,
    addItems,
    itemsValue,
    setItemsValue
}) => {
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

  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
  };

  const handleSelectCategory = (index, event) => {
    handleFolderSelectItem(index, event);
    setSelectedCategory(index);
  };

  const getTableData = useCallback(() => {
    let table_data = [];
    switch (selectedCategory) {
      case 0:
        table_data = CommonProtocols;
        break;
      case 1:
        table_data = Infrastructure;
        break;
      case 2:
        table_data = Mail;
        break;
      case 3:
        table_data = InstantMessaging;
        break;
      case 4:
        table_data = RemoteTerminal;
        break;
      case 5:
        table_data = StreamingMedia;
        break;
      case 6:
        table_data = VPNandIPsec;
        break;
      case 7:
        table_data = Web;
        break;
      case 8:
        table_data = Authentication;
        break;
      case 9:
        table_data = ServerProtocols;
        break;
      case 10:
        table_data = IPv6Infrastructure;
        break;
      case 11:
        table_data = data;
        break;
      default:
        table_data = [];
        break
      }
    return filterRows(table_data, inputValue)
  }, [selectedCategory, inputValue]);

  useEffect(() => {
    setTableData(getTableData());
  }, [selectedCategory, inputValue, getTableData]);

  const handleCancel = () => {
    setInputValue('');
    setSelectedCategory(0);
    setSelectedRowIndex(null);
    onClose();
  };

  useEffect(() => {
    if (selectedRowIndex !== null && tableData.length > 0) {
      const selectedRow = tableData[selectedRowIndex];
      setItemsValue(`${selectedRow.Port},${selectedRow.Protocol}`);
    }
  }, [selectedRowIndex, tableData]);

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
    <DialogTitle>Select Protocol</DialogTitle>
    <DialogContent>
    <Box sx = {{minHeight : "500px"}}>
        <div className="tool-bar-container">
          {inputValue ? (
            <img
              src={closeIcon}
              alt="Clear"
              className="icon close-icon"
              onClick={handleClear}
            />
          ) : (
            <img src={searchIcon} alt="Search" className="icon search-icon" />      )}
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={inputValue}
            onChange={handleChange}
          />
        </div>
        <div className="main-container">
        <div className="main-items">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={(event) => handleSelectCategory(index, event)}
              className={`item-toolbar${folderselectedItems.has(index) ? " selected" : ""}`}
              >
              <AiOutlineFolder/>
              <span style={{ marginLeft: "5px" }}>{item}</span>
            </div>
          ))}
        </div>
        <div className="protocol-table-container">
          <table className="protocol-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Port</th>
                <th>Protocol</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => (
                <tr
                  key={index}
                  className={selectedRowIndex === index ? "toolbar-selected-row" : ""}
                  onClick={() => setSelectedRowIndex(selectedRowIndex === index ? null : index)}
                >
                  <td>{data.Name}</td>
                  <td>{data.Port}</td>
                  <td>{data.Protocol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default ChoseProtocol;