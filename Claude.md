# CLAUDE.md — DMTA Obeya Board

## Project overview

Build a **DMTA (Design → Make → Test → Analyze) Obeya Board** — a visual management dashboard for drug discovery project teams. Next.js app deployed to **Railway**, used by computational and medicinal chemists to track compound progression through iterative design cycles.

"DMTA" is the iterative cycle: **Design** (computational chemistry, FEP+, docking, SAR hypotheses) → **Make** (synthetic chemistry routes) → **Test** (biological assays — biochemical IC₅₀, SPR, ADME panels) → **Analyze** (SAR review, model retrospectives, go/no-go decisions). The Obeya board makes this cycle visible and exposes bottlenecks.

The app launches **empty**. No seed data. Users create programs, compounds, blockers, and metrics from scratch.

---

## Visual identity — Retro sci-fi terminal aesthetic

The UI blends two iconic retro sci-fi computer interfaces:

1. **Neon Genesis Evangelion** — NERV/MAGI command center terminals. Amber-on-black CRT displays, psychographic readouts, pilot sync monitors, scan lines. Military-industrial data density.
2. **Marathon (Bungie)** — UESC colony terminal screens. Deep blue-black backgrounds, nested cyan/teal border frames, lime-green accent graphics, institutional labeling, pixelated grid patterns, coordinate readouts.

The result: a **deep blue-black void** as the base, **amber** as the primary data color, **cyan/teal** for structural framing and borders, **lime-chartreuse** for highlights and interactive accents, and **red** for alerts. It should feel like an operating terminal on a colony ship that NERV requisitioned.

### Reference points

- NERV MAGI system displays (Casper, Balthasar, Melchior)
- Eva pilot psychographic displays and sync rate monitors
- Marathon terminal screens — nested cyan rectangles, UESC colony maps, status readouts
- The institutional labeling style: `TCIU | UESC COLONY | RESTRICTED`
- Coordinate numbers, dot-matrix indicators, chunky pixel patterns

### Color palette

```css
/* === BACKGROUNDS === */
--bg-void: #050A14;              /* deepest background — near-black with blue undertone */
--bg-panel: #0A1628;             /* panel/card surfaces — dark navy */
--bg-inset: #071020;             /* inset areas, input fields */
--bg-raised: #0F1E38;           /* slightly raised elements, hover states */

/* === PRIMARY — Amber (EVA terminal data color) === */
--amber: #E8913A;                /* primary text, active data, key values */
--amber-bright: #F5C87A;        /* emphasized values, compound IDs, headers */
--amber-dim: #8B5E2A;           /* secondary text, inactive labels */
--amber-glow: rgba(232, 145, 58, 0.15);   /* panel background accent */
--amber-faint: rgba(232, 145, 58, 0.06);  /* very subtle fills */

/* === SECONDARY — Cyan/Teal (Marathon structural framing) === */
--cyan: #00D4AA;                 /* borders, frames, structural lines */
--cyan-bright: #33FFD4;         /* hover borders, active frames */
--cyan-dim: #1A6B5C;            /* subtle structural elements */
--cyan-glow: rgba(0, 212, 170, 0.12);     /* frame glow */
--cyan-faint: rgba(0, 212, 170, 0.04);    /* background hint */

/* === ACCENT — Lime/Chartreuse (Marathon highlight color) === */
--lime: #AAEE22;                 /* interactive elements, buttons, links, CTA */
--lime-dim: #5C7A1A;            /* dimmed lime for inactive interactive elements */
--lime-glow: rgba(170, 238, 34, 0.12);

/* === ALERT — Red === */
--red: #D42A2A;                  /* HIGH priority, RED blockers, danger */
--red-dim: #6B1A1A;
--red-glow: rgba(212, 42, 42, 0.15);

/* === STATUS === */
--yellow: #EFB127;               /* MEDIUM priority, AMBER severity */
--blue: #2A7BD4;                 /* LOW priority, info — used sparingly */
--green: #4CAF50;                /* resolved, success, GREEN blockers */

/* === TEXT HIERARCHY === */
--text-primary: #E8913A;         /* main readout text — amber */
--text-bright: #F5C87A;          /* emphasized — bright amber */
--text-secondary: #8B5E2A;       /* supporting — dim amber */
--text-muted: #4A3520;           /* hints, disabled */
--text-structural: #00D4AA;      /* labels that are part of the frame — cyan */
--text-label: #1A6B5C;          /* dim structural labels */
```

