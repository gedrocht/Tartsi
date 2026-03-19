import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { expect } from "vitest";
import App from "../App";

describe("App accessibility", () => {
  it("has no obvious accessibility violations in the default view", async () => {
    const { container } = render(<App />);
    const accessibilityAuditResults = await axe(container);

    expect(accessibilityAuditResults.violations).toHaveLength(0);
  });
});
