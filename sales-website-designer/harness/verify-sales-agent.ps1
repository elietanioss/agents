$ErrorActionPreference = 'Stop'

$agentRoot = 'C:\Users\User\.claude\agents\sales-website-designer'
$agentFile = Join-Path $agentRoot 'sales-website-designer.md'
$kbFile = Join-Path $agentRoot 'ref\commerce-knowledge-base.md'
$evalFile = Join-Path $agentRoot 'ref\eval-harness.md'
$commandFile = 'C:\Users\User\.claude\commands\sales-design.md'
$orchestratorFile = 'C:\Users\User\.claude\agents\orchestrator\orchestrator.md'
$globalFile = 'C:\Users\User\.claude\CLAUDE.md'
$memoryIndex = 'C:\Users\User\.claude\memory\agents\_AGENT-INDEX.md'
$memoryAgent = 'C:\Users\User\.claude\memory\agents\sales-website-designer.md'

$checks = [System.Collections.Generic.List[object]]::new()

function Add-Check {
    param([string]$Name, [bool]$Passed, [string]$Detail)
    $checks.Add([pscustomobject]@{ Check = $Name; Passed = $Passed; Detail = $Detail })
}

foreach ($item in @(
    @{ Name = 'agent-file'; Path = $agentFile },
    @{ Name = 'knowledge-base'; Path = $kbFile },
    @{ Name = 'eval-harness'; Path = $evalFile },
    @{ Name = 'slash-command'; Path = $commandFile },
    @{ Name = 'memory-agent'; Path = $memoryAgent }
)) {
    Add-Check $item.Name (Test-Path -LiteralPath $item.Path) $item.Path
}

if (Test-Path -LiteralPath $agentFile) {
    $agentText = Get-Content -LiteralPath $agentFile -Raw -Encoding utf8
    Add-Check 'frontmatter-name' ($agentText -match '(?m)^name: sales-website-designer$') 'registered agent name'
    Add-Check 'model-inherit' ($agentText -match '(?m)^model: inherit$') 'global model-routing contract'
    Add-Check 'evidence-verdicts' ($agentText -match 'MOSTLY_TRUE' -and $agentText -match 'UNVERIFIABLE') 'fact-check scale present'
    Add-Check 'ethics-gate' ($agentText -match 'fake scarcity' -and $agentText -match 'obstructive cancellation') 'critical dark-pattern rejections present'
    Add-Check 'handoff-boundary' ($agentText -match 'ui-specialist' -and $agentText -match 'research-specialist') 'adjacent-agent handoffs present'
}

if (Test-Path -LiteralPath $kbFile) {
    $kbText = Get-Content -LiteralPath $kbFile -Raw -Encoding utf8
    $patternNumbers = [regex]::Matches($kbText, '(?m)^\|\s*(\d{2,3})\s*\|') | ForEach-Object { [int]$_.Groups[1].Value } | Where-Object { $_ -ge 21 -and $_ -le 160 }
    $missing = 21..160 | Where-Object { $_ -notin $patternNumbers }
    Add-Check 'pattern-library-21-160' ($patternNumbers.Count -eq 140 -and $missing.Count -eq 0) ('rows=' + $patternNumbers.Count + '; missing=' + ($missing -join ','))
    Add-Check 'source-links' (([regex]::Matches($kbText, 'https?://')).Count -ge 100) ('urls=' + ([regex]::Matches($kbText, 'https?://')).Count)
    Add-Check 'agentic-commerce-current' ($kbText -match 'Universal Commerce Protocol' -and $kbText -match 'Agentic Commerce Protocol') 'ACP and UCP present'
}

$orchestratorText = Get-Content -LiteralPath $orchestratorFile -Raw -Encoding utf8
$globalText = Get-Content -LiteralPath $globalFile -Raw -Encoding utf8
$memoryText = Get-Content -LiteralPath $memoryIndex -Raw -Encoding utf8
$commandText = if (Test-Path -LiteralPath $commandFile) { Get-Content -LiteralPath $commandFile -Raw -Encoding utf8 } else { '' }

Add-Check 'orchestrator-roster' ($orchestratorText -match '\| sales-website-designer \|') 'roster row'
Add-Check 'orchestrator-count' ($orchestratorText -match 'all 30 specialist agents' -and $orchestratorText -match 'across 30 specialist agents') '30 routed specialists'
Add-Check 'orchestrator-pipeline' ($orchestratorText -match 'Template G: Sales-Oriented Commerce Experience') 'commercial pipeline template'
Add-Check 'global-command' ($globalText -match '`/sales-design`' -and $globalText -match 'sales-website-designer') 'CLAUDE.md command registration'
Add-Check 'command-target' ($commandText -match 'subagent_type: "sales-website-designer"') 'slash command dispatch target'
Add-Check 'memory-index' ($memoryText -match '\[\[sales-website-designer\]\]') 'memory graph registration'

$checks | Format-Table -AutoSize
$failed = @($checks | Where-Object { -not $_.Passed })
Write-Output ('RESULT total=' + $checks.Count + ' passed=' + ($checks.Count - $failed.Count) + ' failed=' + $failed.Count)

if ($failed.Count -gt 0) {
    exit 1
}
