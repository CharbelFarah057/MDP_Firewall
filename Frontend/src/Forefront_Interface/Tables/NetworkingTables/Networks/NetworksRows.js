//NetworksRows.js
import React from "react";
import './NetworksRow.css';
import { FcGlobe } from 'react-icons/fc';
import { FaNetworkWired } from 'react-icons/fa';
import { VscSymbolEnum, VscSymbolConstant } from 'react-icons/vsc';

const NetworksRows = ({
row,
rowId,
selectedRows,
onRowCheckboxChange,
onRowContextMenu,
}) => {

    const renderCellContent = (key, value) => {
        switch (key) {
            case "name":
                return (
                    <>
                        {value === 'External' ? <FcGlobe /> : <FaNetworkWired />}
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
            case "addressRanges":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((addressrange, index) => (
                        <li key={index}>
                            {value.length > 1 ? (
                            <>
                                <VscSymbolEnum className="icon-padding" />
                                {addressrange}
                            </>
                            ) : value.length === 1 ? (
                            <>
                                <VscSymbolConstant className="icon-padding" />
                                {addressrange}
                            </>
                            ) : (
                            addressrange
                            )}
                        </li>
                        ))}
                    </ul>
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
            {Object.entries(row).filter(([key]) => !key.endsWith("icon") && key !== "id").map(([key, value]) => (
                <td key={key} 
                    className={selectedRows.includes(rowId) ? "selected" : "" } >
                {renderCellContent(key, value)}
                </td>
            ))}
        </tr>
    );
};

export default NetworksRows;