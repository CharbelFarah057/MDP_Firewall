//NetworkRulesRow.js
import React from "react";
import {TbNetwork} from 'react-icons/tb';
import { MdDisabledByDefault } from 'react-icons/md';

const NetworkAdadptersRows = ({
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
                        <TbNetwork />
                        {row.disabled && (
                            <MdDisabledByDefault
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            />
                        )}
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
                className={ selectedRows.includes(rowId) ? "selected" : "" } >
                {renderCellContent(key, value, cellIndex)}
                </td>
            ))}
        </tr>
    );
};

export default NetworkAdadptersRows;