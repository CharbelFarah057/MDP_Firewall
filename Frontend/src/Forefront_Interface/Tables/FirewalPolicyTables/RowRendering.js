//FirewallPolicyRow.js
import React from "react";
import './RowRendering.css';
import { AiOutlineNumber, AiFillCheckCircle, AiOutlineStop } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';
import { FaNetworkWired, FaSlash } from 'react-icons/fa';
import { MdDisabledByDefault } from 'react-icons/md';
import { FcGlobe } from 'react-icons/fc';
import ports_protocol_dictionary from '../Data/Port_to_protocolData.json'

const RowRendering = ({
row,
dataLength,
rowId,
handleCellClick,
selectedCells,
selectedRows,
onRowCheckboxChange,
onRowContextMenu,
onCellContextMenu,
selectedMultiCellClick,
handleMultiCellClick,
onMultiCellContextMenu,
setMultiCellLength,
}) => {

    const isCellSelected = (cellIndex) => selectedCells.some(
        cell => cell.rowId === rowId && cell.cellIndex === cellIndex
    );

    const isMultiCellSelected = (MultiCellIndex, cellIndex) => selectedMultiCellClick.some(
        multi => multi.rowId === rowId && multi.cellIndex === cellIndex && multi.MultiCellIndex === MultiCellIndex
    );

    const renderCellContent = (key, value, cellIndex) => {
        switch (key) {
            case "order":
              return (
                <>
                  <AiOutlineNumber />
                  {row.disabled && (
                    <MdDisabledByDefault
                      style={{ marginLeft: "5px", marginRight: "5px" }}
                    />
                  )}
                  <span style={{ marginLeft: "5px" }}>
                    {row.order === dataLength ? "Last" : value}
                  </span>
                </>
              );
            case "action":
                return (
                    <>
                        {value === 'Drop' ? 
                        <AiOutlineStop style={{ color: 'red' }} /> : 
                        <AiFillCheckCircle style={{
                            color: 'white',
                            backgroundColor: 'green',
                            borderRadius: '50%',
                        }} />
                        }
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
            case "tcp_protocol":
              const tcp_available_keys = ["selectedProtocols", "allOutbound", "allOutboundExcept"].find(
                (key) => key in value
              );
              if (tcp_available_keys) {
                return (
                  <>
                    <ul className="protocol-list">
                      {value[tcp_available_keys].map((protocol, MultiCellIndex) => {
                        const tcp_protocolNames = ports_protocol_dictionary[protocol];
                        const tcp_displayName = tcp_protocolNames.length > 1 ? tcp_protocolNames.join(', ') : tcp_protocolNames[0];
                        return (
                          <li
                            key={MultiCellIndex}
                            onClick={() => {
                              handleMultiCellClick(rowId, cellIndex, MultiCellIndex);
                              setMultiCellLength(value[tcp_available_keys].length);
                            }}
                            onContextMenu={(event) => {
                              event.preventDefault();
                              onMultiCellContextMenu(event, rowId, cellIndex, MultiCellIndex);
                            }}
                            className={
                              isMultiCellSelected(MultiCellIndex, cellIndex) || selectedRows.includes(rowId) ? "selected-protocol" : ""
                            }
                          >
                            <div style={{ position: 'relative' }}>
                              <FaNetworkWired className="icon-padding" />
                              {tcp_available_keys === 'allOutboundExcept' && (
                                <FaSlash
                                  className="icon-padding"
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    transform: 'translate(-100%, -50%)',
                                  }}
                                />
                              )}
                              {tcp_displayName}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                );
              } else {
                return () => null;
              }                
            case "udp_protocol":
              const udp_available_keys = ["selectedProtocols", "allOutbound", "allOutboundExcept"].find(
                (key) => key in value
              );
              if (udp_available_keys) {
                return (
                  <>
                    <ul className="protocol-list">
                      {value[udp_available_keys].map((protocol, MultiCellIndex) => {
                        const udp_protocolNames = ports_protocol_dictionary[protocol];
                        const udp_displayName = udp_protocolNames.length > 1 ? udp_protocolNames.join(', ') : udp_protocolNames[0];
                        return  (
                          <li
                          key={MultiCellIndex}
                          onClick={() => {
                            handleMultiCellClick(rowId, cellIndex, MultiCellIndex);
                            setMultiCellLength(value[udp_available_keys].length);
                          }}
                          onContextMenu={(event) => {
                            event.preventDefault();
                            onMultiCellContextMenu(event, rowId, cellIndex, MultiCellIndex);
                          }}
                          className={
                            isMultiCellSelected(MultiCellIndex, cellIndex) || selectedRows.includes(rowId) ? "selected-protocol" : ""
                          }
                        >
                          <div style={{ position: 'relative' }}>
                              <FaNetworkWired className="icon-padding" />
                              {udp_available_keys === 'allOutboundExcept' && (
                                  <FaSlash
                                      className="icon-padding"
                                      style={{
                                          position: 'absolute',
                                          top: '50%',
                                          transform: 'translate(-100%, -50%)',
                                      }}
                                  />
                              )}
                            {udp_displayName}
                          </div>
                        </li>
                        );
                      })}
                    </ul>
                  </>
                );
              } else {
                return () => null;
              }
            case "source_network":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((source_network, MultiCellIndex) => (
                        <li
                            key={MultiCellIndex}
                            onClick={() => {
                                handleMultiCellClick(rowId, cellIndex, MultiCellIndex);
                                setMultiCellLength(value.length);
                                }}
                                onContextMenu={(event) => {
                                    onMultiCellContextMenu(event, rowId, cellIndex, MultiCellIndex);
                                }}
                                className={
                                isMultiCellSelected(MultiCellIndex, cellIndex) || selectedRows.includes(rowId) ? "selected-protocol" : ""
                            }
                        >
                            {source_network === 'External' ? <FcGlobe className="icon-padding" /> : <FaNetworkWired className="icon-padding" />}
                            {source_network}
                        </li>
                        ))}
                    </ul>
                    </>
                );
            case "destination_network":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((destination_network, MultiCellIndex) => (
                        <li
                            key={MultiCellIndex}
                            onClick={() => {
                                handleMultiCellClick(rowId, cellIndex, MultiCellIndex);
                                setMultiCellLength(value.length);
                            }}
                            onContextMenu={(event) => {
                                    onMultiCellContextMenu(event, rowId, cellIndex, MultiCellIndex);
                            }}
                            className={
                            isMultiCellSelected(MultiCellIndex, cellIndex) || selectedRows.includes(rowId) ? "selected-protocol" : ""
                            }
                        >
                            {destination_network === 'External' ? <FcGlobe className="icon-padding" /> : <FaNetworkWired className="icon-padding" />}
                            {destination_network}
                        </li>
                        ))}
                    </ul>
                    </>
                );
            case "condition":
                return (
                    <>
                        <FiUsers />
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
            default:
                return value;
        }
    };

    return (
        <tr onContextMenu={(event) => onRowContextMenu(event, rowId)}>
            <td>
                <input
                type="checkbox"
                checked={selectedRows.includes(rowId)}
                onChange={() => {
                onRowCheckboxChange(rowId);
                }}
                />
            </td>
            {Object.entries(row).filter(([key]) => key !== "_id" && key!=="ports").map(([key, value], cellIndex) => (
                <td key={key} 
                    onClick={() => {
                        handleCellClick(rowId, cellIndex);
                    }}
                    onContextMenu={(event) => {
                        onCellContextMenu(event, rowId, cellIndex);
                    }}
                    className={ isCellSelected(cellIndex) || selectedRows.includes(rowId) ? "selected" : "" } >
                {renderCellContent(key, value, cellIndex)}
                </td>
            ))}
        </tr>
    );
};

export default RowRendering;