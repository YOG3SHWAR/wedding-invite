# Coding Conventions

**Analysis Date:** 2026-03-11

## Naming Patterns

**Files:**
- CommonJS modules: `.cjs` extension (e.g., `core.cjs`, `state.cjs`, `phase.cjs`)
- All modules are lowercase with hyphens separating words for CLI tools (e.g., `gsd-tools.cjs`)
- Configuration files: `.json` extension
- Hooks: lowercase with hyphens (e.g., `gsd-check-update.js`, `gsd-statusline.js`)

**Functions:**
- **Command handlers:** Prefixed with `cmd` followed by PascalCase (e.g., `cmdStateLoad`, `cmdPhasesList`, `cmdGenerateSlug`)
- **Utility functions:** camelCase (e.g., `safeReadFile`, `execGit`, `normalizePhaseName`, `comparePhaseNum`)
- **Internal helper functions:** camelCase with `Internal` suffix when marked as private (e.g., `findPhaseInternal`, `generateSlugInternal`, `resolveModelInternal`)
- **Boolean test functions:** camelCase starting with `is` or `has` (e.g., `isGitIgnored`, `pathExistsInternal`)
- **Array/object transformers:** camelCase starting with `get` (e.g., `getMilestoneInfo`, `getMilestonePhaseFilter`, `getArchivedPhaseDirs`)

Examples from `core.cjs`:
```javascript
function toPosixPath(p)
function output(result, raw, rawValue)
function error(message)
function loadConfig(cwd)
function isGitIgnored(cwd, targetPath)
function normalizePhaseName(phase)
function comparePhaseNum(a, b)
function searchPhaseInDir(baseDir, relBase, normalized)
```

**Variables:**
- camelCase for local variables and parameters
- UPPER_SNAKE_CASE for constants and enums (e.g., `MODEL_PROFILES`)
- Underscore suffix for "raw" output format flags (e.g., `stateRaw`, `rawValue`)
- Prefix underscores for private/internal fields: Not used; instead functions are prefixed with `Internal`

**Types/Objects:**
- Object properties: camelCase with no type prefix (e.g., `{found: true, directory: path, phase_number: num}`)
- JSON config keys: snake_case (e.g., `model_profile`, `commit_docs`, `search_gitignored`)
- Markdown file names: UPPER_SNAKE_CASE (e.g., `STATE.md`, `ROADMAP.md`, `REQUIREMENTS.md`)

## Code Style

**Formatting:**
- No linter/formatter detected (no `.eslintrc`, `.prettierrc`, `biome.json` found)
- Manual formatting follows these patterns:
  - 2-space indentation
  - No semicolons at end of statements
  - Trailing commas in multi-line objects
  - Long lines (~100+ characters) are wrapped

**Linting:**
- Not detected as configured or enforced

**Spacing/Structure:**
- Section dividers using ASCII art: `// ─── Section Name ────────────────────────────────────────────────────────────`
- Comments above section dividers to organize code into logical blocks
- Blank lines between related function groups

## Import Organization

**Order:**
1. Node.js built-in modules: `fs`, `path`, `child_process`, `os`
2. Local `.cjs` modules using `require()`
3. Constants and object instantiation

Example from `state.cjs`:
```javascript
const fs = require('fs');
const path = require('path');
const { escapeRegex, loadConfig, getMilestoneInfo, getMilestonePhaseFilter, output, error } = require('./core.cjs');
const { extractFrontmatter, reconstructFrontmatter } = require('./frontmatter.cjs');
```

**Path Aliases:**
- None used. All imports use relative `./` paths
- Modules organized in `bin/lib/` directory with flat structure

**Module exports:**
All modules use CommonJS `module.exports` with named exports. Example from `core.cjs`:
```javascript
module.exports = {
  MODEL_PROFILES,
  output,
  error,
  safeReadFile,
  loadConfig,
  isGitIgnored,
  execGit,
  escapeRegex,
  normalizePhaseName,
  comparePhaseNum,
  // ... more exports
};
```

## Error Handling

**Patterns:**
- **Silent catch blocks:** Used extensively for defensive programming where failures are acceptable
  ```javascript
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
  ```

- **Error function calls:** Central error handler for fatal conditions
  ```javascript
  function error(message) {
    process.stderr.write('Error: ' + message + '\n');
    process.exit(1);
  }
  ```

- **Wrapped error handling:** Try-catch with custom error message at call site
  ```javascript
  try {
    fs.writeFileSync(configPath, JSON.stringify(defaults, null, 2), 'utf-8');
  } catch (err) {
    error('Failed to create config.json: ' + err.message);
  }
  ```

