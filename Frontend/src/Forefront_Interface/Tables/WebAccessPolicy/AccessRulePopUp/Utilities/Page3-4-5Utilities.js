export const handleAddItem = (setItems, items, value) => {
  console.log(value)
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