### Typography

**Monospace everywhere.** This is a terminal.

- **Primary font:** `"IBM Plex Mono", "Fira Code", "JetBrains Mono", "Courier New", monospace`
  - Import IBM Plex Mono from Google Fonts (weights 400, 500, 600).
- **All text is uppercase** except long-form content (descriptions, hypothesis text, blocker details). Labels, headers, column names, buttons, nav items, compound IDs — all caps.
- **Letter-spacing:** `0.1em` on labels/headers, `0.05em` on body text.
- **Font sizes:** Compact. Headers: 13–14px. Body: 12–13px. Small labels: 10–11px. Large display values: 28–32px.

### Framing system — nested border frames

The defining visual element from Marathon. Panels and major sections are framed with **nested rectangular borders in cyan**, creating depth through layered outlines.

```css
/* Double-frame effect on major sections */
.nerv-frame {
  position: relative;
  border: 1px solid var(--cyan);
  padding: 8px;
}
.nerv-frame::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid var(--cyan);
  pointer-events: none;
}

/* Corner bracket accents on panels */
.nerv-panel {
  position: relative;
  border: 1px solid rgba(0, 212, 170, 0.3);
  background: var(--bg-panel);
}
.nerv-panel::before {
  content: '';
  position: absolute;
  top: -1px; left: -1px;
  width: 14px; height: 14px;
  border-top: 2px solid var(--cyan);
  border-left: 2px solid var(--cyan);
}
.nerv-panel::after {
  content: '';
  position: absolute;
  bottom: -1px; right: -1px;
  width: 14px; height: 14px;
  border-bottom: 2px solid var(--cyan);
  border-right: 2px solid var(--cyan);
}
```

### Visual effects

1. **Scan lines overlay** — Subtle repeating gradient across the viewport:
   ```css
   .scanlines::after {
     content: '';
     position: fixed;
     inset: 0;
     background: repeating-linear-gradient(
       0deg,
       transparent,
       transparent 2px,
       rgba(0, 0, 0, 0.08) 2px,
       rgba(0, 0, 0, 0.08) 4px
     );
     pointer-events: none;
     z-index: 9999;
   }
   ```

2. **Dot-matrix grid** on kanban background:
   ```css
   background-image: radial-gradient(
     circle, rgba(0, 212, 170, 0.08) 1px, transparent 1px
   );
   background-size: 20px 20px;
   ```

3. **Amber glow** on active/hovered elements:
   ```css
   box-shadow: 0 0 8px rgba(232, 145, 58, 0.25),
               inset 0 0 4px rgba(232, 145, 58, 0.05);
   ```

4. **Cyan glow** on hovered frames:
   ```css
   box-shadow: 0 0 6px rgba(0, 212, 170, 0.2);
   ```

5. **CRT flicker** — Very subtle, header bar only:
   ```css
   @keyframes flicker {
     0%, 97%, 100% { opacity: 1; }
     98% { opacity: 0.88; }
     99% { opacity: 0.94; }
   }
   ```

6. **No rounded corners.** Sharp rectangles everywhere. Pills: `border-radius: 2px` max.

7. **Decorative coordinate readouts** — Small non-functional numbers in dim cyan at panel corners. Atmosphere only.

### Layout & spacing

- Page background: `--bg-void`.
- Panels: `--bg-panel` with cyan borders.
- Dense compact layout. Cards: `8px 12px`. Panels: `12px 16px`. Gaps: `8px` cards, `12px` panels.
- Header: full-width, `--bg-panel`, cyan bottom border. Left: `DMTA OBEYA //` cyan + program name amber. Right: cycle/week, program switcher, MAGI indicators.
- **MAGI indicators:** three blocks — `■ DESIGN  ■ SYNTH  ■ ASSAY` — lit amber if active, dim if empty.

### DMTA column styling

| Column | Header bg | Header text | Border accent |
|--------|-----------|-------------|---------------|
| DESIGN | `rgba(232, 145, 58, 0.1)` | `--amber` | `rgba(232, 145, 58, 0.3)` |
| MAKE | `rgba(0, 212, 170, 0.1)` | `--cyan` | `rgba(0, 212, 170, 0.3)` |
| TEST | `rgba(42, 123, 212, 0.1)` | `--blue` | `rgba(42, 123, 212, 0.3)` |
| ANALYZE | `rgba(212, 42, 42, 0.1)` | `--red` | `rgba(212, 42, 42, 0.3)` |

