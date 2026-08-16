# Graph Report - /home/andreuptm/Desktop/birthday-website  (2026-08-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 189 nodes · 255 edges · 22 communities (16 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 673 input · 49 output

## Graph Freshness
- Built from commit: `6c6c9f3d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Auth and Page Routing
- Birthday Visual Experience
- Project Dependencies
- TypeScript Compiler Config
- Birthday Configuration Pages
- devDependencies
- server.ts
- include
- Countdown.tsx
- package.json
- BirthdayList.tsx
- app/layout.tsx
- Next.js
- new/page.tsx
- middleware.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 14 edges
3. `requireAdmin()` - 13 edges
4. `createAdminClient()` - 12 edges
5. `createClient()` - 7 edges
6. `include` - 7 edges
7. `Birthday` - 6 edges
8. `BirthdayExperience()` - 6 edges
9. `getNextBirthday()` - 5 edges
10. `getCurrentBirthday()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `createClient()`  [EXTRACTED]
  app/page.tsx → lib/supabase/server.ts
- `AppearancePage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/appearance/page.tsx → lib/supabase/server.ts
- `BirthdayPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/birthday/page.tsx → lib/supabase/server.ts
- `LoginPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/login/page.tsx → lib/supabase/client.ts
- `POST()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/logout/route.ts → lib/supabase/server.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Static Assets** — public_file_svg, public_globe_svg, public_next_svg, public_vercel_svg, public_window_svg [EXTRACTED 1.00]

## Communities (22 total, 6 thin omitted)

### Community 0 - "Auth and Page Routing"
Cohesion: 0.17
Nodes (12): AppearancePage(), BirthdayPage(), LoginPage(), POST(), GET(), Page(), PageProps, AppearanceForm() (+4 more)

### Community 1 - "Birthday Visual Experience"
Cohesion: 0.16
Nodes (13): BirthdayExperience(), Countdown, getBirthdayDateParts(), getCountdown(), getNextBirthday(), getTheme(), getTimezoneOffset(), getTimezoneParts() (+5 more)

### Community 2 - "Project Dependencies"
Cohesion: 0.11
Nodes (19): date-fns, date-fns-tz, framer-motion, next, dependencies, date-fns, date-fns-tz, framer-motion (+11 more)

### Community 3 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "Birthday Configuration Pages"
Cohesion: 0.21
Nodes (11): Home(), CountdownValues, getBirthdayTimestamp(), getCountdown(), getCurrentBirthday(), getNextBirthday(), getTimezoneOffset(), getTimezoneParts() (+3 more)

### Community 5 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 6 - "server.ts"
Cohesion: 0.31
Nodes (10): AdminDashboard(), POST(), DELETE(), GET(), POST(), DELETE(), PUT(), RouteContext (+2 more)

### Community 7 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 8 - "Countdown.tsx"
Cohesion: 0.36
Nodes (7): Countdown(), CountdownValues, getCountdown(), getNextBirthdayTimestamp(), getTimezoneOffset(), getTimezoneParts(), Props

### Community 9 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 10 - "BirthdayList.tsx"
Cohesion: 0.40
Nodes (4): BirthdayList(), Props, DeleteBirthdayButton(), Props

### Community 11 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

## Knowledge Gaps
- **68 isolated node(s):** `PageProps`, `Countdown`, `Props`, `Theme`, `Props` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Auth and Page Routing` to `Birthday Configuration Pages`, `server.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Project Dependencies` to `package.json`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `PageProps`, `Countdown`, `Props` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Project Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._