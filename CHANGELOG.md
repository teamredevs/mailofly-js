## 1.2.0

- Added full support and documentation for scheduled email lifecycle: `client.emails.update(id, { scheduled_at })` and `client.emails.cancel(id)`.
- Added support for `scheduled_at` / `scheduledAt` in `client.emails.send()`.
- Updated documentation links and references to `docs.mailofly.com`.

## 1.1.0

- Added `client.identities` resource for managing sending identities.
- Deprecated `client.accounts` in favor of `client.identities`.
- Added `client.emails` for Resend-compatible `/api/v1/emails` transactional sending and listing.
- Added `client.batch.send` for batch email sending.

## 0.1.1

- Point package `repository` / `bugs` URLs at [teamredevs/mailofly-js](https://github.com/teamredevs/mailofly-js).
- Docs and homepage links use docs.mailofly.com.

## 0.1.0

- Initial release: TypeScript/Node client for Mailofly REST API v1.
- Resources: accounts, contacts, templates, segments (incl. membership), campaigns (runs & send), compose, mail logs.
- `Mailofly.discovery()` for unauthenticated `GET /api/v1`.
- `MailoflyError` for API errors.
