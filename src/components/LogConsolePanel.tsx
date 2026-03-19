import type { ApplicationLogEntry, ApplicationLogger } from "../services/applicationLogger";

export interface LogConsolePanelProperties {
  applicationLogEntries: readonly ApplicationLogEntry[];
  applicationLogger: ApplicationLogger;
}

/**
 * The log panel is deliberately simple and readable. It mirrors a lightweight developer
 * console inside the app so users do not need to open browser tools just to confirm what
 * the generator is doing.
 */
export function LogConsolePanel({
  applicationLogEntries,
  applicationLogger
}: LogConsolePanelProperties) {
  return (
    <section
      className="magic-circle-card"
      aria-labelledby="application-log-title"
    >
      <div className="panel-header-row">
        <div>
          <p className="eyebrow-label">Operational visibility</p>
          <h2 id="application-log-title">Log console</h2>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() => applicationLogger.clear()}
        >
          Clear logs
        </button>
      </div>

      <div className="log-list" role="log" aria-live="polite">
        {applicationLogEntries.length === 0 ? (
          <p className="supporting-text">No log entries yet. Generate a circle to populate the log.</p>
        ) : (
          applicationLogEntries
            .slice()
            .reverse()
            .map((applicationLogEntry) => (
              <article
                className="log-entry"
                key={applicationLogEntry.identifier}
              >
                <header className="log-entry-header">
                  <span className={`log-severity log-severity-${applicationLogEntry.severityIdentifier}`}>
                    {applicationLogEntry.severityIdentifier}
                  </span>
                  <span>{applicationLogEntry.categoryIdentifier}</span>
                  <time dateTime={applicationLogEntry.createdAtIsoString}>
                    {new Date(applicationLogEntry.createdAtIsoString).toLocaleTimeString()}
                  </time>
                </header>
                <p>{applicationLogEntry.messageText}</p>
                {applicationLogEntry.contextualData !== undefined ? (
                  <pre>{JSON.stringify(applicationLogEntry.contextualData, null, 2)}</pre>
                ) : null}
              </article>
            ))
        )}
      </div>
    </section>
  );
}
