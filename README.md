# OFFSHOT — Vertical Slice & Human-in-the-Loop (HITL) Execution Guide

This repository follows a **Vertical Slice Architecture** paired with **Human-in-the-Loop (HITL) AI automation**. Features are developed and shipped strictly **one module at a time** (end-to-end: UI → API → Database) behind feature flags to ensure a functional, deployable app at every commit.

---

## 1. Core Rule: Vertical Slice Isolation

Never build horizontal layers (e.g., "all database models first" or "all frontend UI first"). Build full end-to-end vertical slices per feature:

- `src/features/issues/` (Components, API routes, hooks, schema)
- `src/features/chat/` (WebSocket listeners, chat UI, state)
- `src/features/games/` (Canvas engines, score endpoints, XP hooks)
- `src/features/marketplace/` (Smart contract hooks, escrow routes, UI)
- `src/shared/` (Base UI components, global auth context, database connection)

> **Rule:** No feature folder may directly query or mutate another feature's database tables or internal state. Communicate across features using typed shared events or shared schemas in `src/shared/`.

---

## 2. Recommended Incremental Execution Order

To reach a functional product as fast as possible, implement feature slices in this exact sequence:

1. **Slice 1: Auth & User Onboarding** (Base identity & profile state)
2. **Slice 2: Issue Management & Voting** (Core utility loop)
3. **Slice 3: Real-Time Chat & Polls** (Community engagement layer)
4. **Slice 4: Off-Chain XP & Mini-Games** (Gamification loop)
5. **Slice 5: Web3 Onboarding & Wallet Abstraction** (Invisible crypto setup)
6. **Slice 6: Marketplace & NFT/Token Redemptions** (DeFi/DeSoc financial layer)
7. **Slice 7: Anonymized Enterprise Data Graph API** (B2B monetization layer)

---

## 3. Ticket Writing & Scoping Checklist

Before drafting or asking AI to generate a ticket, verify these constraints:

### Scope & Architecture Check
- [ ] **Single Vertical Slice:** Does this ticket address only one feature directory or shared module?
- [ ] **Line Count Limit:** Can this issue be implemented in **under 200 lines of modified code** across 1–3 files?
- [ ] **Feature Flag Guard:** Is this feature wrapped in a feature flag toggle if incomplete?
- [ ] **Correct Repository:** Is this routed to the proper repo?
  - `Core Monorepo` (Frontend / Express / Schemas)
  - `Smart Contracts` (Solidity / Foundry / Web3)
  - `AI & Data Engine` (Python / Vector Search)

### Context & Testing Requirements
- [ ] **Explicit File Targets:** Are exact file paths listed to keep AI context window narrow?
- [ ] **Deterministic Acceptance Criteria:** Are pass/fail conditions clearly defined?
- [ ] **Test First (TDD):** Must the AI write a failing unit test matching acceptance criteria before generating feature code?

---

## 4. HITL Audit & Gate Assignment

Assign a risk tier to every ticket to determine the level of human code review required:

| Risk Tier | Scope | Human Gate Requirement |
| :--- | :--- | :--- |
| **High** | Auth, Smart Contracts, Crypto Payouts, DB Migrations | Full manual line-by-line diff review, local security test, DB migration check |
| **Medium** | Backend API routes, WebSocket listeners, XP calculation | Execute local test suite, verify payload schemas, manual API test |
| **Low** | Pure UI layouts, CSS, static content, helper functions | Visual inspection, local build pass check |

---

## 5. Standard Ticket Template

Copy and paste this format when creating new tickets or prompting AI drafters:

```markdown
### Feature Module
- Target Directory: `src/features/[feature-name]/`
- Current Feature Flag: `ENABLE_[FEATURE_NAME]`

### Context Files
- `src/features/[feature]/file1.ts`
- `src/shared/schema.ts`

### Acceptance Criteria
- [ ] Requirement 1 (e.g., UI component renders state)
- [ ] Requirement 2 (e.g., API endpoint updates DB record)
- [ ] Requirement 3 (e.g., Unit test passes for failure scenario)

### Risk Tier & Review Gate
- Risk Level: [Low | Medium | High]
- Local Check Steps: [Specific commands or UI actions to test]
```

## 6. Codebase Realities & Safety Rules

- **Cross-Platform Sync:** Check if changes affect both Web (`client/`) and Native Mobile (`App.native.tsx`). Always verify mobile layout rendering when modifying shared state or API contracts.
- **Database Schema Changes:** Any modification to `shared/` or Drizzle schemas requires running `npm run db:push` / migration verification locally before opening a pull request.
- **Incremental Refactoring:** Do not move existing legacy files into `src/features/` unless required for the active ticket. Refactor opportunistically per feature slice.
- **Secrets Protocol:** Never write real API keys or Web3 RPC endpoints into ticket code or test fixtures. Maintain `.env.example` for all required environment keys.
