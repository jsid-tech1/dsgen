# DSGen

DSGen is a single-page design-system builder. The landing page is in `index.html`; the signed-in dashboard and its views are built by `dashboard.js`. Community is added as further dashboard views by `community.js` and uses the same sidebar and shared dashboard classes.

## Authentication and server access

The current page signs users in through Firebase Authentication in the browser. Requests to private system APIs send the user's Firebase ID token in an `Authorization: Bearer` header. Each private API verifies that token server-side with Firebase Admin and derives ownership from the verified UID. The UID is never accepted from request data.

`lib/firebase-admin.js` is server-only. Keep its service account JSON and private key in Vercel environment variables only. The Firebase Web API key, OAuth client ID, and app identifiers in browser configuration are public Firebase/Google client configuration; they do not grant database access. Do not treat them as secrets or as authorization.

The `/api/auth/*` server session functions remain in the repository for the existing server-session flow, but the current page's browser Firebase Auth does not call them. Community/system APIs use Firebase ID token verification. Do not mix these mechanisms when adding protected routes.

## Data locations

- Private systems: `users/{verifiedUid}/systems/{systemId}`.
- Published Community projections: `publicSystems/{systemId}`.
- Public creator names and published-system indexes: `publicCreators/{opaqueCreatorId}`.
- Source attribution for copies is retained in the private record and, when republished, in a limited `copiedFrom` public field.

Realtime Database rules in `database.rules.json` deny all direct client reads and writes. The `indexOn` entries only support server query performance and do not grant access. Firebase Admin API operations bypass those rules, so API token verification and ownership checks are mandatory. Rules are not automatically deployed by Vercel; publish and verify them in Firebase Console or with Firebase CLI.

## System and Community APIs

Private APIs require a valid Firebase ID token:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/systems` | `GET` | List the signed-in user's systems |
| `/api/systems` | `POST` | Save a new private system |
| `/api/systems/item?id=...` | `GET` | Load a system owned by the signed-in user |
| `/api/systems/item?id=...` | `PUT` | Update a system owned by the signed-in user |
| `/api/systems/item?id=...` | `DELETE` | Delete a system owned by the signed-in user |
| `/api/systems/publish` | `POST` | Publish an owned system after client review/confirmation |
| `/api/systems/unpublish` | `POST` | Unpublish an owned system |
| `/api/community/copy` | `POST` | Create a private independent copy of a published system |

Public Community endpoints read only the allowlisted projection under `publicSystems`; they do not read a user's private systems or account profile:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/community/gallery` | `GET` | Return up to 100 published systems |
| `/api/community/system?id=...` | `GET` | Return one published system |
| `/api/community/creator?id=...` | `GET` | Return a public creator name and published systems |

Public responses exclude email, Firebase UID, private drafts, and server ownership metadata. Publication is explicit and the client presents a review/confirmation step. The server separately verifies ownership before publishing or unpublishing. Copying creates a new record under the current user's UID and does not modify the source.

Request data is bounded and validated. API errors are generic; server logs contain only an event label and safe error code. The rate limiter is best-effort per serverless function instance, not a globally coordinated anti-DDoS service. Vercel/Firebase project-level limits and monitoring should be reviewed before a large public launch.

## Environment variables

Configure these in Vercel for the relevant deployment environments. Do not commit `.env.local` or service credentials.

| Variable | Use |
| --- | --- |
| `APP_ORIGIN` | Exact production origin used to validate mutation requests |
| `GOOGLE_CLIENT_ID` | Google OAuth client identifier |
| `FIREBASE_WEB_API_KEY` | Firebase Authentication server token exchange configuration |
| `FIREBASE_DATABASE_URL` | Firebase Realtime Database URL |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Server-only Firebase service account credential JSON |

`.gitignore` excludes `.env*`, `.vercel/`, and `node_modules/`; still review Git history and repository secret scanning if credentials may have been committed previously.

## Run locally

Use Node.js 20 or later. From the repository root:

```sh
npm install
npm test
npx vercel dev
```

Vercel's local server defaults to `http://localhost:3000`. Configure the environment variables above in Vercel/local development, and authorize the local origin with Firebase/Google. The mutation origin helper accepts localhost ports 3000 and 8000 in development. Do not use a static file server; it cannot run the API functions.

The real Community gallery is empty until a signed-in user saves and explicitly publishes a system. No hard-coded public gallery examples are included.
