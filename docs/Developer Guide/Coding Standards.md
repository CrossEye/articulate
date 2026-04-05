Coding Standards
================


### Language and Module Style ###

- Plain JavaScript, ES modules (`"type": "module"` in `package.json`).
- No TypeScript, no transpilation for server code.
- `const` by default; `let` only when reassignment is needed; never `var`.


### Expression-Oriented Style ###

Prefer expressions over statements where readability allows:

- Ternaries and `&&`/`||` chains over `if`/`else` blocks.
- Arrow functions as the default; `function` only when hoisting is needed.
- Currying and higher-order functions are idiomatic.


### Formatting ###

- No semicolons (ASI throughout).
- Named exports for utility modules, default exports for Preact components and Express routers.
- Import order: Node built-ins, external deps, internal modules.


### Error Handling ###

- Handle errors at boundaries only (route handlers, top-level entry points).
- Let errors propagate naturally through internal code.
- Use `node:fs/promises` for all filesystem access (never synchronous `fs`).


### CSS ###

- Plain CSS with custom properties.
- Colors and spacing always reference `var(--...)`, never hard-coded values.
- No CSS modules, no preprocessors.


### Markdown Files ###

- Setext headers for levels 1 and 2.
- Three blank lines before level 2 headers; two blank lines before level 3.
- Symmetric ATX for level 3+: `### Title ###`.
- Ten hyphens for horizontal rules.
- Table columns aligned on `|` separators.
