# Go Action

Shareable links that **copy text, then open any destination**.

Platforms often have no deeplink that prefills an action. The X Articles editor cannot take a title or body via URL. Go Action gives you a URL that:

1. Shows a clear intermediate page (never a silent redirect)
2. Copies the prepared text on click
3. Sends the person to the destination so they can paste

No accounts. No OAuth. No browser extension.

## Local run

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm run build
npm start -- --port 43123 --hostname 127.0.0.1
```

## X Articles example

1. On `/`, click the **X Articles** preset. Destination fills to `https://x.com/compose/articles`.
2. Add a title and body (or paste one markdown field).
3. Keep action type **Copy, then redirect**.
4. Create the link and copy the shareable URL.
5. Open that URL. Confirm the destination hostname and the clipboard preview.
6. Click **Copy & continue**. The article text is written to the clipboard, then the browser goes to the X Articles composer.
7. Paste into the editor.

The extra click is required: browsers block clipboard writes without a user gesture.

## Storage

### Zero-config: signed self-contained links

If no database env vars are set, `POST /api/links` returns `{ url }` pointing at:

```
/g?d=<base64url-payload>.<signature>
```

The payload is compact JSON (gzip when that shrinks it), HMAC-SHA256 truncated to 16 bytes, and bound to `GO_ACTION_SIGNING_SECRET` (a local default if unset).

Self-contained payloads must stay under **1500 characters**. The create form estimates size as you type and warns when the payload is too long. Gzip may still fit a slightly larger article; a 413 from the API is the hard limit.

Use this path for short clipboard text. It works on any host with no extra services.

### Long articles: Supabase

When `NEXT_PUBLIC_SUPABASE_URL` is set **and** either `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set, links are stored in the `action_links` table. `POST /api/links` returns `{ id, url }` as `/g/{id}`.

Apply `supabase/migrations/20240923120000_action_links.sql` in the SQL editor or with the Supabase CLI:

```sql
create table if not exists public.action_links (
  id text primary key,
  destination_url text not null,
  clipboard_text text,
  label text,
  action_type text not null default 'copy_then_redirect'
    check (action_type in ('copy_then_redirect', 'redirect_only')),
  created_at timestamptz not null default now()
);
```

Prefer the **service role key** on the server. If you only set the anon key, keep the RLS `select` and `insert` policies from the migration.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | No | Canonical origin for minted URLs (otherwise derived from the request) |
| `GO_ACTION_SIGNING_SECRET` | No | HMAC secret for `/g?d=` links |
| `NEXT_PUBLIC_SUPABASE_URL` | For DB | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | For DB (preferred) | Server insert/read |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For DB fallback | Used when service role is absent |

See `.env.example`.

## API

`POST /api/links`

```json
{
  "destination_url": "https://x.com/compose/articles",
  "clipboard_text": "Title\n\nBody",
  "label": "X Articles",
  "action_type": "copy_then_redirect"
}
```

- Database configured: `{ "id", "url", "storage": "supabase" }`
- Otherwise: `{ "url", "storage": "signed" }` as `/g?d=...`
- Payload too long without DB: `413` with `{ "code": "PAYLOAD_TOO_LARGE" }`

`GET /api/links/[id]` returns a database-backed link, or `404` when storage is signed-only.

`GET /api/links` returns `{ "storage": "supabase" | "signed" }`.

## Runtime

`/g/[id]` loads a stored link. `/g?d=...` decodes a signed payload. Both render the same intermediate page:

- Destination hostname
- Truncated clipboard preview
- Primary **Copy & continue** (or **Continue** for redirect-only)
- If clipboard write fails: full selectable text plus **Open destination**
