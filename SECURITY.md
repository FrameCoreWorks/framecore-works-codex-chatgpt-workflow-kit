# Security

Do not commit secrets, private keys, credentials, raw private URLs, personal cloud folder IDs, private project context, local machine paths, generated outputs, or user-specific onboarding files.

Run before publishing:

```bash
npm run audit:privacy
npm run validate
npm test
```

The privacy audit is intentionally strict. If it blocks a release, remove the sensitive content or move the test case into a temporary fixture generated at test time.