- **Error state in output:** Return error info in result object rather than throwing
  ```javascript
  output({ exists: false, type: null }, raw, 'false');
  ```

**Guidelines:**
- Use silent catch for optional operations (file reads, config migrations)
- Use `error()` function for critical failures that should stop execution
- Use try-catch with descriptive message prefix for I/O operations
- Prefer returning error objects in results over throwing exceptions

## Logging

**Framework:** `process.stdout` and `process.stderr` for console output

**Patterns:**
- **Output function:** Central handler for both JSON and raw output
  ```javascript
  function output(result, raw, rawValue) {
    if (raw && rawValue !== undefined) {
      process.stdout.write(String(rawValue));
    } else {
      process.stdout.write(JSON.stringify(result, null, 2));
    }
    process.exit(0);
  }
  ```

- **Large payload handling:** When JSON exceeds 50KB, write to temp file and output path prefixed with `@file:`
- **Error logging:** Written to `process.stderr` via `error()` function
- **Raw output mode:** `--raw` flag enables outputting single values instead of JSON objects

**When to log:**
- Success/completion: Use `output()` with result object
- Errors: Use `error()` with descriptive message
- Large data: Automatically handled by `output()` function
- Debug info: Not used in current codebase

## Comments

**When to Comment:**
- Section dividers using ASCII art comment lines separate logical blocks within files
- Inline comments explain non-obvious logic or implementation choices
- No per-function JSDoc comments observed; documentation is minimal

**JSDoc/TSDoc:**
- **Minimal usage:** Only used for high-complexity functions
- **Example from code:**
  ```javascript
  /** Normalize a relative path to always use forward slashes (cross-platform). */
  function toPosixPath(p) {
    return p.split(path.sep).join('/');
  }
  ```

- **When to use:** Complex algorithms, regex patterns, or functions with non-obvious intent
- **Format:** Single-line or multi-line `/** */` style, placed immediately above function

**Inline comments:**
- Explain *why* something is done, not *what* (code should be self-documenting)
- Example from `core.cjs`:
  ```javascript
  // --no-index checks .gitignore rules regardless of whether the file is tracked.
  // Without it, git check-ignore returns "not ignored" for tracked files even when
  // .gitignore explicitly lists them — a common source of confusion.
  execSync('git check-ignore -q --no-index -- ' + targetPath.replace(...), {...});
  ```

## Function Design

**Size:**
- Functions range from 5 to 80+ lines
- Smaller utilities (1-20 lines): Path manipulation, string formatting, simple accessors
- Medium functions (20-50 lines): Command handlers with single responsibility
- Larger functions (50-80+ lines): Complex operations like phase listing with filtering/sorting

**Parameters:**
- Typically 1-4 parameters per function
- First parameter often `cwd` (current working directory) for context
- Often include `raw` flag as final parameter for output mode control
- Complex option objects passed as single parameter: `function cmdPhaseAdd(cwd, options, raw)`

**Return Values:**
- Command handlers call `output()` or `error()` instead of returning values
- Utility functions return results (objects, strings, booleans, null)
- No explicit return statements for functions that call `output()` or `error()`

## Module Design

**Exports:**
- All exports are named exports via `module.exports = { ... }`
- Each `.cjs` file exports 5-20 functions
- No default exports used

**Barrel Files:**
- Not applicable; modules are CLI command-focused rather than library-oriented

**Module Responsibility:**
- `core.cjs`: Shared utilities, constants, path/config helpers
- `state.cjs`: STATE.md operations and progression engine
- `phase.cjs`: Phase CRUD, query, and lifecycle operations
- `commands.cjs`: Standalone utility commands (slug generation, timestamp, todos)
- `config.cjs`: Planning config CRUD operations
- `frontmatter.cjs`: YAML frontmatter parsing and serialization
- `verify.cjs`: Verification suite, consistency, and health validation
- `milestone.cjs`: Milestone and requirements lifecycle operations
- `template.cjs`: Template rendering for markdown generation
- `roadmap.cjs`: Roadmap analysis and phase extraction
- `init.cjs`: Compound command initialization workflows

**Coupling:**
- Modules import from `core.cjs` for shared utilities
- State mutations use `writeStateMd()` from `state.cjs`
- Frontmatter parsing delegated to `frontmatter.cjs`
- Limited cross-module dependencies; mostly unidirectional (feature modules depend on core)

---

*Convention analysis: 2026-03-11*
