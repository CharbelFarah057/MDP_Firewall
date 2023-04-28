export const handleRuleAppliesToChange = (setRuleAppliesTo) => (e) => {
    setRuleAppliesTo(e.target.value);
};

export const handleAddItem = (setItems, items) => {
    setItems([...items, "Added"]);
};

export const handleRemoveItems = (setItems, items, selectedItems, setSelectedItems) => {
    setItems(items.filter((_, index) => !selectedItems.has(index)));
    setSelectedItems(new Set());
};

export const handleSelectItem = (selectedItems, setSelectedItems) => (index, event) => {
    const newSelectedItems = new Set(selectedItems);
    if (event.ctrlKey) {
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