### Compound cards

- Background: `--bg-panel`, border: `1px solid rgba(0, 212, 170, 0.15)`.
- Compound ID: `--text-bright`, uppercase, monospace, 14px.
- Description: `--text-secondary`, 12px.
- Priority pills (sharp, 2px radius):
  - HIGH: `rgba(212, 42, 42, 0.2)` bg, `--red` text
  - MEDIUM: `rgba(239, 177, 39, 0.2)` bg, `--yellow` text
  - LOW: `rgba(42, 123, 212, 0.2)` bg, `--blue` text
- Days-in-stage pill: amber bg, format `D05`.
- Status pill: cyan bg.
- Hover: border brightens, amber glow.

### Forms & inputs

- Inputs: `--bg-inset`, cyan border, amber text. Focus: bright cyan border + glow.
- Buttons: outlined cyan with lime text (default), lime bg with void text (primary), red outlined (danger). All uppercase, letter-spaced.
- Links: lime, underline on hover.

### Empty states

No programs:
```
▷ DMTA OBEYA
  SYSTEM STANDBY // AWAITING INITIALIZATION

  [ INITIALIZE FIRST PROGRAM ]
```
Centered, dim amber, subtle pulse. Lime button. Cyan nested frame.

Empty column: `— NO ACTIVE COMPOUNDS —` + `[ + REGISTER ]`.

**Dark-only interface.** No light mode. No toggle.

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14+ (App Router) | `src/` dir, TypeScript, `output: 'standalone'` |
| Styling | Tailwind CSS + CSS custom properties | Dark-only theme |
| Font | IBM Plex Mono | Google Fonts, weights 400, 500, 600 |
| Database | **Railway Postgres** | Prisma with `postgresql` provider |
| ORM | Prisma | Server-side singleton |
| Drag-and-drop | `@hello-pangea/dnd` | Fork of react-beautiful-dnd |
| Auth | None | Internal tool |
| Deployment | **Railway** | Nixpacks auto-detect, standalone Next.js |

---

## Railway deployment details

Railway runs a **persistent container** (not serverless), so the app is a long-running Node.js process. This changes several things compared to Vercel.

### `next.config.js` — standalone output

