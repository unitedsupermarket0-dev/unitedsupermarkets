# Flyer publishing (Ultimate Flyer Maker → GitHub Pages)

This site receives weekly London flyer PDFs via the **GitHub Contents API** only. There is no website upload API.

## Contract

| Setting | Value |
|--------|--------|
| `GITHUB_OWNER` | `unitedsupermarket0-dev` |
| `GITHUB_REPO` | `unitedsupermarkets` |
| Branch | `main` |
| `GITHUB_FLYER_PATH` | `flyer/london.pdf` |
| `GITHUB_SITE_DOMAIN` | `unitedsupermarkets.ca` |

## Public URLs (stable every week)

- **London flyer (Flipp + website):** https://unitedsupermarkets.ca/flyer/london.pdf
- **London flyer page:** https://unitedsupermarkets.ca/flyer/london.html
- **Publish verification:** https://unitedsupermarkets.ca/flyer/test-upload.html

Only the PDF **content** changes each week; the URL stays the same.

## GitHub Pages

- Source: `main` branch, repository root (`/`)
- Custom domain: `unitedsupermarkets.ca` (`CNAME` in repo root)
- Static files under `flyer/` are served as-is after deploy (~1 minute after commit)

## GitHub token (this repo only)

Fine-grained personal access token on **unitedsupermarket0-dev/unitedsupermarkets**:

- **Contents:** Read and write
- **Branch:** `main` (recommended restriction)

## Desktop app test

1. Set `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_FLYER_PATH`, `GITHUB_SITE_DOMAIN` in Settings.
2. Job Queue → **Publish PDF…** → choose PDF → **Publish**.
3. Confirm commit on `main` updating `flyer/london.pdf`.
4. Open https://unitedsupermarkets.ca/flyer/test-upload.html → **Check live PDF** (HTTP 200).

## Success criteria

- Commit on `main` updates `flyer/london.pdf`
- https://unitedsupermarkets.ca/flyer/london.pdf returns **200** and opens the PDF
- URL unchanged week to week
