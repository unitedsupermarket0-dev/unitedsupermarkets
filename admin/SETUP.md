# Staff flyer admin

Employees sign in at **https://unitedsupermarkets.ca/admin/** and can replace only their store’s live flyer PDF.

## Accounts (location-scoped)

| Username   | Can change                                     |
|------------|------------------------------------------------|
| `london`   | `flyer/london.pdf`, `flyers/weekly-london.pdf` |
| `oakville` | `flyers/weekly-oakville.pdf`                   |

Passwords are not stored in this repo. To change one, replace the SHA-256 hash in `admin/config.js`.

Generate a new hash:

```bash
node -e "require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex')"
```

## Rules

- Preview shows the **current live** flyer.
- Staff can **replace** the PDF only — there is no delete control.
- London cannot edit Oakville, and Oakville cannot edit London.

## One-time publisher setup (each store computer)

Because this site is static GitHub Pages, publishing needs a GitHub token stored in the browser:

1. Open https://unitedsupermarkets.ca/admin/setup.html
2. Paste a fine-grained PAT for `unitedsupermarket0-dev/unitedsupermarkets`
   - **Contents:** Read and write
   - **Branch:** `main`
3. Save — token stays in that browser’s `localStorage` only

Then staff use `/admin/` with their location username and password.

## After publish

GitHub Pages usually updates within about one minute. Use **Refresh preview** on the dashboard.
