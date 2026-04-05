Tech Stack
==========


### Server ###

| Technology     | Role                    | Why                                                        |
| :------------- | :---------------------- | :--------------------------------------------------------- |
| Node.js 20+   | Runtime                 | Modern ESM support, built-in test runner                   |
| Express        | HTTP framework          | Minimal, well-understood, middleware ecosystem              |
| better-sqlite3 | Database               | Synchronous API, fast, zero-config, single-file database   |
| marked         | Markdown rendering      | Lightweight, extensible, used for docs and node content    |


### Client ###

| Technology | Role               | Why                                                            |
| :--------- | :----------------- | :------------------------------------------------------------- |
| Preact     | UI framework       | React-compatible API at 3KB, fast, lightweight                 |
| HTM        | JSX alternative    | Tagged template literals, no build step required for templates |
| esbuild    | Bundler            | Sub-second builds, ESM-native, CSS bundling                    |


### Why Not TypeScript? ###

The project uses plain JavaScript with ES modules throughout.  TypeScript adds build complexity and cognitive overhead without proportional benefit for a project of this scope.  The codebase favors expression-oriented, functional patterns where types tend to be inferrable from context.
