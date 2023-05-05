//FirewallPolicyRow.js
import React from "react";
import './RowRendering.css';
const RowRendering = ({
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
                  <span style={{ marginLeft: "5px" }}>
                    {value}
                  </span>
                </>
              );
            case "domains":
              return (
                <>
                <ul className="protocol-list">
                    {value.map((source_network, MultiCellIndex) => (
                    <li
                        key={MultiCellIndex} >
                        {source_network}
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
            {Object.entries(row).filter(([key]) => key !== "_id").map(([key, value]) => (
                <td key={key}
                className={ selectedRows.includes(rowId) ? "selected" : "" }
                >
                {renderCellContent(key, value)}
                </td>
            ))}
        </tr>
    );
};

export default RowRendering;