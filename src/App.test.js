import { render } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import App from "./App";

test("renders the app shell without crashing", () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }))
  );
  render(<App />);
  expect(document.querySelector(".main")).toBeInTheDocument();
});
