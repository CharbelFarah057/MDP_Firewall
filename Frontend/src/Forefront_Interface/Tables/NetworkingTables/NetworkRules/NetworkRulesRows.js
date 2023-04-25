//NetworkRulesRow.js
import React from "react";
import './NetworkRulesRow.css'

const NetworkRulesRow = ({
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
    const {
        icon : Icon,
        srcicon : SrcIcon,
        dsticon : DstIcon,
        disabledicon : DisabledIcon,
    } = row;

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
                        <Icon />
                        {row.disabled && (
                            <DisabledIcon
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            />
                        )}
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
            case "srcnetworks":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((srcnetwork, MultiCellIndex) => (
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
                            <SrcIcon className="icon-padding" />
                            {srcnetwork}
                        </li>
                        ))}
                    </ul>
                    </>
                );
            case "dstnetworks":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((dstnetworks, MultiCellIndex) => (
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
                            <DstIcon className="icon-padding" />
                            {dstnetworks}
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

export default NetworkRulesRow;