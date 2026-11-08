"use client";

import { ChangeEvent, FunctionComponent, useState } from "react";

import { interpret } from "../lib/interpret";
import styles from "./page.module.css";

interface DSLExample {
  id: string;
  label: string;
  dsl: string;
}

const examples: readonly DSLExample[] = [
  {
    id: "multiply",
    label: "Simple multiplication",
    dsl: `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`,
  },
  {
    id: "divide",
    label: "Simple division",
    dsl: `{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`,
  },
  {
    id: "nested",
    label: "Nested expression",
    dsl: `{
  "expression": {
    "fn": "-",
    "a": {"fn": "-", "a": "eps", "b": "shares"},
    "b": {"fn": "-", "a": "assets", "b": "liabilities"}
  },
  "security": "CDE"
}`,
  },
  {
    id: "invalid-json",
    label: "Invalid JSON",
    dsl: `{
  "expression": {"fn": "+", "a": "price", "b": "eps"},
  "security": "BCD"
`,
  },
  {
    id: "invalid-dsl",
    label: "Invalid DSL",
    dsl: `{
  "wrong": 123,
  "security": "BCD"
}`,
  },
  {
    id: "missing-security",
    label: "Missing security",
    dsl: `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ZZZ"
}`,
  },
];

const Home: FunctionComponent = () => {
  const [expression, setExpression] = useState<string>(examples[0].dsl);
  const [output, setOutput] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setDsl = (dsl: string) => () => setExpression(dsl);

  const runQuery = () => {
    try {
      const result = interpret(expression);
      setOutput(String(Math.floor(result)));
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      setErrorMessage("There is a problem with your DSL query.");
      void error;
    }
  };

  return (
    <main className={styles.container}>
      <h1>Welcome to facts!</h1>
      <p>
        Enter the DSL query below and press the{" "}
        <strong>
          <q>run</q>
        </strong>{" "}
        button to evaluate it.
      </p>

      {/* Pre-canned Examples Section */}
      <div className={styles.section}>
        <p id="pre-canned-description">
          <strong>Pre-canned examples:</strong>
        </p>
        <nav
          className={styles.navigation}
          aria-describedby="pre-canned-description"
        >
          {examples.map(({ id, label, dsl }) => (
            <button
              type="button"
              onClick={setDsl(dsl)}
              key={id}
              data-testid={`button-${id}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* DSL Editor Section */}
      <div className={styles.section}>
        <label htmlFor="dsl-expression">DSL Expression:</label>
        <textarea
          id="dsl-expression"
          className={styles.field}
          data-testid="expression-input"
          placeholder="Enter your DSL"
          value={expression}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setExpression(e.target.value)
          }
          rows={8}
        ></textarea>
        {success && (
          <div
            className={[styles.message, styles.messageSuccess].join(" ")}
            data-testid="success-message"
          >
            DSL query ran successfully!
          </div>
        )}
        {errorMessage && (
          <div
            className={[styles.message, styles.messageError].join(" ")}
            data-testid="error-message"
          >
            {errorMessage}
          </div>
        )}
        <button data-testid="run-button" type="button" onClick={runQuery}>
          Run
        </button>
      </div>

      {/* DSL Output Section */}
      <div className={styles.section}>
        <label htmlFor="dsl-output">Output:</label>
        <textarea
          id="dsl-output"
          className={styles.field}
          data-testid="dsl-output"
          readOnly
          rows={1}
          value={output}
        ></textarea>
      </div>
    </main>
  );
};

export default Home;
