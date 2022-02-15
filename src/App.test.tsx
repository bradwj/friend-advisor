import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

// eslint-disable-next-line no-undef
test("renders without crashing", () => {
  const { baseElement } = render(<App />);
  // eslint-disable-next-line no-undef
  expect(baseElement).toBeDefined();
});
