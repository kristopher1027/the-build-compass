The spec is huge (18 feature areas). Its own closing note recommends a polished prototype with 4–6 working features over trying to ship everything. I'll follow that.

## Scope for v1

**Fully working (AI-powered via Lovable AI Gateway, model `google/gemini-2.5-flash`):**
1. **AI Cultural Assistant** — chat about Idoma history, customs, festivals, foods, rulers
2. **AI Language Tutor** — chat-based lessons, phrases, quizzes
3. **AI Translator** — English ↔ Idoma text translation with copy button
4. **AI Story Teller** — generate folktales (Kids / Teen / Adult mode)

**Static content (curated, browsable):**
5. **Historical Places** — 6–8 curated sites (Otukpo, Ojira Hills, Ogba caves, etc.) with descriptions
6. **Local Business Directory** — categorized sample listings (hotels, restaurants, artisans)
7. **Festivals** — Aje-Alekwu, Eje-Alago, etc. cards

**Landing page** — hero, mission, feature grid, culture-inspired visual identity.

## Deferred (not in v1)

Auth/roles, marketplace/checkout, tour booking, forum, leaderboard, admin dashboard, gallery, events calendar, news, Google Maps integration, voice, image generation for each site. These are large surfaces; call them out as "coming soon" or skip.

## Technical

- **Stack**: TanStack Start (already scaffolded), Tailwind v4, shadcn.
- **AI**: Enable Lovable Cloud → use AI Gateway via server function calling `https://ai.gateway.lovable.dev/v1/chat/completions` with `LOVABLE_API_KEY`. One shared `chat.functions.ts` that accepts a `system` prompt + messages, used by Assistant, Tutor, Translator, Storyteller.
- **Routes**: `/` (landing), `/assistant`, `/tutor`, `/translate`, `/stories`, `/places`, `/festivals`, `/businesses`. Each with its own `head()` meta.
- **Design system**: Idoma palette in `src/styles.css` via oklch — deep green primary (~#1B5E20), gold secondary (~#D4AF37), terracotta accent (~#A0522D), warm off-white bg. Serif display font (Fraunces) + sans body (Inter) via `<link>` in root head. Subtle geometric pattern SVG for section dividers.
- **Hero image**: generate one culturally-evocative hero image (Idoma landscape/motif) with imagegen.
- **Content data**: hardcoded TS arrays in `src/data/` for places, festivals, businesses.
- **SEO**: per-route head(), sitemap.xml + robots.txt.

## Build order

1. Enable Lovable Cloud (needed for AI Gateway key).
2. Design tokens + fonts + shared layout (header nav + footer) in `__root.tsx`.
3. Landing page (replaces placeholder index).
4. Shared `chat.functions.ts` server fn + reusable `<ChatPanel>` component.
5. Four AI feature routes.
6. Three content routes with curated data.
7. Sitemap/robots.
8. Verify build + smoke-test one AI call.

Ready to proceed?