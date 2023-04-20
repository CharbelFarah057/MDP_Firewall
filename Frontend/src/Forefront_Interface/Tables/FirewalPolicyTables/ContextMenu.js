// ContextMenu.js
import React from "react";
import "./ContextMenu.css";

const ContextMenu = ({ x, y, items }) => {
  return (
    <div
      className="context-menu"
      style={{
        position: "absolute",
        top: y,
        left: x,
        zIndex: 1000,
      }}
    >
      <ul>
        {items.map((item, index) => (
          <li key={index} onClick={item.onClick}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
