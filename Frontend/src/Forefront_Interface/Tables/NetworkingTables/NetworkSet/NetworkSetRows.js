//NetworkSetRows.js
import React from "react";
import './NetworkSetRows.css'

const NetworkSetRows = ({
row,
rowId,
selectedRows,
onRowCheckboxChange,
onRowContextMenu,
}) => {
    const {
        icon : Icon,
        neticon : NetIcon,
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
                case "networks":
                    return (
                      <>
                        {value.length > 0 && (
                          <ul className="protocol-list">
                            {value.map((network, index) => (
                              <li key={index}>
                                {NetIcon && <NetIcon className="icon-padding" />}
                                {network}
                              </li>
                            ))}
                          </ul>
                        )}
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
                className={ selectedRows.includes(rowId) ? "selected" : "" } >
                {renderCellContent(key, value)}
                </td>
            ))}
        </tr>
    );
};

export default NetworkSetRows;