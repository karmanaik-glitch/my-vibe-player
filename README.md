# Vibe Player

A personal, distraction-free music player: curated audio tracks over
AI-generated looping background videos, switchable without interrupting
playback.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add your media (the Git-driven workflow)

1. Drop audio files into `public/audio/`, videos into `public/videos/`,
   cover art into `public/covers/`.
2. Add matching entries to `src/data/database.json`:

```json
{
  "tracks": [
    { "id": "song-3", "title": "New Song", "artist": "You", "src": "/audio/song-3.mp3", "cover": "/covers/album-art.jpg" }
  ],
  "vibes": [
    { "id": "night-city", "label": "Night City", "src": "/videos/night-city.mp4" }
  ]
}
```

3. Commit and push. Vercel deploys automatically. No backend, no database,
   no admin panel — the JSON file *is* the CMS.

## What's implemented

- Independent audio/video state — switching a vibe never interrupts music
- All 5–6 vibe videos preload and crossfade on switch (opacity, ~1.2s)
- Fade-out/fade-in on track change (next/prev/select), not a hard cut
- Progress bar is draggable; seek updates playback immediately
- Volume, last track, and last vibe persist to `localStorage`
- Idle fade: the header and dock fade out after ~3s of no mouse/touch
  activity, and fade back in on movement
- Tap-to-begin gate, required because browsers block audio autoplay —
  this doubles as the play button for first launch
- Keyboard shortcuts: `Space` play/pause, `←`/`→` prev/next
- Responsive down to mobile; volume slider hides on narrow screens to
  keep the dock from crowding

## Notes on scope

This was built for a personal library (~10 tracks, 5–6 videos), so state
lives in React Context rather than a store library, and `database.json`
is queried directly rather than through a CMS. Both are fine choices at
this scale — revisit only if the library grows well past that.
