/**
 * The logging service serves three audiences at once:
 * 1. Developers reading the browser console.
 * 2. Users inspecting the in-app log console.
 * 3. Future integrations that may want to forward events to hosted logging tools.
 */

export type ApplicationLogSeverityIdentifier = "debug" | "info" | "warn" | "error";

export interface ApplicationLogEntry {
  identifier: string;
  createdAtIsoString: string;
  severityIdentifier: ApplicationLogSeverityIdentifier;
  categoryIdentifier: string;
  messageText: string;
  contextualData?: unknown;
}

type LogListener = (applicationLogEntries: readonly ApplicationLogEntry[]) => void;

const browserStorageKey = "tartsi-application-log-entries";
const maximumPersistedEntryCount = 200;

function canUseBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadPersistedLogEntries(): ApplicationLogEntry[] {
  if (!canUseBrowserStorage()) {
    return [];
  }

  const rawPersistedLogEntries = window.localStorage.getItem(browserStorageKey);

  if (rawPersistedLogEntries === null) {
    return [];
  }

  try {
    const parsedPersistedLogEntries = JSON.parse(rawPersistedLogEntries) as ApplicationLogEntry[];

    return Array.isArray(parsedPersistedLogEntries) ? parsedPersistedLogEntries : [];
  } catch {
    return [];
  }
}

function persistLogEntries(applicationLogEntries: readonly ApplicationLogEntry[]): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(browserStorageKey, JSON.stringify(applicationLogEntries));
}

export class ApplicationLogger {
  private readonly logListeners = new Set<LogListener>();

  private applicationLogEntries: ApplicationLogEntry[] = loadPersistedLogEntries();

  public getEntries(): readonly ApplicationLogEntry[] {
    return this.applicationLogEntries;
  }

  public subscribe(logListener: LogListener): () => void {
    this.logListeners.add(logListener);

    return () => {
      this.logListeners.delete(logListener);
    };
  }

  public clear(): void {
    this.applicationLogEntries = [];
    persistLogEntries(this.applicationLogEntries);
    this.broadcast();
  }

  public debug(categoryIdentifier: string, messageText: string, contextualData?: unknown): void {
    this.record("debug", categoryIdentifier, messageText, contextualData);
  }

  public info(categoryIdentifier: string, messageText: string, contextualData?: unknown): void {
    this.record("info", categoryIdentifier, messageText, contextualData);
  }

  public warn(categoryIdentifier: string, messageText: string, contextualData?: unknown): void {
    this.record("warn", categoryIdentifier, messageText, contextualData);
  }

  public error(categoryIdentifier: string, messageText: string, contextualData?: unknown): void {
    this.record("error", categoryIdentifier, messageText, contextualData);
  }

  private record(
    severityIdentifier: ApplicationLogSeverityIdentifier,
    categoryIdentifier: string,
    messageText: string,
    contextualData?: unknown
  ): void {
    const applicationLogEntry: ApplicationLogEntry = {
      identifier: `${Date.now()}-${this.applicationLogEntries.length + 1}`,
      createdAtIsoString: new Date().toISOString(),
      severityIdentifier,
      categoryIdentifier,
      messageText,
      contextualData
    };

    this.applicationLogEntries = [...this.applicationLogEntries, applicationLogEntry].slice(
      -maximumPersistedEntryCount
    );
    persistLogEntries(this.applicationLogEntries);
    this.broadcast();

    const consoleMethod =
      severityIdentifier === "error"
        ? console.error
        : severityIdentifier === "warn"
          ? console.warn
          : severityIdentifier === "debug"
            ? console.debug
            : console.info;

    consoleMethod(`[${categoryIdentifier}] ${messageText}`, contextualData);
  }

  private broadcast(): void {
    for (const logListener of this.logListeners) {
      logListener(this.applicationLogEntries);
    }
  }
}

export const sharedApplicationLogger = new ApplicationLogger();
