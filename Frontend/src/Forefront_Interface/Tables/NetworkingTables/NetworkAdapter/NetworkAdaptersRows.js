//NetworkRulesRow.js
import React from "react";

const NetworkAdadptersRows = ({
row,
rowId,
selectedRows,
onRowCheckboxChange,
onRowContextMenu,
}) => {
    const {
        icon : Icon,
        disabledicon : DisabledIcon,
    } = row;

    const renderCellContent = (key, value) => {
        switch (key) {
            case "name":
                return (
                    <>
                        <Icon />
                        {row.disabled && (
                            <DisabledIcon
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