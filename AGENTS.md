# Agent Instructions

## Stremio API Routes

The Stremio API routes located under `src/routes/api/stremio` are intended to be public.
- Ensure that the `Access-Control-Allow-Origin` header is set to `*` for all responses in these routes.
- Remove any authentication or access control mechanisms that would block any client from accessing these routes.
