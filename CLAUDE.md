# CLAUDE.md

Guidance for AI assistants (Claude Code) working in this repository.

## Repository state

This repo is **pre-implementation**. It currently contains only two files:

- `README.md` — full Korean-language specification for the Robin Q&A system (tech stack, schema, API, UI, security, phases, file structure). Treat this as the source of truth for design decisions.
- `Q&A.md` — raw customer-service answer corpus (Korean), 48 entries in the form `* "질문"` followed by a paragraph answer. This is **content**, not the final data format.

There is no PHP source, no DB migrations, no build tooling, and no `data/` directory yet. The directory tree shown in `README.md` (§ 파일 구조) is the **target** layout, not the current one.

## Project at a glance

- **Product**: internal Q&A landing page for 로빈팀(로팀) CS staff at picktrend.kr/robin.
- **Stack**: PHP 8.x + MySQL 8 / MariaDB 10.6+, vanilla CSS/JS (no framework), Parsedown for Markdown, PDO for DB.
- **Data flow**: Markdown files in `/data/*.md` → SHA-256-diffed sync → MySQL (`qa_items`) → JSON cache (`/cache/qa_list.json`) → API → frontend.
- **Auth**: session-based, role = `admin` | `user`, plus `can_write` flag.

## Working with the spec

`README.md` is dense and authoritative. When implementing anything, search it first for relevant constraints before inventing one. Notable sections to consult:

- §코드 퀄리티 철학 — non-negotiable style rules per language
- §디자인 시스템 — color tokens, type scale, spacing, breakpoints (use the exact CSS variables, not new ones)
- §데이터베이스 스키마 — column names, types, indexes are fixed
- §API 설계 — endpoint shapes and the `{success, data, meta}` / `{success, error:{code,message}}` envelope; error codes E001–E007 are canonical
- §보안 명세 — bcrypt cost 12, CSRF tokens, `session_regenerate_id(true)` on login, etc.
- §개발 Phase — Phase 1 (기반) is the entry point: schema + `config.php` / `db.php` / `auth.php` + login.

## `Q&A.md` ↔ `data/*.md` format mismatch

The current `Q&A.md` is a flat document; entries look like:

```
* "질문 텍스트"
답변 본문...
```

The spec (§MD 파싱 규칙) expects **per-file** Markdown with YAML front-matter:

```markdown
---
category: 계약
keywords: 계약서, 서명, 날인
pinned: false
---
## 질문 내용

답변 내용 (마크다운)
```

When asked to "import the Q&A" or wire up parsing, do **not** modify `Q&A.md` in place. Either (a) write a one-shot script that splits it into `data/*.md` files, asking the user about category assignment, or (b) confirm with the user how they want to bridge the two formats. The README explicitly forbids arbitrary edits to MD originals (§절대 금지: "MD 원본 임의 수정").

## Code conventions (summary — full rules in README)

**CSS**: BEM (`.block__element--modifier`), CSS variables for all tokens, no magic numbers, property order `position → display → box → typography → visual → misc`.

**JS**: IIFE / module pattern (no globals), event delegation, debounce 300ms / throttle 100ms, single-responsibility functions ≤ ~20 lines, no `console.log` in committed code.

**PHP**: PSR-12, 100% prepared statements (PDO), early returns, single-responsibility functions, never echo unsanitized input — always `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`.

**Comments**: explain *why*, not *what*. Section headers like `/* ═══ Auth ═══ */` are fine. No "this function does X", no over-verbose variable names, no commented-out code.

## Hard prohibitions

From §절대 금지 — these will cause review rejection:

- AI-flavored boilerplate ("This function ...", over-explanation, padding)
- Truncated code with `...` placeholders
- Hardcoded credentials anywhere (`config.php` is gitignored in deployment)
- Leftover `console.log`, `var_dump`, `print_r`
- Editing `Q&A.md` source content arbitrarily
- Template-grade UI; design quality must match the spec's tokens and motion rules

## Workflow

- **Branch**: develop on `claude/add-claude-documentation-spf66` (per task instructions). Do not push to other branches without explicit permission.
- **Commits**: clear, conventional messages; do not amend published commits.
- **PRs**: do not open a PR unless the user asks.
- **Language**: user-facing strings (UI, error messages, comments where applicable) are **Korean**. Code identifiers stay English. Keep error messages friendly per §에러 처리.

## When in doubt

Ask. The spec is opinionated and the quality bar is explicitly "세계적인 시니어 풀스택 개발자가 직접 작성한 것처럼" — it's better to clarify category assignments, naming choices, or scope than to guess and have to redo work.
