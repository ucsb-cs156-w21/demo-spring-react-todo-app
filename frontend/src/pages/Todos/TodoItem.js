import React from "react";
import { ListGroup, Button } from "react-bootstrap";

export function TodoItem({ item, index, toggleTodo, deleteTodo }) {
  return (
    <ListGroup.Item>
      <Button
        onClick={(e) => {
          e.preventDefault();
          const updatedItem = {
            ...item,
            done: !item.done,
          };
          toggleTodo(updatedItem, item.id);
        }}
        variant="link"
        style={{
          textDecorationLine: item.done ? "line-through" : "none",
          color: "black",
        }}
      >
        {item.value}
      </Button>
      <Button
        className="btn-danger float-right"
        onClick={(e) => deleteTodo(item.id)}
      >
        Delete
      </Button>
    </ListGroup.Item>
  );
}
