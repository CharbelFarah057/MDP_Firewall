import React from "react";
import "./ContextMenu.css";

const ContextMenu = ({ x, y, items, onClose }) => {
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
          <li key={index} onClick={() => {item.onClick(); onClose();}}>
            <span className={item.checked ? "context-menu-checkmark" : ""}>
              {item.checked && "✓"}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
