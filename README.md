# jornadamima.com.br - Cloudflare Worker

This Cloudflare Worker performs A/B testing by redirecting visitors from `jornadamima.com.br` to one of two subdomains: `www.jornadamima.com.br` or `loja.jornadamima.com.br`. The Worker assigns users randomly on their first visit and stores the choice in a cookie to ensure consistent experiences across sessions.

The Worker also includes several safeguards to prevent redirects in sensitive or incompatible scenarios, such as logged-in users, WordPress admin/API routes, and static asset requests.

---

## ✨ Features

- 50/50 traffic split between `www` and `loja` subdomains
- Persistent targeting using `redirect_target` cookie
- Path-preserving redirect (e.g., `/blog` remains `/blog`)
- Skips redirection for:
  - WordPress admin paths (`/wp-admin`, `/wp-login.php`)
  - WordPress REST API (`/wp-json`)
  - Static assets (`.js`, `.css`, `.png`, `.svg`, etc.)
  - Custom admin path (`/mimadminpanel`)
  - Customer dashboard (`/my-account`)
  - Logged-in WordPress users (via `wordpress_logged_in` cookie)
- Deployed via Cloudflare Workers using Wrangler

---

## 🧠 Redirection Logic

The Worker intercepts all requests to `jornadamima.com.br/*` and runs the following logic:

1. If the request includes a `wordpress_logged_in` cookie, the Worker lets it through with no redirect.
2. If the path matches any excluded prefix or file type, the Worker skips redirection.
3. If no `redirect_target` cookie is found:
   - A subdomain (`www` or `loja`) is chosen at random.
   - A cookie is set to persist the decision for 30 days.
4. The user is redirected to the chosen subdomain, with the full original path preserved.

---

## 🚀 Deployment

This project uses [Cloudflare Workers](https://developers.cloudflare.com/workers/) and [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

### Prerequisites

- Node.js installed
- A Cloudflare account
- Your domain (`jornadamima.com.br`) added and active in Cloudflare

---

### 1. Install dependencies

```bash
npm install
```

### 2. Deploy the Worker

```bash
npx wrangler deploy
```

### ⚙️ wrangler.toml Example

```toml
name = "ab-test-worker"
type = "javascript"
workers_dev = true
compatibility_date = "2024-01-01"
```

### Project structure

```
├── wrangler.toml          # Cloudflare Worker config
├── package.json           # Project metadata
└── src/
    └── index.js           # Main Worker logic
```

### 🧪 Testing the Worker

1.	Open a private/incognito window.
2.	Visit: https://jornadamima.com.br
3.	You should be redirected to either:
•	https://www.jornadamima.com.br
•	https://loja.jornadamima.com.br
4.	Refresh the page — the redirect should remain consistent.
5.	Visit https://jornadamima.com.br/wp-login.php or https://jornadamima.com.br/wp-json — no redirection should occur.
6.	Visit /my-account or /mimadminpanel — these should also bypass the redirect logic.
