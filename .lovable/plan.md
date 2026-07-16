The current build covers the spec's own recommended "polished core" (Assistant, Tutor, Translator, Stories, Places, Festivals, Businesses, Landing). This plan fills the remaining gaps from the full spec, prioritized by hackathon impact.

## What's missing vs the spec

Auth, admin dashboard, Google Maps, marketplace, reviews, favorites, forum, events, analytics, and — most importantly — the spec's standout differentiator: a **verified Idoma knowledge base** that the AI consults before answering (RAG-style grounding).

## Scope for this pass (ordered by impact)

**1. Verified Idoma Knowledge Base + Grounded Assistant (the differentiator)**
- New `src/data/knowledge.ts`: curated entries across LGAs, clans, rulers (Och'Idoma line), historical timeline, festivals, proverbs, greetings, tourist sites, cultural practices.
- New `/knowledge` route: browsable, searchable library of these entries with categories.
- Update `chat.functions.ts` to accept optional grounding context; the Assistant retrieves top-matching entries (simple keyword scoring) and injects them into the system prompt so the AI **cites** the knowledge base. Adds a "Sources" strip under assistant replies.

**2. Authentication (Lovable Cloud)**
- Enable Lovable Cloud.
- `/auth` route with email/password sign-in and sign-up (auto-confirm on).
- `_authenticated` layout gate for user-only pages.
- Header shows Sign in / Profile menu.

**3. Simple Marketplace + Reviews + Favorites**
- Extend `/businesses` with detail routes (`/businesses/$id`) showing description, contact placeholder, reviews, and a Favorite toggle.
- `reviews` and `favorites` tables (RLS: authenticated users write their own; public read).
- Same detail pattern for `/places/$slug` (reviews + favorites).

**4. Google Maps on Places**
- Add lat/lng to `PLACES` data.
- `/places` gets an interactive map (Leaflet + OpenStreetMap tiles — no API key needed, works on Workers, keeps prototype friction-free). If the user specifically wants Google Maps, we'll swap later — flagged as an intentional deviation.

**5. Minimal Admin Dashboard**
- `user_roles` table + `has_role()` per the roles guidance.
- `_authenticated/admin` route gated by `admin` role: lists users, review counts, basic AI usage stats (row counts from an `ai_chats` log table we add for analytics).

## Deferred (explicitly out of this pass)

Forum, events calendar, full checkout/payments, image uploads, quiz scoring engine (Tutor stays chat-based), news feed. These are called out as "coming soon" in the UI.

## Technical notes

- Grounding: precompute a simple token index over `KNOWLEDGE` in-memory on the server; top-k=4 entries injected as `<context>` blocks in the system prompt with an instruction to cite entry titles.
- All new tables in one migration with `GRANT` + RLS + policies per the public-schema-grants and user-roles rules.
- No Supabase Edge Functions — use `createServerFn` and TSS server routes only.
- Maps: `react-leaflet` + `leaflet` (CSS via `<link>` in `__root.tsx` head).
- Auth-protected server fns via `requireSupabaseAuth` middleware.

## Build order

1. Knowledge base data + `/knowledge` route + grounding in `chat.functions.ts` + Assistant citations.
2. Enable Cloud → auth pages + `_authenticated` gate + header.
3. Migration: `reviews`, `favorites`, `user_roles`, `ai_chats`, roles enum, `has_role`.
4. Business/Place detail routes with reviews + favorites.
5. Leaflet map on `/places`.
6. Admin dashboard.
7. Smoke-test each: grounded chat cites a source, sign-up works, review posts, map renders, admin loads for admin role.

Ready to proceed?