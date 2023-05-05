export const handleRuleAppliesToChange = (setRuleAppliesTo, setItems) => (e) => {
  const selectedValue = e.target.value;
  if (selectedValue === "allOutbound") {
    setRuleAppliesTo(selectedValue);
    setItems(["0,All outbound traffic"]);
  } else {
    setRuleAppliesTo(selectedValue);
    setItems([]);
  }
};

export const handleAddItem = (setItems, items, value) => {
  if (!items.includes(value)) {
    setItems([...items, value]);
  }
};

export const handleRemoveItems = (setItems, items, selectedItems, setSelectedItems) => {
  setItems(items.filter((_, index) => !selectedItems.has(index)));
  setSelectedItems(new Set());
};

export const handleSelectItem = (selectedItems, setSelectedItems, multiselection = true) => (index, event) => {
    const newSelectedItems = new Set(selectedItems);
    if (event.ctrlKey && multiselection) {
      if (newSelectedItems.has(index)) {
        newSelectedItems.delete(index);
      } else {
        newSelectedItems.add(index);
      }
    } else {
      newSelectedItems.clear();
      newSelectedItems.add(index);
    }
    setSelectedItems(newSelectedItems);
};

export const handleSavePortsPopup = (setPortsPopupData) => (data) => {
    setPortsPopupData(data);
};

export const parseItems = (items, setTcp_protocol_items, setUdp_protocol_items) => {
  let tcpData = []
  let udpData = []
  
  if (items[0] === "0,All outbound traffic") {
    setTcp_protocol_items([0]);
    setUdp_protocol_items([0]);
    return;
  } else if (items === []) {
    setTcp_protocol_items([]); setUdp_protocol_items([]);
    return;
  }

  items.forEach((item) => {
    const [port, protocol] = item.split(",");
    
    if (protocol === "tcp") {
      tcpData.push(parseInt(port))
    } else if (protocol === "udp") {
      udpData.push(parseInt(port))
    }
  });

  setTcp_protocol_items(tcpData);
  setUdp_protocol_items(udpData);
};