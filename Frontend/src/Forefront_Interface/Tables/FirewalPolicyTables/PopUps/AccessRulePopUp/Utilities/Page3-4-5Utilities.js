export const handleRuleAppliesToChange = (setRuleAppliesTo, setItems) => (e) => {
  const selectedValue = e.target.value;
  if (selectedValue === "allOutbound") {
    setRuleAppliesTo(selectedValue);
    setItems(["All outbound traffic"]);
  } else {
    setRuleAppliesTo(selectedValue);
    setItems([]);
  }
};

export const handleAddItem = (setItems, items) => {
    setItems([...items, "Added"]);
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