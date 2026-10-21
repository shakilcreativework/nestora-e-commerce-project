# NESTORA Context Engineering System for Antigravity

**Purpose:** A practical, task-by-task operating system for building
NESTORA with a coding agent while preserving user control over scope,
testing, approvals, and Git operations.

## Package contents

1.  `MASTER_CONTEXT_ENGINEERING_PROMPT.md` --- persistent project-level
    instructions for Antigravity.
2.  `TASK_PROMPT_TEMPLATE.md` --- reusable prompt for one small task at
    a time.
3.  `TASK_CATALOG_AND_SEQUENCE.md` --- recommended phased build order,
    dependencies, and phase exit criteria.
4.  `PROJECT_TRACKER.md` --- task statuses, approval checkpoints, and
    progress log.
5.  `UI_UX_DESIGN_BRIEF.md` --- design direction and visual acceptance
    rules.
6.  `GIT_AND_QUALITY_GATES.md` --- strict no-auto-commit/push policy and
    test protocol.

## How to use this package

1.  Put `NESTORA_Ecommerce_PRD.md` in the project documentation folder
    (for example, `docs/PRD.md`). The PRD remains the product source of
    truth.
2.  Put `MASTER_CONTEXT_ENGINEERING_PROMPT.md` where Antigravity can
    consistently read it as project instructions. If Antigravity
    supports project rules or instruction files, add the rules there
    too. Do not rely on a chat-only prompt if project rules are
    available.
3.  Keep the task catalog and tracker in the repository, for example
    under `docs/engineering/`.
4.  Before each task, copy `TASK_PROMPT_TEMPLATE.md`, fill every
    relevant field, and ask the agent to execute **only that task**.
5.  Require a written plan before implementation whenever the task is
    medium/large, touches auth/payment/database/security, changes
    architecture, or exceeds its approved file scope.
6.  Let the agent implement and run checks. Review the diff and report
    yourself.
7.  Only after your explicit approval should you manually run Git
    commands. The agent must not commit or push.
8.  Update the tracker yourself or ask the agent to prepare a proposed
    update; verify it before accepting it.

## Suggested repository layout

``` text
/
├── docs/
│   ├── PRD.md
│   └── engineering/
│       ├── MASTER_CONTEXT_ENGINEERING_PROMPT.md
│       ├── TASK_PROMPT_TEMPLATE.md
│       ├── TASK_CATALOG_AND_SEQUENCE.md
│       ├── PROJECT_TRACKER.md
│       ├── UI_UX_DESIGN_BRIEF.md
│       └── GIT_AND_QUALITY_GATES.md
├── src/                    # actual application structure is decided during foundation task
├── drizzle/                # migrations, if used by the selected Drizzle setup
├── tests/
└── README.md
```

The structure above is a recommendation, not permission to reorganize an
existing repository automatically. If a repository already exists,
inspect it first and propose the smallest compatible placement.

## Important limitations

-   A prompt cannot mathematically guarantee flawless code. The system
    reduces risk through small diffs, explicit scope, repeatable checks,
    human review, and a hard stop on uncertain changes.
-   Passing local tests does not prove production correctness. Provider
    sandbox behavior, deployment environment, database configuration,
    and browser behavior must also be verified where relevant.
-   Do not paste secrets into prompts, chat, source control,
    screenshots, or reports.
