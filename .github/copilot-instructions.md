# Copilot Instructions for OffShot

## Commands

**Development:**
- `npm run dev` - Start Vite dev server on port 5000 (serves both API and client)
- `npm run build` - Build for production (output in `dist/`)
- `npm run preview` - Preview production build locally

**No test or lint commands are configured.** The project uses TypeScript's built-in type checking.

## Architecture

**Monorepo with three main parts:**
- **`client/`** - React SPA with Vite, routes handled by wouter
- **`server/`** - Express.js API and WebSocket server
- **`shared/`** - Zod schemas and TypeScript types used by both client and server

**Key Flow:**
1. Express serves API endpoints at `/api/*` and proxies to Vite dev server (dev mode)
2. Client imports types directly from `@shared/schema` for end-to-end type safety
3. All state changes go through React Query for server state management
4. Database: PostgreSQL with Drizzle ORM

## Path Aliases

TypeScript paths are configured in `tsconfig.json`:
- `@/*` → `client/src/*` - Use for client-side imports
- `@shared/*` → `shared/*` - Use for shared types and schemas

Example: `import { UserRole } from "@shared/schema"`

## Key Conventions

### Data Validation & Schemas
- All data is validated using Zod schemas in `shared/schema.ts`
- Never bypass schema validation; always use `insertXSchema` when creating/updating records
- Zod errors are caught and transformed using `zod-validation-error` package
- Example: `insertIssueSchema.parse(data)` or use `.safeParse()` for error handling

### Shared Schema Pattern
- Client imports types from `@shared/schema` (e.g., `UserRole`, `IssueStatus`, `Comment`)
- Server validation happens server-side before database operations
- All enums (roles, statuses, etc.) are defined in shared schema, not duplicated

### Database & ORM
- Drizzle ORM with PostgreSQL
- Schema tables defined in `shared/schema.ts`
- Storage layer in `server/storage.ts` abstracts database queries
- Database initialization and testing happens in `server/db.ts`

### React Components
- UI components are in `client/src/components/ui/` - primitives built with Radix UI + Tailwind
- Page components in `client/src/pages/` - one per route
- Custom hooks in `client/src/hooks/` - common patterns: `useAuth`, `useTheme`, `useChat`, `useXp`
- All forms use React Hook Form with Zod validation via `@hookform/resolvers/zod`

### State Management
- Use React Query (`@tanstack/react-query`) for server state in components
- Custom context hooks for client-only state (auth, theme, etc.)
- No Redux/Zustand; keep state colocated with where it's used

### File Uploads
- Profile photos and other uploads go to `server/uploads/` directory
- Uploads are served statically at `/uploads/*`

### WebSocket
- WebSocket server is created alongside HTTP server in `routes.ts`
- Used for real-time features (chat, notifications)

### Styling
- TailwindCSS with custom config in `tailwind.config.ts`
- Use `clsx` or `tailwind-merge` when conditionally combining classes
- Theme switching via `useTheme()` hook - modifies document classes

### Routing
- Client routing via `wouter` (lightweight React router)
- Routes defined in `App.tsx` using `<Switch>` and `<Route>`
- No URL parameters outside of `/:id` pattern; keep routes simple

## Common Tasks

### Adding a New Page
1. Create page component in `client/src/pages/YourPage.tsx`
2. Add route in `client/src/App.tsx` using `<Route path="/your-page" component={YourPage} />`
3. Import and use custom hooks for data (`useAuth`, React Query mutations, etc.)

### Adding an API Endpoint
1. Define Zod schema in `shared/schema.ts` (e.g., `insertYourDataSchema`)
2. Add route handler in `server/routes.ts`
3. Validate input with schema: `insertYourDataSchema.parse(req.body)`
4. Call `storage` methods or direct DB queries
5. Return JSON response

### Using Shared Types in Client
- Always import types from `@shared/schema`: `import { UserRole, Issue } from "@shared/schema"`
- Use these types for component props, hook returns, and form validation
- Never redefine types in the client; it breaks type safety

### Form Validation
- Use React Hook Form + Zod resolver
- Example:
  ```tsx
  const form = useForm({
    resolver: zodResolver(insertIssueSchema),
    defaultValues: { ... }
  });
  ```

## Database

- PostgreSQL is required
- Drizzle migrations managed in `drizzle.config.ts`
- Connection tested on server startup via `testDatabaseConnection()`
- Sample data can be seeded via scripts in `server/seed-*.ts`

## TypeScript

- Strict mode enabled
- Target is ESNext with bundler module resolution
- No `.js` files in source; everything is `.ts` or `.tsx`
- ESM only (`"type": "module"` in package.json)

## MCP Servers

**Database MCP (PostgreSQL)**
- Configured in `.github/workflows/copilot-setup-steps.yml`
- Runs PostgreSQL 16 on port 5432 during Copilot sessions
- Use for querying the database directly, introspecting schema, debugging data
- Environment: `DATABASE_URL=postgres://postgres:postgres@localhost:5432/offshot`

**Playwright MCP**
- Configured in `.github/workflows/copilot-setup-steps.yml`
- Browser automation and E2E testing
- All required dependencies and browsers installed automatically
- Use for writing tests against the running application

## Debugging Tips

- Express server logs API calls with status code and response (truncated at 80 chars)
- WebSocket connections and messages can be inspected in browser DevTools
- React Query DevTools available in dev mode (check for `@tanstack/react-query-devtools`)
- TypeScript type errors caught by IDE and at build time
