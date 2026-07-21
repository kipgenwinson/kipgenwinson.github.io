# Winson Kipgen · Encofarms — website

A visual, Markdown-editable [Jekyll](https://jekyllrb.com/) site for GitHub Pages.
Built around Winson Kipgen (the leader), with a dedicated project page for
Encofarms Foundation / ALSIPOP and a Facebook-style **Field Notes** timeline.

---

## Deploy to GitHub Pages (5 minutes)

1. Create a new repository and copy everything in this folder into it.
2. If your site lives at **`https://<username>.github.io/<repo>/`**, open `_config.yml`
   and set `baseurl: "/<repo>"`. For a root domain (e.g. `encofarms.org`) leave it `""`.
3. Push to the `main` branch.
4. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pick `main` / `root`, save.
5. Wait a minute; your site is live.

### Preview locally (optional)
```bash
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```

---

## Editing content — no HTML needed

Everything is driven by simple files:

| What you want to change            | Edit this file                    |
|------------------------------------|-----------------------------------|
| Name, role, bio, affiliations, contacts, focus areas | `_data/leader.yml` |
| Impact numbers & recognition/awards | `_data/impact.yml`               |
| Project text, programmes, crops     | `_data/project.yml`              |
| Project page layout/headings        | `project.html`                   |
| The hero headline area              | `_includes/hero.html`            |

Add a **portrait of Winson** by saving it as `assets/img/winson.jpg`
(and keep the `photo:` line in `_data/leader.yml`). This same photo powers
the **hero** on the home page and the avatar on Field Notes. Until you add it,
a "WK" monogram shows in its place. A portrait (4:5, taller than wide) works best.

---

## Posting a Field Note (the Facebook-style feed)

You have two ways:

### A. Use the built-in composer (recommended)
1. Visit **`/post/`** on the live site.
2. Type your text, drag in photos (they’re **compressed in your browser** to ~1600px JPEG),
   and paste a YouTube link if you have one.
3. Click **Generate post file**, download each photo into `assets/updates/`,
   and save the generated text as a new file in `_updates/`.
4. Commit & push — the post appears at the top of Field Notes.

### B. Write the Markdown by hand
Create a file like `_updates/2026-08-01-my-update.md`:

```yaml
---
date: 2026-08-01
place: "Ukhrul, Manipur"          # optional
images:                            # optional
  - /assets/updates/2026-08-01-1.jpg
  - /assets/updates/2026-08-01-2.jpg
youtube_id: "dQw4w9WgXcQ"          # optional — just the 11-char video id
tags:                              # optional
  - harvest
---
Your update text here. **Markdown** and [links](https://encofarms.org) work.
```

Posts sort newest-first automatically. Photos should go in `assets/updates/`.

---

## Notes
- Palette: cream `#FFF9E9`, olive green `#5A8100`, amber `#FFB400`, orange `#FF6C02`.
- Type: Baloo 2 (display), DM Sans (body), Fraunces (serif accent) — loaded from Google Fonts.
- Image compression happens client-side; no server or database is required.
- Respects `prefers-reduced-motion` (leaves and reveals turn off).
