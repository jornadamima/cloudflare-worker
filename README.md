# jornadamima.com.br - Cloudflare Worker

This Cloudflare Worker performs A/B testing by redirecting visitors from `jornadamima.com.br` to one of two subdomains: `www.jornadamima.com.br` or `loja.jornadamima.com.br`. The Worker assigns users randomly on their first visit and stores the choice in a cookie to ensure consistent experiences across sessions.

---

## ✨ Features

- 50/50 traffic split between `www` and `loja` subdomains
- Persistent targeting using `redirect_target` cookie
- Path-preserving redirect (e.g., `/blog` remains `/blog`)
- Skips redirection for WordPress admin/API routes and static assets
- Deployed via Cloudflare Workers using Wrangler

---

## 🚀 How It Works

1. A user visits `https://jornadamima.com.br`.
2. The Worker checks for the `redirect_target` cookie.
3. If none exists, it randomly selects either `www` or `loja`, sets the cookie, and redirects the user.
4. On future visits, the user is redirected to the same subdomain consistently.
5. Requests to `/wp-admin`, `/wp-json`, `/wp-login.php`, and static files (`.js`, `.css`, `.png`, etc.) are **not redirected**.

---

## 🛠 Deployment

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