Railway needs the standalone output mode so Next.js bundles everything into a minimal self-contained server:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}
module.exports = nextConfig
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "node .next/standalone/server.js",
    "postinstall": "prisma generate"
  }
}
```

Key points:
- **`build`** runs Prisma generate + migrate + Next.js build in sequence.
- **`start`** uses the standalone server, NOT `next start`. Railway calls this after build.
- **`postinstall`** ensures Prisma client is generated on `npm install`.

### `railway.toml`

Create this in the project root:

```toml
[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Health check endpoint

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

This is the one API route in the app — required for Railway's health checks.

### Database — Railway Postgres

1. In the Railway dashboard: add a **Postgres** plugin to the project.
2. Railway auto-injects `DATABASE_URL` into the service's environment when the plugin is linked. **You do not need to manually set `DATABASE_URL`** — Railway handles this.
3. The connection string format Railway provides works directly with Prisma's `postgresql` provider.
4. For local dev: copy the connection string from Railway dashboard (click the Postgres plugin → Connect → Connection URL) into a local `.env` file.

### `prisma/schema.prisma` datasource

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

No `directUrl` needed — Railway Postgres connections are direct (no connection pooler by default). If you later enable pgbouncer on Railway, add `directUrl` at that point.

### Prisma client singleton

`src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Environment variables

| Variable | Source | Notes |
|----------|--------|-------|
| `DATABASE_URL` | Auto-injected by Railway Postgres plugin | Do not set manually in Railway |
| `PORT` | Auto-injected by Railway | Next.js standalone respects this automatically |
| `NODE_ENV` | Set to `production` in Railway service settings | |

No other env vars needed for MVP.

### Static files with standalone output

Next.js `output: 'standalone'` does **not** copy the `public/` folder or `.next/static/` into the standalone directory. Railway's Nixpacks builder handles this automatically for Next.js projects. If you hit missing static asset issues, add a `Dockerfile` instead:

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

**Start with Nixpacks** (no Dockerfile needed). Only add the Dockerfile if static assets don't load.

### Deployment workflow

1. Push code to GitHub.
2. In Railway dashboard: create new project → "Deploy from GitHub repo".
3. Add Postgres plugin to the project.
4. Link the Postgres plugin to the web service (Railway auto-injects `DATABASE_URL`).
5. Set `NODE_ENV=production` in the service's variable settings.
6. Railway auto-detects Next.js, runs build, starts the standalone server.
7. First deploy runs `prisma migrate deploy` as part of the build — creates all tables.
8. Assign a domain: Railway provides `*.up.railway.app` or you can add a custom domain.

---

## Data model (Prisma schema)

`postgresql` provider. All relations scoped by `programId`.

### Program

```prisma
model Program {
  id          String   @id @default(cuid())
  name        String   @unique
  prefix      String   @unique
  description String?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  compounds         Compound[]
  blockers          Blocker[]
  designHypotheses  DesignHypothesis[]
  cycleMetrics      CycleMetric[]
  decisionMetrics   DecisionMetric[]
}
```

### Compound

```prisma
model Compound {
  id             String   @id @default(cuid())
  compoundId     String   @unique
  programId      String
  program        Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  scaffold       String
  target         String
  description    String
  stage          Stage    @default(DESIGN)
  priority       Priority @default(MEDIUM)
  daysInStage    Int      @default(0)
  stageEnteredAt DateTime @default(now())
  status         String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  blockers       Blocker[]
}

enum Stage {
  DESIGN
  MAKE
  TEST
  ANALYZE
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}
```

### Blocker

```prisma
model Blocker {
  id          String   @id @default(cuid())
  programId   String
  program     Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  title       String
  description String
  severity    Severity
  compoundId  String?
  compound    Compound? @relation(fields: [compoundId], references: [id], onDelete: SetNull)
  resolved    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Severity {
  RED
  AMBER
  GREEN
}
```

### DesignHypothesis

```prisma
model DesignHypothesis {
  id        String   @id @default(cuid())
  programId String
  program   Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  label     String
  content   String
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### CycleMetric

```prisma
model CycleMetric {
  id                   String   @id @default(cuid())
  programId            String
  program              Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  cycleNumber          Int
  weekOf               DateTime
  avgCycleTimeDays     Float
  activeCompounds      Int
  synthesisSuccessRate Float
  potencyHitRate       Float
  createdAt            DateTime @default(now())
}
```

### DecisionMetric

```prisma
model DecisionMetric {
  id        String  @id @default(cuid())
  programId String
  program   Program @relation(fields: [programId], references: [id], onDelete: Cascade)
  label     String
  target    String
  current   String?
  order     Int
}
```

---

## Page structure

### `/` — Dashboard (main Obeya board)

**1. Header bar** (full-width, `--bg-panel`, cyan bottom border, flicker animation)
- Left: `DMTA OBEYA //` in cyan + program name in bright amber.
- Right: `CYCLE 04 | WK 2026-12` in dim amber, program dropdown, MAGI indicators (`■ DESIGN  ■ SYNTH  ■ ASSAY`).
- Dropdown includes `+ INITIALIZE NEW PROGRAM` at bottom.
- No programs → header reads `DMTA OBEYA // AWAITING INITIALIZATION`.

**2. Metric cards row** (4 cards in a cyan double-frame)
- Each card: `--bg-panel`, corner brackets, decorative coordinate number.
- Label: uppercase, cyan, 11px. Value: bright amber, 28px monospace. Subtitle: dim amber, 11px.
- No data: `---` value, label reads `AWAITING DATA`.

**3. Kanban board** (4 columns in cyan double-frame, dot-matrix grid background)
- Column headers: colored per table, uppercase, monospace, with count.
- Drag-and-drop via `@hello-pangea/dnd`. On drop: update `stage`, reset `stageEnteredAt`. Optimistic UI.
- Click card → slide-over from right edge with details + inline edit.
- Empty column: `— NO ACTIVE COMPOUNDS —` + `[ + REGISTER ]`.

**4. Bottom panels** (2-column grid, each in cyan single-frame with corner brackets)
- **Left: Blockers & actions** — severity dots, title, description, `[ RESOLVE ]`. Empty: `NO ACTIVE BLOCKERS`. `[ + LOG BLOCKER ]` at bottom.
- **Right: Design hypothesis + decision metrics** — hypotheses + compact metrics table. Empty states prompt creation.

### `/programs/new` — Create program

Double-framed centered panel. Header: `▷ PROGRAM INITIALIZATION`. Fields: name, prefix (auto-uppercased, max 6), description. Submit: lime `[ INITIALIZE ]`.

### `/compounds/new?program={id}&stage={stage}` — Add compound

Header: `▷ COMPOUND REGISTRATION`. Auto-suggest ID `{PREFIX}-{NEXT_SEQ}` (zero-padded 3 digits). Fields: compound ID (editable), scaffold, target, description, stage (pre-selected), priority, status. Submit: `[ REGISTER ]`.

### `/compounds/[id]/edit` — Edit compound

Same form. Header: `▷ COMPOUND {ID} // MODIFY`. Delete: `[ DECOMMISSION ]` with confirm.

### `/blockers/new?program={id}` and `/blockers/[id]/edit`

Header: `▷ LOG IMPEDIMENT`. Fields: title, description, severity, linked compound (optional). Submit: `[ LOG ]`.

### `/settings?program={id}` — Program settings

Header: `▷ CONFIGURATION // {NAME}`. Collapsible sections:
- `PROGRAM DATA` — name, prefix, description, active toggle.
- `DESIGN HYPOTHESES` — CRUD list.
- `DECISION METRICS` — CRUD list with ordering.
- `CYCLE METRICS` — Entry form + history.

---

## First-run experience

No programs:
```
▷ DMTA OBEYA
  SYSTEM STANDBY // AWAITING INITIALIZATION

  [ INITIALIZE FIRST PROGRAM ]
```
Centered, dim amber, subtle pulse. Lime button. Cyan nested frame.

Program created, no compounds: columns visible + empty. Bottom panels show `AWAITING DATA`.

No seed data. No sample content. Blank.

---

## Key interactions

1. **Drag compound** → server action PATCH, optimistic UI, amber glow while dragging.
2. **Click card** → right slide-over with details + inline edit.
3. **"+" in column header** → `/compounds/new?stage={X}`.
4. **Resolve blocker** → server action, row fades out.
5. **Program switcher** → `?program=` param, board re-fetches.
6. **"+ INITIALIZE NEW PROGRAM"** → `/programs/new`.

---

## What NOT to build

- No auth, no users, no multi-tenancy
- No light mode (dark only)
- No real-time / WebSocket
- No external integrations
- No charts beyond the 4 metric cards
- No notifications
- No mobile layouts
- No seed data
- No rounded corners (2px max on pills)

---

## Build order

1. `npx create-next-app@latest dmta-obeya --typescript --tailwind --app --src-dir`
2. `npm install prisma @prisma/client @hello-pangea/dnd`
3. `npx prisma init --datasource-provider postgresql`
4. Write full `prisma/schema.prisma` with all models.
5. Set `output: 'standalone'` in `next.config.js`.
6. Tailwind config: extend with NERV palette, IBM Plex Mono, disable default `borderRadius`.
7. Create `src/styles/nerv.css`: CSS custom properties, scan lines, dot-matrix grid, corner brackets, frames, glows, flicker.
8. Create `src/lib/prisma.ts` singleton.
9. Create `src/app/api/health/route.ts` health check endpoint.
10. Create `railway.toml` with build/deploy config.
11. Create shared NERV components in `src/components/nerv/`.
12. Build root layout: IBM Plex Mono import, scan lines, void background.
13. Build header bar + MAGI indicators.
14. Build `/` dashboard with empty state.
15. Build `/programs/new`.
16. Build compound CRUD + kanban columns.
17. Add drag-and-drop.
18. Build slide-over for card detail view.
19. Build blocker CRUD.
20. Build `/settings`.
21. Polish: hover states, glow effects, transitions.
22. Verify `npm run build && npm run start` works locally.
23. Push to GitHub → connect Railway → add Postgres plugin → deploy.

---

## Code style

- Server components + server actions. The only API route is `/api/health`.
- `async/await`, no callbacks.
- Small composable components.
- Kebab-case files: `compound-card.tsx`, `nerv-frame.tsx`.
- Colocate with route segments.
- Prisma singleton in `src/lib/prisma.ts`.
- Server actions in `src/lib/actions/` by domain.
- Zod validation on form inputs.
- NERV UI primitives in `src/components/nerv/`.
