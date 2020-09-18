import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
const ToggleForm = ({ editMode, item, updateItem, setEditMode }) => {
  const [value, setValue] = useState(item.value);
  const handleSubmit = (event) => {
    event.preventDefault();
    const text = value.trim();
    const updatedItem = {
      ...item,
      value: text,
    };
    if (text) {
      updateItem(updatedItem, updatedItem.id);
      toggleEditMode();
    }
  };

  const textDecoration = !editMode && item.done ? "line-through" : "none";

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  return (
    <div>
      <Form style={{ width: "100%" }} inline onSubmit={handleSubmit}>
        <Form.Control
          style={{
            width: "90%",
            marginBottom: "10px",
            textDecoration,
          }}
          className="text-center"
          plaintext={!editMode}
          readOnly={!editMode}
          type="text"
          placeholder="todo name"
          margin="normal"
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
        <Button
          className="mb-2"
          onClick={editMode ? handleSubmit : toggleEditMode}
        >
          {editMode ? "Done" : "Edit"}
        </Button>
      </Form>
    </div>
  );
};

export default ToggleForm;
