// MultiCellContextMenu.js
import React from "react";
import "./ContextMenu.css";

const MultiCellContextMenu = ({ x, y, items, onClose }) => {
  return (
    <div
      className="context-menu"
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1000,
      }}
    >
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={item.disabled ? "context-menu-disabled" : ""}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiCellContextMenu;
