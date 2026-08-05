# mailofly

Official **Node.js / TypeScript** client for the [Mailofly REST API](https://docs.mailofly.com/api).

Requires **Node 18+** (global `fetch`).

> **Source of truth:** developed in the [mailofly monorepo](https://github.com/godstark82/mailofly) under `packages/npm`. This public repo is mirrored automatically on change.

## Install

```bash
npm install mailofly
```

## Usage

Initialize with your API key from [**User → API keys**](https://www.mailofly.com/user/api-keys):

```ts
import { Mailofly, MailoflyError } from "mailofly";

const client = new Mailofly({
  apiKey: process.env.MAILOFLY_API_KEY!,
  // baseUrl: "https://www.mailofly.com", // optional; default shown
});

try {
  const { data: accounts } = await client.accounts.list();
  await client.compose.send({
    account_key: "acc_…",
    subject: "Hi {{first_name}}",
    body: "<p>Thanks for signing up.</p>",
    recipients: { emails: ["you@example.com"] },
    variables: { first_name: "Alex" },
  });
} catch (e) {
  if (e instanceof MailoflyError) {
    console.error(e.status, e.error, e.detailMessage);
  }
  throw e;
}
```

### Discovery (no API key)

```ts
import { Mailofly } from "mailofly";

const meta = await Mailofly.discovery();
console.log(meta.resources);
```

### Resources

| Namespace | Methods |
|-----------|---------|
| `client.accounts` | `list`, `create`, `get`, `update`, `delete` |
| `client.contacts` | `list`, `create`, `get`, `update`, `delete` |
| `client.templates` | `list`, `create`, `get`, `update`, `delete` |
| `client.segments` | `list`, `create`, `get`, `update`, `delete`, `contacts.list/add/remove` |
| `client.campaigns` | `list`, `create`, `get`, `update`, `delete`, `runs`, `send` |
| `client.compose` | `send` |
| `client.mailLogs` | `list` |

Full request/response shapes match [`/api/v1` routes](https://docs.mailofly.com/api).

## Docs

- [SDK overview](https://docs.mailofly.com/sdks)
- [TypeScript guide](https://docs.mailofly.com/sdks/typescript)
- [API reference](https://docs.mailofly.com/api)

## Releasing

1. Bump `version` in `package.json` (and this changelog) in the **monorepo** PR.
2. Merge to `main`/`master` → GitHub Action syncs this folder to `teamredevs/mailofly-js`.
3. Publish workflow runs and publishes to npm only when the version is new.

## License

MIT
