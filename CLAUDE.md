# Claude Code Configuration - RuFlo V3

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization |
| `agent` | 8 | Agent lifecycle management |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with HNSW search |
| `task` | 6 | Task creation and lifecycle |
| `session` | 7 | Session state management |
| `hooks` | 17 | Self-learning hooks + 12 workers |
| `hive-mind` | 6 | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Claude Code vs CLI Tools

- Claude Code's Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues

---

# Project-Specific Rules

## Some general rules
- When debugging, fully trace the root cause through the entire code flow before proposing fixes. Do not patch symptoms — understand the fundamental design issue first. Ask clarifying questions if the codebase semantics are unclear.
- When using parallel sub-agent teams for implementation, verify all imports, type definitions (TypedDict inheritance), and message key mappings across files before marking tasks complete. Run smoke tests after each agent's work is integrated.
- When the user interrupts or redirects, STOP immediately, acknowledge the correction, and ask for clarification before proceeding. Do not continue the previous approach.
- After all team agents complete their tasks, run a verification phase: 1) Check all imports resolve correctly across modified files, 2) Verify all TypedDict/dataclass definitions are consistent, 3) Run any available tests, 4) Trace one complete execution path through the modified code mentally and report any mismatches.

## Workflow Orchestration

### 1. Plan Node Default
- Given requirements from users, interrogate their assumptions and approaches to prevent planning in wrong direction
- Enter plan mode for ANY non-trivial task
- Apply the team's lessons (auto-loaded from `.claude/rules/lessons-*.md`) to avoid repeating past mistakes
- Present to users multiple approaches and designs with trade-off analysis
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity
- Don't do local hacks. Always ask yourself:
    - how does this interact with the rest of the system?
    - what's the cost of this at peak load
    - what happens at 10x scale

### 2. Subagent Strategy
- Use subagents liberally for large tasks to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update the project's `.claude/lessons.md` with the pattern (create the file if it doesn't exist)
- At session start, read `.claude/lessons.md` if it exists — this file is NOT auto-loaded
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Apply the team's lessons (auto-loaded from `.claude/rules/lessons-*.md`) when working in a relevant domain — don't re-learn what the team already knows
- To add a new team-wide lesson, create a `lessons-<domain>.md` file in `.claude/rules/`

### 4. Verification Before Done
- Always ask yourself, "How will we verify this works?" in planning phase
- Test first and fail first.
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness
- Ask human to verify following things, with some context info
    - architectural fit
    - security implications
    - failure modes
    - performance under load and resource usage
    - future maintainability
- Spawn a `code-reviewer` subagent to check style consistency and simplification passes

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how
- Apply the team's lessons (auto-loaded from `.claude/rules/lessons-*.md`) — the issue may match a documented pattern

### 7. Save Context
- Keep the whole architecture description document somewhere in a repository
- Update the architecture fresh, if you detect any architectural changes, update the document
- Before committing, use the `/update-docs` skill to check the git diff and update CHANGELOG, README, and other project documentation
- Keep track of every change you made in a change log in the project root, this helps to update the specs
- Put following info in the project's `CLAUDE.md`
    - security policies
    - compliance requirements
    - never do list
    - always do list
    - any budgets and constraints related info (cost, performance)
    - business context

## Task Management

1. **Plan First**: Write plan with checkable items before starting
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step, and prompt for review
5. **Document Results**: Log changes and review notes in the project
6. **Capture Lessons**: Update the project's `.claude/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **Reliability over cleverness**: Prefer boring, well-tested native APIs over clever new libraries.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
