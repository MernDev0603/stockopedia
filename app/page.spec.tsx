import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Home from "./page";

describe("Index page", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("should set the initial value of the expression", () => {
    expect(screen.getByTestId("expression-input")).toHaveValue(`{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`);
  });

  it("should set the expression when an example button is clicked", () => {
    fireEvent.click(screen.getByTestId("button-divide"));

    expect(screen.getByTestId("expression-input")).toHaveValue(`{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`);
  });

  it('should evaluate the multiplication example when "run" is clicked', () => {
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("dsl-output")).toHaveValue("8");
    expect(screen.getByTestId("success-message")).toHaveTextContent(
      "DSL query ran successfully!",
    );
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it('should evaluate the division example when "run" is clicked', () => {
    fireEvent.click(screen.getByTestId("button-divide"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("dsl-output")).toHaveValue("0.5");
    expect(screen.getByTestId("success-message")).toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it('should evaluate the nested example when "run" is clicked', () => {
    fireEvent.click(screen.getByTestId("button-nested"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("dsl-output")).toHaveValue("-21");
    expect(screen.getByTestId("success-message")).toBeInTheDocument();
  });

  it("should show a ParseError message for malformed JSON", () => {
    fireEvent.click(screen.getByTestId("button-invalid-json"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Invalid JSON",
    );
    expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
    expect(screen.getByTestId("dsl-output")).toHaveValue("");
  });

  it("should show a ValidationError message for an invalid DSL shape", () => {
    fireEvent.click(screen.getByTestId("button-invalid-dsl"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Query must include an expression object",
    );
    expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
    expect(screen.getByTestId("dsl-output")).toHaveValue("");
  });

  it("should show a LookupError message for an unknown security", () => {
    fireEvent.click(screen.getByTestId("button-missing-security"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      'Unknown security: "ZZZ"',
    );
    expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
    expect(screen.getByTestId("dsl-output")).toHaveValue("");
  });

  it("should clear a previous error when a later run succeeds", () => {
    fireEvent.click(screen.getByTestId("button-invalid-json"));
    fireEvent.click(screen.getByTestId("run-button"));
    expect(screen.getByTestId("error-message")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-multiply"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    expect(screen.getByTestId("success-message")).toBeInTheDocument();
    expect(screen.getByTestId("dsl-output")).toHaveValue("8");
  });

  it("should clear previous output when a later run fails", () => {
    fireEvent.click(screen.getByTestId("button-multiply"));
    fireEvent.click(screen.getByTestId("run-button"));
    expect(screen.getByTestId("dsl-output")).toHaveValue("8");

    fireEvent.click(screen.getByTestId("button-missing-security"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("dsl-output")).toHaveValue("");
    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.queryByTestId("success-message")).not.toBeInTheDocument();
  });
});
