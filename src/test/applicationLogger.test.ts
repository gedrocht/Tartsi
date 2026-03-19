import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicationLogger, type ApplicationLogEntry } from "../services/applicationLogger";

function createPersistedApplicationLogEntry(): ApplicationLogEntry {
  return {
    identifier: "persisted-entry-1",
    createdAtIsoString: "2026-03-19T00:00:00.000Z",
    severityIdentifier: "info",
    categoryIdentifier: "persistence",
    messageText: "Persisted log entry"
  };
}

describe("ApplicationLogger", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("records entries, persists them, and routes each severity to the console", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => undefined);
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const applicationLogger = new ApplicationLogger();

    applicationLogger.debug("test", "Debug coverage");
    applicationLogger.info("test", "Info coverage");
    applicationLogger.warn("test", "Warn coverage");
    applicationLogger.error("test", "Error coverage", { severity: "high" });

    expect(applicationLogger.getEntries()).toHaveLength(4);
    expect(JSON.parse(window.localStorage.getItem("tartsi-application-log-entries") ?? "[]")).toHaveLength(4);
    expect(debugSpy).toHaveBeenCalledWith("[test] Debug coverage", undefined);
    expect(infoSpy).toHaveBeenCalledWith("[test] Info coverage", undefined);
    expect(warnSpy).toHaveBeenCalledWith("[test] Warn coverage", undefined);
    expect(errorSpy).toHaveBeenCalledWith("[test] Error coverage", { severity: "high" });
  });

  it("broadcasts updates to subscribers and clears entries", () => {
    const applicationLogger = new ApplicationLogger();
    const logListener = vi.fn();
    const unsubscribe = applicationLogger.subscribe(logListener);

    applicationLogger.info("test", "First message");
    applicationLogger.clear();
    unsubscribe();
    applicationLogger.info("test", "Second message");

    expect(logListener).toHaveBeenCalledTimes(2);
    expect(logListener).toHaveBeenNthCalledWith(1, expect.arrayContaining([expect.any(Object)]));
    expect(logListener).toHaveBeenNthCalledWith(2, []);
    expect(applicationLogger.getEntries()).toHaveLength(1);
  });

  it("loads persisted entries and ignores invalid browser storage data", () => {
    window.localStorage.setItem(
      "tartsi-application-log-entries",
      JSON.stringify([createPersistedApplicationLogEntry()])
    );

    const loggerWithPersistedEntries = new ApplicationLogger();

    expect(loggerWithPersistedEntries.getEntries()).toHaveLength(1);
    expect(loggerWithPersistedEntries.getEntries()[0]?.identifier).toBe("persisted-entry-1");

    window.localStorage.setItem("tartsi-application-log-entries", "{not valid json");

    const loggerWithInvalidStorageData = new ApplicationLogger();

    expect(loggerWithInvalidStorageData.getEntries()).toEqual([]);

    window.localStorage.setItem(
      "tartsi-application-log-entries",
      JSON.stringify({ unexpected: "object" })
    );

    const loggerWithUnexpectedStorageShape = new ApplicationLogger();

    expect(loggerWithUnexpectedStorageShape.getEntries()).toEqual([]);
  });

  it("gracefully handles environments where browser storage is unavailable", () => {
    const originalLocalStorage = window.localStorage;

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: undefined
    });

    try {
      const applicationLogger = new ApplicationLogger();

      applicationLogger.info("storage", "This should still work without local storage.");

      expect(applicationLogger.getEntries()).toHaveLength(1);
    } finally {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: originalLocalStorage
      });
    }
  });
});
