//RoutingRow.js
import React from "react";
import './RoutingRow.css'

const RoutingRow = ({
row,
rowId,
selectedRows,
onRowCheckboxChange,
}) => {

    const renderCellContent = (value) => {
        return value; }

    return (
        <tr>
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
                <td key = {key} className={ selectedRows.includes(rowId) ? "selected" : "" } >
                {renderCellContent(value)}
                </td>
            ))}
        </tr>
    );
};

export default RoutingRow;