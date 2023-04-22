//FirewallPolicyRow.js
import React from "react";
import './FirewallPolicyRow.css'

const FirewallPolicyRow = ({
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
}) => {
    const {
        ordicon: OrderIcon,
        actionicon: ActionIcon,
        protocicon: ProtocIcon,
        fromicon: FromIcon,
        toicon: ToIcon,
        condicon: CondIcon,
    } = row;

    const isCellSelected = (cellIndex) => selectedCells.some(
        cell => cell.rowId === rowId && cell.cellIndex === cellIndex
    );

    const isProcSelected = (protocolIndex, cellIndex) => selectedMultiCellClick.some(
        multi => multi.rowId === rowId && multi.cellIndex === cellIndex && multi.protocolIndex === protocolIndex
    );

    const renderCellContent = (key, value, cellIndex) => {
        switch (key) {
            case "order":
                return (
                    <>
                        <OrderIcon />
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
            case "act":
                return (
                    <>
                        <ActionIcon />
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
            case "protoc":
                return (
                    <>
                    <ul className="protocol-list">
                        {value.map((protocol, protocolIndex) => (
                        <li
                            key={protocolIndex}
                            onClick={() => {
                                handleMultiCellClick(rowId, cellIndex, protocolIndex);
                                }}
                                className={
                                isProcSelected(protocolIndex, cellIndex) || selectedRows.includes(rowId) ? "selected-protocol" : ""
                            }
                        >
                            <ProtocIcon className="icon-padding" />
                            {protocol}
                        </li>
                        ))}
                    </ul>
                    </>
                );
            case "FL":
                return (
                    <>
                        <FromIcon />
                        <span style={{ marginLeft: "5px" }}>{value}</span>
                    </>
                );
                case "to":
                    return (
                        <>
                            <ToIcon />
                            <span style={{ marginLeft: "5px" }}>{value}</span>
                        </>
                    );
            case "cond":
                return (
                    <>
                        <CondIcon />
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
            {Object.entries(row).filter(([key]) => !key.endsWith("icon") && key !== "id").map(([key, value], cellIndex) => (
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

export default FirewallPolicyRow;