# Logging And Observability

Tartsi includes a lightweight but useful logging system.

## Where logs appear

- In the browser console
- In the in-application log console
- In local storage for short-term persistence across refreshes

## Why this matters

Verbose logging helps beginners understand:

- When generation starts
- Which seed produced the current result
- When exports happen
- Whether the solver needed restarts

## Extending logging

The `ApplicationLogger` class is intentionally simple so it can later be adapted to hosted tools such as Sentry, Datadog, or LogRocket without rewriting the rest of the app.
