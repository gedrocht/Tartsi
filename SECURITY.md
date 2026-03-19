# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately through GitHub security advisories or your organization's responsible disclosure channel. Avoid opening public issues for unpatched vulnerabilities.

## Secure development principles used in this repository

- All pull requests are expected to pass dependency review and secret scanning.
- CodeQL is configured for JavaScript and TypeScript analysis.
- Automated dependency updates are configured with Dependabot.
- Repository policy tests validate that critical governance files remain in place.
- Documentation explains how logging works so debugging does not encourage unsafe ad hoc instrumentation.

## Supported versions

This repository currently supports the `main` branch.
