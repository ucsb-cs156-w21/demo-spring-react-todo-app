import React from "react";
import TodosNav from "main/components/Nav/TodosNav";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
jest.mock("@auth0/auth0-react");

describe("Todos Nav tests", () => {
  test("it renders the link if user is authenticated", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
    });
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <TodosNav />
      </Router>
    );
    expect(getByText("Todos")).toBeInTheDocument();
  });

  test("it does not render the link if user is not authenticated", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
    });
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <TodosNav />
      </Router>
    );
    expect(queryByText("Todos")).toBeNull();
  });
})