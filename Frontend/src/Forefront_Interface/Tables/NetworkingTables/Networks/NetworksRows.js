//NetworksRows.js
import React from "react";
import './NetworksRow.css'

const NetworksRows = ({
row,
rowId,
selectedRows,
onRowCheckboxChange,
onRowContextMenu,
}) => {
    const {
        icon : Icon,
        adicon : AddressRangeIcon,
    } = row;

    const renderCellContent = (key, value) => {
        switch (key) {
            case "name":
                return (
                    <>
                        <Icon />
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
            case "addressRanges":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((addressrange, index) => (
                        <li key={index}>
                            <AddressRangeIcon className="icon-padding" />
                            {addressrange}
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