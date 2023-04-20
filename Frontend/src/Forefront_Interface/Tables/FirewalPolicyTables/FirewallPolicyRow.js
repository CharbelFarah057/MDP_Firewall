//FirewallPolicyRow.js
import React from "react";

const FirewallPolicyRow = ({
row,
rowIndex,
handleCellClick,
selectedCells,
selectedRows,
onRowCheckboxChange,
onRowContextMenu,
}) => {
    const {
        order,
        name,
        act,
        protoc,
        FL,
        to,
        cond,
        desc,
        pol,
        ordicon: OrderIcon,
        actionicon: ActionIcon,
        protocicon: ProtocIcon,
        fromicon: FromIcon,
        toicon: ToIcon,
        condicon: CondIcon,
    } = row;

    const isSelected = (cellIndex) => selectedCells.some(
        (cell) => cell.rowIndex === rowIndex && cell.cellIndex === cellIndex
    );

    const renderCellContent = (key, value) => {
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
                        <ProtocIcon />
                        <span style={{ marginLeft: "5px" }}>{value}</span>
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
                    onClick={() => {handleCellClick(rowIndex, cellIndex);
                    }}
                    className={ isSelected(cellIndex) || selectedRows.includes(rowIndex) ? "selected" : "" } >
                {renderCellContent(key, value)}
                </td>
            ))}
        </tr>
    );
};

export default FirewallPolicyRow;