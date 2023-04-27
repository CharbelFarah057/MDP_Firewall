//FirewallPolicyRow.js
import React from "react";
import './AllFirewallPolicyRow.css';
import { AiOutlineNumber, AiFillCheckCircle, AiOutlineStop } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';
import { FaNetworkWired } from 'react-icons/fa';
import { MdDisabledByDefault } from 'react-icons/md';
import { FcGlobe } from 'react-icons/fc';

const AllFirewallPolicyRow = ({
row,
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
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
            case "act":
                return (
                    <>
                        {value === 'Deny' ? 
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
            case "protoc":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((protocol, MultiCellIndex) => (
                        <li
                            key={MultiCellIndex}
                            onClick={() => {
                                handleMultiCellClick(rowId, cellIndex, MultiCellIndex);
                                }}
                                onContextMenu={(event) => {
                                    event.preventDefault();
                                    onMultiCellContextMenu(event, rowId, cellIndex, MultiCellIndex, value.length);
                                }}
                                className={
                                isMultiCellSelected(MultiCellIndex, cellIndex) || selectedRows.includes(rowId) ? "selected-protocol" : ""
                            }
                        >
                            <FaNetworkWired className="icon-padding" />
                            {protocol}
                        </li>
                        ))}
                    </ul>
                    </>
                );
            case "FL":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((FL, MultiCellIndex) => (
                        <li
                            key={MultiCellIndex}
                            onClick={() => {
                                handleMultiCellClick(rowId, cellIndex, MultiCellIndex);
                                }}
                                onContextMenu={(event) => {
                                    onMultiCellContextMenu(event, rowId, cellIndex, MultiCellIndex, value.length);
                                }}
                                className={
                                isMultiCellSelected(MultiCellIndex, cellIndex) || selectedRows.includes(rowId) ? "selected-protocol" : ""
                            }
                        >
                            {FL === 'External' ? <FcGlobe className="icon-padding" /> : <FaNetworkWired className="icon-padding" />}
                            {FL}
                        </li>
                        ))}
                    </ul>
                    </>
                );
            case "to":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((To, MultiCellIndex) => (
                        <li
                            key={MultiCellIndex}
                            onClick={() => {
                                handleMultiCellClick(rowId, cellIndex, MultiCellIndex);
                            }}
                            onContextMenu={(event) => {
                                    onMultiCellContextMenu(event, rowId, cellIndex, MultiCellIndex, value.length);
                                }}
                                className={
                                isMultiCellSelected(MultiCellIndex, cellIndex) || selectedRows.includes(rowId) ? "selected-protocol" : ""
                            }
                        >
                            {To === 'External' ? <FcGlobe className="icon-padding" /> : <FaNetworkWired className="icon-padding" />}
                            {To}
                        </li>
                        ))}
                    </ul>
                    </>
                );
            case "cond":
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
            {Object.entries(row).filter(([key]) => !key.endsWith("icon") && key !== "id" && key !== "disabled").map(([key, value], cellIndex) => (
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

export default AllFirewallPolicyRow;