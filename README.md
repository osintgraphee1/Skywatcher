# SkyWatch UA v0.3 — Netlify prototype

A deployable civic-information monitoring prototype. It reads the public Telegram preview page for `@raketa_trevoga`, extracts only broad civil-alert observations, stores them in Netlify Blobs, and displays a source-attributed feed.

## Safety and data policy
This collector deliberately does **not** publish or retain live target directions, trajectories, coordinates, exact locations, or tactical movement details. It discards posts that appear to contain those details. It extracts only broad event categories and oblast-level mentions when clearly present. An observation from a Telegram channel is never treated as an official alert or confirmation.

The service is unofficial, may be delayed or unavailable, and must not replace official alerts or local authority instructions.

## Deploy to Netlify
1. Unzip this archive.
2. Create a GitHub repository and upload the contents of this folder.
3. In Netlify, choose **Add new site → Import an existing project** and connect the repository.
4. Build settings:
   - Build command: leave empty
   - Publish directory: `.`
   - Functions directory: `netlify/functions` (usually detected from `netlify.toml`)
5. Deploy.
6. Netlify will schedule `collector.mjs` every 5 minutes. The first scheduled execution may take a few minutes.
7. Open `https://YOUR-SITE.netlify.app/.netlify/functions/feed` to inspect stored observations.

No API key is needed for the public Telegram preview reader. This is best-effort access to a public web preview, not a guaranteed Telegram API. Telegram can change its markup or restrict requests.

## Local preview
The static site can be previewed with any static server, but Netlify Functions and Blobs require Netlify's runtime:
```bash
npm install
npx netlify dev
```
Scheduled functions do not automatically run during local development. Trigger the collector manually using:
```bash
curl -X POST http://localhost:8888/.netlify/functions/collector
```

## What the prototype does
- Reads `https://t.me/s/raketa_trevoga`
- Parses Telegram public preview message blocks.
- Extracts safe, broad alert-related categories and oblast mentions.
- Discards posts with likely live target direction/location details.
- Deduplicates messages by Telegram message ID.
- Stores up to 200 observations in Netlify Blobs.
- Serves a read-only JSON feed.
- Shows the feed in a responsive dark dashboard.

## Important limitations
- No AI model is connected. The parser is a transparent rule-based baseline.
- Telegram preview HTML is not a stable API. If markup changes, collection may stop.
- Netlify Scheduled Functions are best-effort and may not run at exact times.
- Netlify Blobs availability and plan limits are subject to Netlify's current terms.
- Before public launch, review Telegram terms, applicable law, privacy requirements, and Netlify plan limits.
- This project does not verify alerts against official government systems. It marks every Telegram observation as unverified.
