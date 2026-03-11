# Testing Patterns

**Analysis Date:** 2026-03-11

## Test Framework

**Runner:**
- Not detected - No test framework is configured (vitest, jest, mocha not found)

**Assertion Library:**
- Not used - No testing infrastructure present

**Run Commands:**
- Not applicable - Testing is not implemented in current codebase

## Test File Organization

**Location:**
- Not applicable - No test files found
- Codebase contains no `.test.js`, `.spec.js`, `.test.cjs`, or `.spec.cjs` files

**Naming:**
- Not established - No test naming convention present

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not implemented

**Patterns:**
- No setup/teardown patterns observed
- No assertion patterns established
- No test fixtures in use

## Mocking

**Framework:**
- Not applicable - No mocking library detected

**Patterns:**
- Functions designed for testability through dependency injection would require:
  - `cwd` parameter passed explicitly (not accessing `process.cwd()` directly)
  - File system operations via `fs` module (readily mockable)
  - Child process calls via `execSync` wrapped in `execGit()` utility

**What to Mock:**
- File system operations (`fs.readFileSync`, `fs.writeFileSync`, `fs.existsSync`)
- Child process execution (`execSync`, `execGit()`)
- Current working directory context (pass via `cwd` parameter)

**What NOT to Mock:**
- Path manipulation utilities (deterministic, no side effects)
- String formatting and regex operations (pure functions)
- Configuration loading (can use test fixtures instead)

## Fixtures and Factories

**Test Data:**
- Not established

**Location:**
- No fixtures directory created
- Test data would naturally go in `.planning/phases/` or similar directories

**Recommended approach for future testing:**
Create fixture structure under `test/fixtures/`:
```
test/
├── fixtures/
│   ├── planning/
│   │   ├── phases/
│   │   ├── STATE.md
│   │   └── config.json
│   └── temp/
├── unit/
└── integration/
```

## Coverage

**Requirements:**
- Not enforced - No coverage targets or configuration present

**View Coverage:**
- Not applicable

## Test Types

**Unit Tests:**
- Not implemented
- Would target pure functions:
  - `normalizePhaseName()` - Phase name normalization
  - `comparePhaseNum()` - Phase number comparison logic
  - `generateSlugInternal()` - Slug generation
  - `escapeRegex()` - Regex escaping
  - `toPosixPath()` - Path conversion

**Integration Tests:**
- Not implemented
- Would target file system operations:
  - Phase directory CRUD operations
  - STATE.md reading/writing/patching
  - Config loading and merging
  - Git operations via `execGit()`

**E2E Tests:**
- Not used
- CLI commands could be tested by spawning `node gsd-tools.cjs` subprocess

## Common Patterns

**Async Testing:**
- Not applicable - No async operations in codebase
- All I/O is synchronous via `fs.readFileSync()`, `execSync()`, etc.

**Error Testing:**
- Not implemented
- Would test error path conditions:
  ```javascript
  // Example structure (not implemented)
  describe('cmdStateLoad', () => {
    it('returns empty state when STATE.md missing', () => {
      const result = cmdStateLoad(cwd, false);
      expect(result.state_exists).toBe(false);
    });

    it('calls error() when config invalid', () => {
      // Test config.json parsing failure
    });
  });
  ```

## Testing Recommendations

**Current State:**
The codebase has zero test coverage. Critical functions that *should* be tested include:

**Priority 1 (Core Logic):**
- `comparePhaseNum()` in `core.cjs` (lines 186-212) - Complex phase number comparison with decimals and letters
- `extractFrontmatter()` in `frontmatter.cjs` - YAML parsing with nested object/array support
- `normalizePhaseName()` in `core.cjs` - Phase name normalization with padding

**Priority 2 (File Operations):**
- `cmdStateUpdate()` in `state.cjs` - STATE.md field mutations
- `cmdPhaseAdd()` in `phase.cjs` - Phase directory creation
- `cmdConfigSet()` in `config.cjs` - Config nested key updates

**Priority 3 (Complex Workflows):**
- `cmdHistoryDigest()` in `commands.cjs` - Phase history aggregation
- `getMilestonePhaseFilter()` in `core.cjs` - Milestone phase filtering

**Suggested Framework:**
- **Jest** or **Vitest** for unit/integration tests
- Sync test runner preferred (no async overhead)
- Simple file fixture setup using temporary directories

**Example Test Setup Structure:**
```javascript
// test/setup.js
const fs = require('fs');
const path = require('path');
const os = require('os');

function createFixtureCwd() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-test-'));
  const planningDir = path.join(tmpDir, '.planning');
  fs.mkdirSync(planningDir, { recursive: true });
  return tmpDir;
}

// test/unit/core.test.js
const { comparePhaseNum, normalizePhaseName } = require('../../bin/lib/core.cjs');

describe('Phase Number Comparison', () => {
  it('sorts numeric phases correctly', () => {
    const result = comparePhaseNum('01', '02');
    expect(result).toBeLessThan(0);
  });

  it('handles letter suffixes', () => {
    const result = comparePhaseNum('01', '01A');
    expect(result).toBeLessThan(0);
  });

  it('handles decimal phases', () => {
    const result = comparePhaseNum('01A.1', '01A.2');
    expect(result).toBeLessThan(0);
  });
});
```

---

*Testing analysis: 2026-03-11*
