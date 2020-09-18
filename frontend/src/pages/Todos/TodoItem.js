import React, { useState } from "react";
import { ListGroup, Button, Row, Col } from "react-bootstrap";
import CheckboxButton from "./CheckboxButton";
import ToggleForm from "./ToggleForm";

export function TodoItem({ item, index, updateTodo, deleteTodo }) {
  const [editMode, setEditMode] = useState(false);
  const backgroundColor = item.done ? "#ddd" : "#fff";

  return (
    <ListGroup.Item style={{ backgroundColor }}>
      <Row>
        <Col md={1}>
          <CheckboxButton item={item} toggle={updateTodo} />
        </Col>
        <Col md={10}>
          <ToggleForm
            item={item}
            editMode={editMode}
            updateItem={updateTodo}
            setEditMode={setEditMode}
          />
        </Col>

        <Col md={1}>
          <Button className="btn-danger" onClick={(e) => deleteTodo(item.id)}>
            Delete
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}
