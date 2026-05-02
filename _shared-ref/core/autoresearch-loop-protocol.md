# autoresearch

This is an experiment to have the LLM do its own research.

## Setup

To set up a new experiment, work with the user to:

1. **Agree on a run tag**: propose a tag based on today's date (e.g. `mar5`). The branch `autoresearch/<tag>` must not already exist — this is a fresh run.
2. **Create the branch**: `git checkout -b autoresearch/<tag>` from current master.
3. **Read the in-scope files**: The repo is small. Read these files for full context:
   - `README.md` — repository context.
   - `prepare.py` — fixed constants, data prep, tokenizer, dataloader, evaluation. Do not modify.
   - `train.py` — the file you modify. Model architecture, optimizer, training loop.
4. **Verify data exists**: Check that `~/.cache/autoresearch/` contains data shards and a tokenizer. If not, tell the human to run `uv run prepare.py`.
5. **Initialize results.tsv**: Create `results.tsv` with just the header row.
6. **Confirm and go**: Confirm setup looks good.

## Experimentation

Each experiment runs on a single GPU. The training script runs for a **fixed time budget of 5 minutes** (wall clock training time). Launch it as: `uv run train.py`.

**What you CAN do:**
- Modify `train.py` — this is the only file you edit. Everything is fair game: model architecture, optimizer, hyperparameters, training loop, batch size, model size, etc.

**What you CANNOT do:**
- Modify `prepare.py`. It is read-only.
- Install new packages or add dependencies.
- Modify the evaluation harness.

**The goal is simple: get the lowest val_bpb.** Since the time budget is fixed, you don't need to worry about training time — it's always 5 minutes.

**Simplicity criterion**: All else being equal, simpler is better. A small improvement that adds ugly complexity is not worth it.

## Output format

Once the script finishes it prints a summary like this:

```
---
val_bpb:          0.997900
training_seconds: 300.1
total_seconds:    325.9
peak_vram_mb:     45060.2
mfu_percent:      39.80
total_tokens_M:   499.6
num_steps:        953
num_params_M:     50.3
depth:            8
```

Extract the key metric: `grep "^val_bpb:" run.log`

## Logging results

Log to `results.tsv` (tab-separated, NOT comma-separated — commas break in descriptions).

```
commit	val_bpb	memory_gb	status	description
```

Status values: `keep`, `discard`, or `crash`

## The experiment loop

LOOP FOREVER:

1. Look at the git state: the current branch/commit we're on
2. Tune `train.py` with an experimental idea by directly hacking the code.
3. git commit
4. Run the experiment: `uv run train.py > run.log 2>&1`
5. Read out the results: `grep "^val_bpb:\|^peak_vram_mb:" run.log`
6. If grep output is empty, the run crashed. Run `tail -n 50 run.log` to read the stack trace.
7. Record the results in the tsv (do not commit results.tsv, leave it untracked)
8. If val_bpb improved (lower), "advance" the branch, keeping the git commit
9. If val_bpb is equal or worse, git reset back to where you started

**Timeout**: Each experiment should take ~5 minutes total. If a run exceeds 10 minutes, kill it and treat it as a failure.

**NEVER STOP**: Once the experiment loop has begun, do NOT pause to ask the human if you should continue. The loop runs until the human interrupts you, period.
