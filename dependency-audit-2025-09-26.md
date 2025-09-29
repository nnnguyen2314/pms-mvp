# Dependency Audit Report — 2025-09-26

Scope: Yarn v1 workspaces in this monorepo
- Package manager: yarn@1.22.19
- Workspaces: apps/backend, apps/frontend, packages/*
- Node.js engine: >=18

Summary (from yarn audit)
- Total dependencies scanned: 558
- Vulnerabilities: critical=3, high=1, moderate=4, low=5

Top advisories and remediation
1) form-data — Critical — GHSA-fjxv-7rqg-78g4 (CVE-2025-7783)
   - Paths observed:
     - apps/frontend: axios > form-data (form-data@4.0.2)
     - apps/backend: firebase-admin > @google-cloud/* > retry-request > @types/request > form-data (form-data@2.5.3)
   - Impact: Predictable multipart boundary due to Math.random(); injection potential
   - Fixed versions: >=4.0.4 (for 4.x chain), >=2.5.4 (for 2.x transitive)
   - Recommendation: Update axios to >=1.12.0 (which updates transitive deps) and ensure transitive form-data used by Google Cloud stacks is >=2.5.4 (comes via upstream updates)

2) axios — High — GHSA-4hjh-wcwx-xvwj (CVE-2025-58754)
   - Path: apps/frontend: axios@1.8.2
   - Impact: DoS via unbounded data: URI decoding on Node adapter
   - Fixed version: >=1.12.0
   - Recommendation: Bump axios to ^1.12.0 or latest 1.x

3) on-headers — Low — GHSA-76c9-3jph-rj3q (CVE-2025-7339)
   - Path: apps/backend: morgan > on-headers@1.0.2
   - Impact: Potential response header manipulation when array passed to writeHead
   - Fixed version: >=1.1.0
   - Recommendation: Update morgan to pull patched on-headers, or pin on-headers >=1.1.0 via upstream

4) brace-expansion — Low — GHSA-v6h2-p8h4-qcjw (CVE-2025-5889)
   - Paths: dev tree via eslint/minimatch and ts-node-dev > rimraf > glob > minimatch
   - Versions seen vulnerable: 1.1.11
   - Fixed versions: >=1.1.12 (or >=2.0.2 / >=3.0.1 / >=4.0.1 for other majors)
   - Recommendation: Update eslint/ts-node-dev/minimatch chains (dev tooling) — usually resolved by updating eslint stack.

5) @eslint/plugin-kit — Low — GHSA-xffm-g5w8-qvg7
   - Path: apps/backend: eslint > @eslint/plugin-kit@0.2.7
   - Impact: ReDoS in ConfigCommentParser
   - Fixed version: >=0.3.4
   - Recommendation: Update eslint to latest 9.x (brings patched plugin-kit)

Available updates (non-major focus)
Legend: Patch = green, Minor = yellow, Major = red (skipped/batched)

apps/backend
- express: 5.0.1 -> 5.1.0 (minor)
- morgan: 1.9.1 -> 1.10.1 (minor) [brings on-headers >=1.1.0]
- debug: 4.4.0 -> 4.4.3 (patch)
- dotenv: 16.4.7 -> 16.6.1 (patch) [latest is 17.x major — skip for now]
- firebase-admin: 13.2.0 -> 13.5.0 (minor)
- typescript: 5.8.2 -> 5.9.2 (minor)
- @types/* and dev toolchain: multiple patch/minor bumps available

apps/frontend
- axios: 1.8.2 -> 1.12.2 (minor) [Fixes CVE-2025-58754; likely also pulls form-data >=4.0.4]
- @mui/material: 6.4.7 -> 6.5.0 (minor) [Latest 7.x major exists — skip major]
- @reduxjs/toolkit: 2.6.1 -> 2.9.0 (minor)
- next: 15.5.4 (no newer major shown here; eslint-config-next latest 15.5.4)
- react / react-dom: 19.0.0 -> 19.1.1 (minor)
- tailwindcss: 4.0.12 -> 4.1.13 (minor)
- typescript: 5.8.2 -> 5.9.2 (minor)
- eslint and plugins: multiple patch/minor bumps

packages/* (shared toolchains)
- prettier: 3.5.3 -> 3.6.2 (patch)
- turbo: 2.4.4 -> 2.5.8 (minor)
- eslint-related: patch/minor increments

Potential majors (batched/skipped for now) and breaking changes
- @mui/material: 6.x -> 7.x: MUI v7 contains breaking theme and component API changes; requires migration guide.
- firebase: 11.x -> 12.x: Firebase web SDK v12 includes modular changes and potential API differences in compat paths.
- dotenv: 16.x -> 17.x: ESM and loading behavior nuances; verify breaking notes before bumping.
- TypeScript: stayed within 5.x; 6.x would be a major with breaking flags — not proposed.

Recommended remediation plan (safe, non-breaking)
1) apps/frontend
   - Bump axios to ^1.12.2 (fixes CVE-2025-58754 and pulls form-data >=4.0.4)
   - Bump react/react-dom to ^19.1.1
   - Bump @reduxjs/toolkit to ^2.9.0
   - Bump tailwindcss to ^4.1.13
   - Bump @mui/material to ^6.5.0
   - Dev tooling (eslint, typescript, prettier) to suggested minor/patch

2) apps/backend
   - Bump morgan to ^1.10.1 (pulls on-headers >=1.1.0)
   - Bump debug to ^4.4.3
   - Bump dotenv to ^16.6.1
   - Bump firebase-admin to ^13.5.0 (may refresh transitive form-data in @types/request chain)
   - Keep express within 5.x (5.1.0 available minor)
   - Dev tooling updates as listed

3) packages/*
   - Update turbo to ^2.5.8, prettier to ^3.6.2, and eslint toolchain to latest patch/minor

Validation steps (post-update)
- Install: yarn install
- Lint/build: yarn lint && yarn build (root runs turbo across workspaces)
- Backend: yarn workspace pms-mvp-backend build && smoke run dev env
- Frontend: yarn workspace pms-mvp-frontend build && next start smoke
- Run `yarn audit` again and regenerate this report

Notes
- No automatic major upgrades are included in this proposal; they should be planned with migration guides and integration testing.
- Many vulnerabilities stem from dev tooling chains and will be resolved by routine eslint/TS bumps.

Appendix: raw audit highlights
- axios@1.8.2 — GHSA-4hjh-wcwx-xvwj — High — fixed in 1.12.0+
- form-data@4.0.2 — GHSA-fjxv-7rqg-78g4 — Critical — fixed in 4.0.4+
- form-data@2.5.3 — GHSA-fjxv-7rqg-78g4 — Critical — fixed in 2.5.4+
- on-headers@1.0.2 — GHSA-76c9-3jph-rj3q — Low — fixed in 1.1.0+
- @eslint/plugin-kit@0.2.7 — GHSA-xffm-g5w8-qvg7 — Low — fixed in 0.3.4+
- brace-expansion@1.1.11 — GHSA-v6h2-p8h4-qcjw — Low — fixed in 1.1.12+

—
Generated on 2025-09-26 by automated workspace audits (yarn audit, yarn outdated).