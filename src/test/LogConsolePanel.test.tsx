import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { LogConsolePanel } from "../components/LogConsolePanel";
import { ApplicationLogger, type ApplicationLogEntry } from "../services/applicationLogger";

function createApplicationLogEntry(
  overrides: Partial<ApplicationLogEntry> = {}
): ApplicationLogEntry {
  return {
    identifier: "log-entry-1",
    createdAtIsoString: "2026-03-19T00:00:00.000Z",
    severityIdentifier: "info",
    categoryIdentifier: "test",
    messageText: "A log entry for coverage.",
    ...overrides
  };
}

describe("LogConsolePanel", () => {
  it("shows an empty-state message when there are no log entries", () => {
    render(
      <LogConsolePanel
        applicationLogEntries={[]}
        applicationLogger={new ApplicationLogger()}
      />
    );

    expect(screen.getByText(/no log entries yet/i)).toBeInTheDocument();
  });

  it("renders log entries and lets the user clear them", async () => {
    const user = userEvent.setup();
    const applicationLogger = new ApplicationLogger();
    const clearSpy = vi.spyOn(applicationLogger, "clear");

    render(
      <LogConsolePanel
        applicationLogEntries={[
          createApplicationLogEntry({
            identifier: "log-entry-1",
            contextualData: { seedPhrase: "Coverage-Seed" }
          }),
          createApplicationLogEntry({
            identifier: "log-entry-2",
            messageText: "A second log entry without contextual data."
          })
        ]}
        applicationLogger={applicationLogger}
      />
    );

    expect(screen.getByText(/a log entry for coverage/i)).toBeInTheDocument();
    expect(screen.getByText(/a second log entry without contextual data/i)).toBeInTheDocument();
    expect(screen.getByText(/coverage-seed/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear logs/i }));

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
