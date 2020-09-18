import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToggleForm from "./ToggleForm";

describe("ToggleForm tests", () => {
  const item = {
    value: "todo",
    id: 1,
    userId: "123456",
    done: false,
  };

  describe("editMode false", () => {
    const editMode = false;
    const props = {
      editMode,
      item,
      updateItem: jest.fn(),
      setEditMode: jest.fn(),
    };
    test("renders without crashing", () => {
      render(<ToggleForm {...props} />);
    });
    test("hitting the edit button toggles editMode, does not update item", () => {
      const { getByText } = render(<ToggleForm {...props} />);
      userEvent.click(getByText("Edit"));
      expect(props.setEditMode).toHaveBeenCalledTimes(1);
      expect(props.setEditMode).toHaveBeenCalledWith(!editMode);
      expect(props.updateItem).toHaveBeenCalledTimes(0);
    });
  });

  describe("editMode true", () => {
    const editMode = true;
    const props = {
      editMode,
      item,
      updateItem: jest.fn(),
      setEditMode: jest.fn(),
    };
    test("renders without crashing", () => {
      render(<ToggleForm {...props} />);
    });

    test("hitting the done button updates item and toggles editMode", () => {
      const { getByText } = render(<ToggleForm {...props} />);
      userEvent.click(getByText("Done"));
      expect(props.setEditMode).toHaveBeenCalledTimes(1);
      expect(props.setEditMode).toHaveBeenCalledWith(!editMode);
      expect(props.updateItem).toHaveBeenCalledTimes(1);
      expect(props.updateItem).toHaveBeenCalledWith(props.item, props.item.id);
    });

    test("hitting the done button with empty text for todo won't trigger update or toggle editMode", () => {
      const { getByText, getByDisplayValue } = render(
        <ToggleForm {...props} />
      );
      userEvent.clear(getByDisplayValue("todo"));
      userEvent.click(getByText("Done"));
      expect(props.setEditMode).toHaveBeenCalledTimes(0);
      expect(props.updateItem).toHaveBeenCalledTimes(0);
    });
  });
});
