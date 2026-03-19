import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { expect } from "vitest";
import App from "../App";

expect.extend(toHaveNoViolations);

describe("App accessibility", () => {
  it("has no obvious accessibility violations in the default view", async () => {
    const { container } = render(<App />);
    const accessibilityAuditResults = await axe(container);

    expect(accessibilityAuditResults).toHaveNoViolations();
  });
});

