//FirewallPolicyRow.js
import React from "react";
import './FirewallPolicyRow.css'

const FirewallPolicyRow = ({
row,
rowIndex,
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
        cell => cell.rowIndex === rowIndex && cell.cellIndex === cellIndex
    );

    const isProcSelected = (protocolIndex, cellIndex) => selectedMultiCellClick.some(
        multi => multi.rowIndex === rowIndex && multi.cellIndex === cellIndex && multi.protocolIndex === protocolIndex
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
                                handleMultiCellClick(rowIndex, cellIndex, protocolIndex);
                                }}
                                className={
                                isProcSelected(protocolIndex, cellIndex) || selectedRows.includes(rowIndex) ? "selected-protocol" : ""
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
        <tr onContextMenu={(event) => onRowContextMenu(event, rowIndex)}>
            <td>
                <input
                type="checkbox"
                checked={selectedRows.includes(rowIndex)}
                onChange={() => {
                onRowCheckboxChange(rowIndex);
                }}
                />
            </td>
            {Object.entries(row).filter(([key]) => !key.endsWith("icon")).map(([key, value], cellIndex) => (
                <td key={key} 
                    onClick={() => {
                        handleCellClick(rowIndex, cellIndex);
                    }}
                    onContextMenu={(event) => {
                        onCellContextMenu(event, rowIndex, cellIndex);
                    }}
                    className={ isCellSelected(cellIndex) || selectedRows.includes(rowIndex) ? "selected" : "" } >
                {renderCellContent(key, value, cellIndex)}
                </td>
            ))}
        </tr>
    );
};

export default FirewallPolicyRow;