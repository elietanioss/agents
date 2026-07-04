# Testing KB 07 — AI/LLM Evaluation Frameworks

## SECTION 18: AI/LLM EVALUATION FRAMEWORKS

### 18.1 Prompt Quality Evaluation

**Pattern 45: LLM-as-Judge Evaluation**
```python
import anthropic
client = anthropic.Anthropic()

def llm_judge(prompt_output: str, expected: str, criteria: list[str]) -> dict:
    """Evaluate prompt output using LLM-as-Judge pattern"""
    judge_prompt = f"""
    You are an expert evaluator. Score the following output against criteria.
    OUTPUT TO EVALUATE:
    {prompt_output}
    EXPECTED/REFERENCE:
    {expected}
    CRITERIA (score each 1-5):
    {chr(10).join(f'- {c}' for c in criteria)}
    Respond in JSON: {{"scores": {{"criterion": score}}, "overall": score, "reasoning": "...", "pass": true/false}}
    """
    message = client.messages.create(
        model="claude-sonnet-4-5-20250929", max_tokens=1024,
        messages=[
            {"role": "user", "content": judge_prompt},
            {"role": "assistant", "content": '{"scores":'}  # Prefill forces valid JSON start
        ]
    )
    import json
    return json.loads('{"scores":' + message.content[0].text)

# Usage
results = llm_judge(
    prompt_output="The quarterly revenue increased by 15% to $2.3M...",
    expected="Accurate financial summary with specific numbers",
    criteria=["accuracy: Are all numbers correct?", "completeness: Are all key metrics covered?", "clarity", "tone", "conciseness"]
)
```

**Pattern 46: Rubric-Based Evaluation** — a fixed 1-5 rubric per dimension (instruction_following, output_format, factual_accuracy, safety_compliance), each level given a concrete description (not just a number). `evaluate_with_rubric()` scores every dimension via `llm_judge_single_dimension`, averages them, and grades: `A` ≥4.5, `B` ≥3.5 (`pass` threshold), `C` ≥2.5, else `F`. Fixed rubric text (not ad hoc criteria per run) is what makes repeated evaluations comparable over time.

**Pattern 47: A/B Testing for Prompts**
```python
from scipy import stats
import numpy as np

def ab_test_prompts(prompt_a, prompt_b, test_cases, evaluator, confidence_level=0.95):
    scores_a, scores_b = [], []
    for case in test_cases:
        scores_a.append(evaluator(run_prompt(prompt_a, case['input']), case['expected']))
        scores_b.append(evaluator(run_prompt(prompt_b, case['input']), case['expected']))

    t_stat, p_value = stats.ttest_ind(scores_a, scores_b, equal_var=False)  # Welch's t-test — unequal variances
    mean_a, mean_b = np.mean(scores_a), np.mean(scores_b)

    return {
        "prompt_a": {"mean": mean_a, "std": np.std(scores_a), "n": len(scores_a)},
        "prompt_b": {"mean": mean_b, "std": np.std(scores_b), "n": len(scores_b)},
        "t_statistic": t_stat, "p_value": p_value,
        "significant": p_value < (1 - confidence_level),
        "winner": "A" if mean_a > mean_b else "B" if mean_b > mean_a else "TIE",
        "effect_size": abs(mean_a - mean_b) / np.sqrt((np.var(scores_a) + np.var(scores_b)) / 2),
    }
```
Never declare a prompt-variant "winner" from a handful of anecdotal runs — use Welch's t-test (handles unequal variances between variants) and report significance + effect size, not just the raw mean difference.

**Pattern 48: Regression Testing Suite (golden-file based)**
```python
class PromptRegressionSuite:
    def __init__(self, golden_file: str):
        self.golden = self.load_golden(golden_file)  # known-good {id, input, golden_output} cases

    def run_regression(self, prompt: str, threshold: float = 0.90) -> dict:
        results = []
        for case in self.golden:
            output = run_prompt(prompt, case['input'])
            similarity = semantic_similarity(output, case['golden_output'])
            results.append({'case_id': case['id'], 'similarity': similarity, 'pass': similarity >= threshold, ...})
        passed = sum(1 for r in results if r['pass'])
        return {
            'passed': passed, 'total': len(results), 'pass_rate': passed / len(results),
            'regression_detected': passed / len(results) < 0.95,
            'failures': [r for r in results if not r['pass']],
        }
```
Run this on every prompt-file change (agent .md edits included) — a golden-case suite is the only way to catch a "small wording tweak" silently degrading behavior on cases you didn't manually re-check.
