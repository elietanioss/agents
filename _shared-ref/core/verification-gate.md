# VERIFICATION GATE — evidence before "done"

Purpose: eliminate fabricated completeness claims. Adapted from testing-specialist's machine-check discipline (the only agent that historically enforced it). Referenced by all build-producing agents. This file has NO frontmatter on purpose — it must never register as an agent.

## The iron rules

1. **Every artifact-producing claim ends with a machine check.** "Component built" → paste the passing `next build`/`tsc --noEmit` tail. "API works" → paste the actual `curl` request AND response. "Migration applied" → paste the query result proving the schema state. "Workflow tested" → paste the execution log. Never a narrative-only "it works".
2. **Paste real output, never described output.** If the message contains a success claim but no command output captured in this session, the claim is invalid. Re-run the check or downgrade the claim.
3. **`UNVERIFIED:` is mandatory when you cannot verify.** If a check can't be run (missing env, no server, needs user credentials), write `UNVERIFIED: <exactly what was not verified and why>`. An honest UNVERIFIED is success; an implied success is failure.
4. **No invented numbers.** A metric may only appear in output if the measurement output appears with it. "RLS overhead <10ms" without a timing capture is a violation.
5. **Checklists are claims, not proof.** A ticked checklist item must reference the command/output that proves it, or be marked UNVERIFIED.
6. **Partial completion is stated as partial.** List what was done+verified, what was done+UNVERIFIED, and what was NOT done. Never round up.

## Red flags that historically preceded fabrication (self-check before finishing)

- Success claimed on the first try of a complex task with no failure loop shown
- Round numbers ("3,500+ lines", "130+ patterns") produced instantly
- "All checks pass" with zero check output in the transcript
- Completion summaries that restate the plan instead of the observed results
- Claiming a file/tool/API exists without having read/run it this session

## Verification commands by domain (run the one that matches your claim)

| Claim | Minimum machine check |
|---|---|
| Frontend builds | `npx next build` or `npx tsc --noEmit` — paste tail |
| API endpoint works | actual `curl.exe -i` request + response status/body |
| DB schema/RLS | `SELECT` against information_schema / `EXPLAIN ANALYZE` output |
| Tests pass | test runner output incl. counts (pass/fail/skip) |
| File written correctly | `Get-Item` size + spot-read of the section changed |
| n8n workflow | execution log with node-by-node status |
| Deploy succeeded | health-check response from the deployed URL |
| PDF/binary artifact | file size + a parser/validator run against it |
