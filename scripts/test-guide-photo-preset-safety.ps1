$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$workflow = Join-Path $repoRoot 'guide-workflow.ps1'
$tokens = $null
$parseErrors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile($workflow, [ref]$tokens, [ref]$parseErrors)
if ($parseErrors.Count) { throw "Workflow has $($parseErrors.Count) parser errors" }

$functionNames = @(
    'Get-DraftSubtitle', 'Test-IsGuideDraftBody', 'Get-SpecificPhotoSubject',
    'Test-HeroAltMatchesDestination', 'Test-DraftMatchesDestination',
    'Get-GuideDraftText', 'Get-PresetDestinationError', 'Build-PresetFromDraft',
    'Get-GuidePlaceNameFromSlug', 'Import-PresetsFromGuidePhoto',
    'Test-IsPlaceholderAlt', 'Test-EntriesHavePlaceholders', 'Append-GuideToTsx'
)
foreach ($name in $functionNames) {
    $definition = $ast.Find({
        param($node)
        $node -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $node.Name -eq $name
    }, $true)
    if (-not $definition) { throw "Missing workflow function: $name" }
    . ([scriptblock]::Create($definition.Extent.Text))
}

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

$ubonDraft = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'guides-drafts/ubon-ratchathani/draft.md'))
Assert-True (Test-DraftMatchesDestination -DraftText $ubonDraft -Destination 'Ubon Ratchathani') 'Ubon draft should match Ubon'
Assert-True (-not (Test-DraftMatchesDestination -DraftText $ubonDraft -Destination 'Chiang Mai')) 'Ubon draft must not match Chiang Mai'

$ubon = @(Build-PresetFromDraft -DraftText $ubonDraft -Destination 'Ubon Ratchathani' -HeroAlt '')
Assert-True ($ubon.Count -ge 8) 'Ubon draft should yield at least eight named slots'
Assert-True (-not (Get-PresetDestinationError -Slug 'ubon-ratchathani' -Entries $ubon)) 'Ubon draft labels should pass destination validation'
Assert-True (@(Build-PresetFromDraft -DraftText $ubonDraft -Destination 'Chiang Mai' -HeroAlt '').Count -eq 0) 'A mismatched draft must not generate photo labels'

$wrong = @($ubon | ForEach-Object {
    [pscustomobject]@{ slot = $_.slot; file = $_.file; alt = ($_.alt -replace 'Ubon Ratchathani', 'Chiang Mai') }
})
Assert-True ([bool](Get-PresetDestinationError -Slug 'ubon-ratchathani' -Entries $wrong)) 'Cross-guide labels must be rejected'
Assert-True (-not (Test-HeroAltMatchesDestination -HeroAlt 'Khao Kho mountain viewpoint in Phetchabun' -Destination 'Khao Sok')) 'A shared generic place word must not validate a different guide'
Assert-True (-not (Test-HeroAltMatchesDestination -HeroAlt 'Chiang Mai Old City moat at sunset' -Destination 'Chiang Rai')) 'Chiang Mai labels must not validate Chiang Rai'
$chiangMaiDraft = $ubonDraft -replace 'Ubon Ratchathani', 'Chiang Mai'
Assert-True (-not (Test-DraftMatchesDestination -DraftText $chiangMaiDraft -Destination 'Chiang Rai')) 'A Chiang Mai draft must not validate Chiang Rai'
foreach ($slug in @('pranburi', 'khao-kho', 'hatyai-songkhla', 'koh-kood-trat', 'koh-lipe-satun', 'phang-nga-khao-lak', 'nan')) {
    $path = Join-Path $repoRoot "guides-drafts/$slug/draft.md"
    $draft = [System.IO.File]::ReadAllText($path)
    if (Test-IsGuideDraftBody -Text $draft) {
        Assert-True (Test-DraftMatchesDestination -DraftText $draft -Destination (Get-GuidePlaceNameFromSlug $slug)) "A valid $slug draft should match its guide"
    } else {
        Assert-True (-not (Test-DraftMatchesDestination -DraftText $draft -Destination (Get-GuidePlaceNameFromSlug $slug))) "A prompt for $slug must not pass as a finished guide"
    }
}
$misfiledDraft = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'guides-drafts/chiang-mai/draft.md'))
Assert-True (-not (Test-DraftMatchesDestination -DraftText $misfiledDraft -Destination 'Chiang Mai')) 'The existing misfiled Chiang Mai draft must be blocked from assembly'
$global:DraftsRoot = Join-Path $repoRoot 'guides-drafts'
$global:txtDraft = [pscustomobject]@{ Text = $chiangMaiDraft }
Assert-True ((Get-GuideDraftText -Slug 'ubon-ratchathani') -eq $ubonDraft) 'A stale visible draft must resolve to the selected guide saved draft'
$global:PhotoSlotPresets = [ordered]@{}
[void](Import-PresetsFromGuidePhoto -RepoRoot $repoRoot)
$savedUbon = @($global:PhotoSlotPresets['ubon-ratchathani'])
Assert-True ($savedUbon.Count -eq 9) 'The saved Ubon preset must retain nine photo slots'
Assert-True (-not (Get-PresetDestinationError -Slug 'ubon-ratchathani' -Entries $savedUbon)) 'The saved Ubon preset must remain destination consistent'

$global:PlaceholderAltPatterns = @('^REPLACE-ME')
$fixtureRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("driftcoconut-preset-test-" + [guid]::NewGuid().ToString('N'))
$fixtureComponents = Join-Path $fixtureRoot 'components'
$fixtureFile = Join-Path $fixtureComponents 'GuidePhoto.tsx'
try {
    [void](New-Item -ItemType Directory -Path $fixtureComponents -Force)
    Copy-Item (Join-Path $repoRoot 'components/GuidePhoto.tsx') $fixtureFile
    $before = (Get-FileHash $fixtureFile -Algorithm SHA256).Hash
    $result = Append-GuideToTsx -RepoRoot $fixtureRoot -Slug 'ubon-ratchathani' -Entries $wrong -Force
    Assert-True (-not $result.ok) 'The writer must reject cross-guide labels even with Force'
    Assert-True ((Get-FileHash $fixtureFile -Algorithm SHA256).Hash -eq $before) 'A rejected write must leave GuidePhoto.tsx untouched'
} finally {
    if (Test-Path $fixtureFile) { Remove-Item -LiteralPath $fixtureFile }
    if (Test-Path $fixtureComponents) { Remove-Item -LiteralPath $fixtureComponents }
    if (Test-Path $fixtureRoot) { Remove-Item -LiteralPath $fixtureRoot }
}

Write-Output "PASS: Ubon draft identity, $($ubon.Count) grounded slots, saved preset, misfiled draft rejection, fallback, and writer rejection without mutation"
