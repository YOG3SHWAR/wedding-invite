# Codebase Structure

**Analysis Date:** 2026-03-11

## Current Status

This repository is initialized but contains no application code. The structure below represents the recommended directory layout for a wedding invitation application. Actual implementation may vary based on technology choices.

## Recommended Directory Layout

```
wedding-invite/
├── .claude/                    # GSD framework configuration
├── .git/                       # Version control
├── .planning/                  # Planning and design documents
│   └── codebase/              # Codebase analysis documents
├── src/                       # Primary application source code
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Page components or route handlers
│   ├── api/                   # API endpoints or server routes
│   ├── lib/                   # Shared utilities and helpers
│   ├── styles/                # Global styles and stylesheets
│   ├── types/                 # TypeScript type definitions
│   └── config/                # Configuration files
├── public/                    # Static assets
├── tests/                     # Test files (unit, integration)
├── docs/                      # Documentation
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variable template
└── README.md                 # Project documentation
```

## Anticipated Directory Purposes

**`src/components/`:**
- Purpose: Reusable React components for the invitation system
- Contains: Guest list components, RSVP forms, admin dashboard elements
- Key files: `RSVPForm.tsx`, `GuestList.tsx`, `AdminDashboard.tsx`

**`src/pages/` or `src/app/`:**
- Purpose: Page-level components or route handlers
- Contains: Guest invitation page, admin page, confirmation pages
- Key files: `[...route].tsx` or `page.tsx` (Next.js App Router pattern)

**`src/api/`:**
- Purpose: Backend API endpoints for RSVP, guest management, settings
- Contains: Route handlers for HTTP requests
- Key files: `guests/route.ts`, `rsvp/route.ts`, `settings/route.ts`

**`src/lib/`:**
- Purpose: Shared utilities, helpers, and business logic
- Contains: Database queries, email helpers, validation functions
- Key files: `db.ts`, `email.ts`, `validation.ts`, `auth.ts`

**`src/types/`:**
- Purpose: Centralized TypeScript type definitions
- Contains: Guest, RSVP, User, Settings types
- Key files: `index.ts` with exported types

**`tests/`:**
- Purpose: Unit and integration tests
- Contains: Test files co-located by feature or centralized
- Key files: `*.test.ts`, `*.spec.ts`

**`public/`:**
- Purpose: Static assets served directly
- Contains: Images, icons, fonts
- Key files: Favicon, placeholder images

## Key File Locations (Anticipated)

**Entry Points:**
- `src/pages/index.tsx` or `src/app/page.tsx`: Main guest invitation page
- `src/pages/admin/dashboard.tsx` or `src/app/admin/page.tsx`: Admin dashboard

**Configuration:**
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `.env.example`: Environment variable template
- `next.config.js` (if using Next.js)

**Core Logic:**
- `src/lib/db.ts`: Database client and queries
- `src/lib/email.ts`: Email sending service
- `src/lib/auth.ts`: Authentication logic

**Testing:**
- `tests/unit/` or co-located `.test.ts` files

## Naming Conventions (Recommended)

**Files:**
- Components: PascalCase (e.g., `RSVPForm.tsx`, `GuestCard.tsx`)
- Utilities: camelCase (e.g., `validateEmail.ts`, `sendInvitation.ts`)
- Routes: lowercase with hyphens (e.g., `guest-list.ts`, `rsvp-submit.ts`)

**Directories:**
- Feature directories: lowercase (e.g., `components/`, `api/`)
- Page routes: kebab-case (e.g., `admin-dashboard`, `guest-info`)

**Types:**
- Interfaces: PascalCase with `I` prefix (e.g., `IGuest`, `IRSVPResponse`)
- Or without prefix using PascalCase (e.g., `Guest`, `RSVPResponse`)

## Where to Add New Code

**New Feature (e.g., Meal Preferences):**
- Primary code: `src/components/MealPreferences.tsx` + `src/api/preferences/route.ts`
- Tests: `tests/preferences.test.ts`

**New Component:**
- Implementation: `src/components/[ComponentName].tsx`
- Styles: Inline or `src/components/[ComponentName].module.css`

**New Utility:**
- Shared helpers: `src/lib/[helperName].ts`
- Types for helpers: `src/types/index.ts`

**New API Endpoint:**
- Route handler: `src/api/[resource]/route.ts`
- Business logic: `src/lib/[resource].ts`

## Special Directories

**`.planning/codebase/`:**
- Purpose: Codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: No (manually maintained)
- Committed: Yes

**`.claude/`:**
- Purpose: GSD framework configuration
- Generated: During GSD setup
- Committed: Yes

**`public/`:**
- Purpose: Static assets
- Generated: No (manually created)
- Committed: Yes

## Technology Assumptions

These recommendations assume:
- **Framework:** Next.js (or similar full-stack React framework)
- **Language:** TypeScript
- **Database:** PostgreSQL or similar (connection via ORM or query builder)
- **Testing:** Jest or Vitest
- **Style:** Tailwind CSS or CSS Modules

Actual structure may vary based on final technology choices.

---

*Structure analysis: 2026-03-11*
*Note: This is a recommended template structure pending project setup and technology decisions.*
