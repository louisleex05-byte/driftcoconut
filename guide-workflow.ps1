# ============================================================================
# driftcoconut Guide Workflow - v3 + Claude API
# ============================================================================
# 3-tab WinForms desktop app for the destination-guide writing pipeline.
#
# Tab 1: Research         -> Claude runs the destination-research prompt
# Tab 2: Notes + Draft    -> Personal notes + Claude drafts the guide in your voice
# Tab 3: Photos + Publish -> 8 photo slots + assemble final.mdx + publish
#
# Reads/writes: <ProjectRoot>\guides-drafts\<slug>\
# Publishes to: <ProjectRoot>\content\guides\<slug>.mdx
# Copies photos to: <ProjectRoot>\public\guides\<slug>\
#
# Claude API: Anthropic Messages API via Invoke-RestMethod
# Requires:   guide-workflow-config.json with a claudeApiKey field
#             (see guide-workflow-config.example.json)
#
# Session-notes bug fixes (from H:\ v3 development):
#  1. Manual Panel+Buttons tab bar (TabControl is invisible on Windows 11)
#  2. RichTextBox for text areas (TextBox swallows file drops)
#  3. All scriptblocks wrapped in .GetNewClosure() (captured var loss)
#  4. All state uses $global: (not $script: - module scope sandboxing)
#  5. Explicit DialogResult enum comparison (not string implicit)
# ============================================================================

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

# ============================================================================
# GLOBALS
# ============================================================================
$global:ProjectRoot   = Split-Path -Parent $MyInvocation.MyCommand.Definition
$global:DraftsRoot    = Join-Path $global:ProjectRoot "guides-drafts"
$global:PublishedRoot = Join-Path $global:ProjectRoot "content\guides"
$global:PhotosRoot    = Join-Path $global:ProjectRoot "public\guides"

# Ensure required dirs exist
if (-not (Test-Path $global:DraftsRoot))    { New-Item -ItemType Directory -Path $global:DraftsRoot | Out-Null }
if (-not (Test-Path $global:PublishedRoot)) { New-Item -ItemType Directory -Path $global:PublishedRoot -Force | Out-Null }
if (-not (Test-Path $global:PhotosRoot))    { New-Item -ItemType Directory -Path $global:PhotosRoot -Force | Out-Null }

# Config: Claude API + model + tokens
$configPath              = Join-Path $global:ProjectRoot "guide-workflow-config.json"
$global:ClaudeApiKey     = $env:ANTHROPIC_API_KEY
$global:ClaudeModel      = "claude-sonnet-4-5"
$global:ClaudeMaxTokens  = 8000
# API toggle: OFF by default (manual mode - copy prompt, paste to Claude/Perplexity/Gemini, paste back).
# Flip to ON via the header checkbox once you have an Anthropic API key.
$global:UseClaudeAPI     = $false

if (Test-Path $configPath) {
    try {
        $cfg = Get-Content $configPath -Raw | ConvertFrom-Json
        if ($cfg.claudeApiKey)    { $global:ClaudeApiKey    = $cfg.claudeApiKey }
        if ($cfg.claudeModel)     { $global:ClaudeModel     = $cfg.claudeModel }
        if ($cfg.claudeMaxTokens) { $global:ClaudeMaxTokens = [int]$cfg.claudeMaxTokens }
        if ($null -ne $cfg.useClaudeAPI) { $global:UseClaudeAPI = [bool]$cfg.useClaudeAPI }
    } catch {
        [System.Windows.Forms.MessageBox]::Show(
            "Failed to parse guide-workflow-config.json:`n$_",
            "Config error", 'OK', 'Warning') | Out-Null
    }
}

# External research tool URLs - opened when user clicks "Send to..."
# Prompt is copied to clipboard; user pastes into the opened site.
# (None of these accept prompts via URL params for long content.)
$global:ResearchTools = [ordered]@{
    "Perplexity"    = "https://www.perplexity.ai/"
    "Gemini"        = "https://gemini.google.com/app"
    "ChatGPT"       = "https://chat.openai.com/"
    "Claude Cowork" = "https://claude.ai/new"
}

function Send-PromptToTool {
    param(
        [Parameter(Mandatory)][string]$Prompt,
        [Parameter(Mandatory)][string]$ToolName
    )
    if (-not $global:ResearchTools.Contains($ToolName)) {
        throw "Unknown tool: $ToolName"
    }
    [System.Windows.Forms.Clipboard]::SetText($Prompt)
    $url = $global:ResearchTools[$ToolName]
    Start-Process $url
}

# ============================================================================
# METADATA AUTO-FILL - derives Tab 3 fields from Tab 1 fields + draft body
# ============================================================================
# Called on Tab 3 activation (if fields are empty) or via "Auto-fill" button.
# Sources of truth (in priority order):
#   1. First italic subtitle line in the draft body (- Description)
#   2. Tab 1 Destination + Country fields (- Destination + Title)
#   3. Tab 1 Publish month (- year in Title)
#   4. Active photo preset's hero alt (- Hero alt)
function Get-DraftSubtitle {
    param([string]$Text)
    if (-not $Text) { return "" }
    # Skip frontmatter block if present
    $body = $Text -replace '(?s)^---\s*\n.*?\n---\s*\n', ''
    # First non-empty line that starts and ends with a single '*' (italic subtitle)
    foreach ($line in ($body -split "`n")) {
        $t = $line.Trim()
        if ($t -match '^\*[^\*].*[^\*]\*$') {
            return ($t.Trim('*').Trim())
        }
    }
    return ""
}

function AutoFill-Metadata {
    param([switch]$Force)

    # Peek at destination / country from Tab 1
    $dest = if ($global:txtDest) { $global:txtDest.Text.Trim() } else { "" }
    $country = if ($global:txtCountry) { $global:txtCountry.Text.Trim() } else { "" }
    $month = if ($global:txtMonth) { $global:txtMonth.Text.Trim() } else { "" }
    if (-not $dest) { return }  # nothing to derive from

    # Extract year from "September 2026" or similar
    $year = ""
    if ($month -match '(\d{4})') { $year = $Matches[1] }
    if (-not $year) { $year = (Get-Date).Year.ToString() }

    # Derive candidate values
    $titleGuess = "$dest Travel Guide ${year}: Where to Stay, When to Go & What to Eat"
    $destGuess = if ($country) { "$dest, $country" } else { $dest }

    # Description = draft italic subtitle if present, else generated
    $draftText = if ($global:txtDraft) { $global:txtDraft.Text } else { "" }
    $descGuess = Get-DraftSubtitle -Text $draftText
    if (-not $descGuess) {
        $descGuess = "A local's $dest guide - where to stay, when to visit, what to eat, and where to book."
    }

    # Hero alt from active photo preset's `hero` slot
    $heroAltGuess = ""
    if ($global:PhotoSlots -and $global:PhotoSlots.Count -gt 0) {
        $heroSlot = $global:PhotoSlots | Where-Object { $_.slot -eq "hero" } | Select-Object -First 1
        if ($heroSlot) { $heroAltGuess = $heroSlot.alt }
    }
    if (-not $heroAltGuess) { $heroAltGuess = "$dest landmark hero image" }

    # Fill only if empty (unless Force)
    if ($Force -or -not $global:txtMetaTitle.Text)       { $global:txtMetaTitle.Text = $titleGuess }
    if ($Force -or -not $global:txtMetaDescription.Text) { $global:txtMetaDescription.Text = $descGuess }
    if ($Force -or -not $global:txtMetaDestination.Text) { $global:txtMetaDestination.Text = $destGuess }
    if ($Force -or -not $global:txtMetaHeroAlt.Text)     { $global:txtMetaHeroAlt.Text = $heroAltGuess }

    if ($global:lblPublishStatus) {
        $src = if (Get-DraftSubtitle -Text $draftText) { "draft italic subtitle" } else { "generated from Tab 1 fields" }
        $global:lblPublishStatus.Text = "Auto-filled metadata (description source: $src). Review and tweak before Assemble."
        $global:lblPublishStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
    }
}

# Save toggle + settings back to config.json (called when user flips the checkbox)
function Save-ConfigJson {
    $out = [ordered]@{
        claudeApiKey    = $global:ClaudeApiKey
        claudeModel     = $global:ClaudeModel
        claudeMaxTokens = $global:ClaudeMaxTokens
        useClaudeAPI    = $global:UseClaudeAPI
    }
    try {
        $out | ConvertTo-Json -Depth 5 | Set-Content -Path $configPath -Encoding UTF8
    } catch {
        # Silent - not critical if config write fails
    }
}

# ============================================================================
# FIX-PASS HELPERS - run automatically on Assemble + Copy Photos
# ============================================================================
# Eliminates the need for a separate manual fix pass by baking in:
#   * Compress-Jpeg      - resize + JPEG compress in-place to under a size cap
#   * Fix-Mojibake       - repair UTF-8 double-encoding artifacts in pasted drafts
#   * ToTitleCase        - capitalize slug for display (phuket -> Phuket)
#   * Insert-GuidePhotoTags - smart section-based <GuidePhoto slot="..." /> inserter

function Compress-Jpeg {
    param(
        [Parameter(Mandatory)] [string] $Path,
        [int] $MaxDim = 1600,
        [int] $MaxKB = 450
    )
    if (-not (Test-Path $Path)) { return $null }

    $img = [System.Drawing.Image]::FromFile((Resolve-Path $Path).Path)
    try {
        # Compute new dimensions - cap longest edge at MaxDim
        $w = $img.Width; $h = $img.Height
        if ($w -gt $MaxDim -or $h -gt $MaxDim) {
            if ($w -ge $h) {
                $newW = $MaxDim
                $newH = [int]([Math]::Round($h * $MaxDim / $w))
            } else {
                $newH = $MaxDim
                $newW = [int]([Math]::Round($w * $MaxDim / $h))
            }
        } else {
            $newW = $w; $newH = $h
        }

        # Resize into new bitmap
        $resized = New-Object System.Drawing.Bitmap $newW, $newH
        $g = [System.Drawing.Graphics]::FromImage($resized)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()

        # Save with progressive quality steps until under MaxKB
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
        $qualityParam = [System.Drawing.Imaging.Encoder]::Quality

        $finalQ = 0
        $finalKB = 0
        foreach ($q in 85, 82, 79, 76, 73, 70, 67, 64) {
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityParam, [long]$q)
            $img.Dispose()  # release source file lock before save
            $resized.Save($Path, $jpegCodec, $encoderParams)
            $finalKB = [int]([Math]::Round((Get-Item $Path).Length / 1024))
            $finalQ = $q
            if ($finalKB -le $MaxKB) { break }
            # If not under cap, need to reload img reference for next iteration (already saved though)
            $img = [System.Drawing.Image]::FromFile((Resolve-Path $Path).Path)
        }

        $resized.Dispose()
        return @{ Width = $newW; Height = $newH; SizeKB = $finalKB; Quality = $finalQ }
    } finally {
        if ($img) { try { $img.Dispose() } catch {} }
    }
}

function Fix-Mojibake {
    param([string] $Text)
    if (-not $Text) { return $Text }
    # UTF-8 bytes-that-were-misread-as-Latin-1-and-re-encoded produce specific 2-3 byte sequences.
    # We build the target bytes explicitly via [char] codepoints to avoid PS source-encoding issues.
    $replacements = @(
        @{ from = [char]0xE2 + [char]0x80 + [char]0x99; to = "'" },   # curly apostrophe
        @{ from = [char]0xE2 + [char]0x80 + [char]0x9C; to = '"' },   # left double quote
        @{ from = [char]0xE2 + [char]0x80 + [char]0x9D; to = '"' },   # right double quote
        @{ from = [char]0xE2 + [char]0x80 + [char]0x93; to = '-' },   # en dash
        @{ from = [char]0xE2 + [char]0x80 + [char]0x94; to = '-' },   # em dash
        @{ from = [char]0xE2 + [char]0x80 + [char]0xA6; to = '...' }, # ellipsis
        @{ from = [char]0xE0 + [char]0xB8 + [char]0xBF; to = 'B' },   # baht sign ASCII fallback
        @{ from = [char]0xC2 + [char]0xB0;              to = 'deg' }, # degree sign ASCII fallback
        @{ from = [char]0xC3 + [char]0xA9;              to = 'e' },   # e-acute
        @{ from = [char]0xC3 + [char]0xA8;              to = 'e' },   # e-grave
        @{ from = [char]0xC2;                            to = '' }    # stray non-breaking space marker
    )
    foreach ($r in $replacements) {
        $Text = $Text.Replace($r.from, $r.to)
    }
    return $Text
}

function ConvertTo-TitleCase {
    param([string] $Text)
    if (-not $Text) { return $Text }
    # Capitalize each space-separated word (leave commas + existing caps alone)
    return ([System.Globalization.CultureInfo]::InvariantCulture.TextInfo).ToTitleCase($Text.ToLower())
}

function Insert-GuidePhotoTags {
    param(
        [string] $Body,
        [string] $Slug
    )
    if (-not $global:PhotoSlotPresets.Contains($Slug)) { return @{ Body = $Body; Inserted = 0 } }
    $slots = $global:PhotoSlotPresets[$Slug]
    $inserted = 0

    # Rule 1: whenToGo goes at end of ## When to go section (before next ##)
    if (($slots | Where-Object { $_.slot -eq 'whenToGo' }) -and ($Body -notmatch 'slot="whenToGo"')) {
        $Body = [regex]::Replace(
            $Body,
            '(?s)(## When to go\r?\n.*?)(\r?\n## )',
            {
                param($m)
                $inserted++
                "$($m.Groups[1].Value)`n`n<GuidePhoto slot=`"whenToGo`" />`n$($m.Groups[2].Value)"
            }
        )
    }

    # Rule 2: For each non-hero slot, try to match a "### Header" containing the slot keyword
    # Insert BEFORE the next "-> <AffiliateLink" line, or before next ### / ## if no arrow.
    # Uses fuzzy header matching (case-insensitive contains).
    $keywordMap = @{
        'wongamat'     = @('Wongamat', 'Wong Amat', 'Naklua', 'North Pattaya')
        'jomtien'      = @('Jomtien')
        'pratamnak'    = @('Pratamnak', 'Pratumnak')
        'central'      = @('Central Pattaya')
        'sanctuary'    = @('Sanctuary of Truth')
        'kohLarn'      = @('Koh Larn', 'Coral Island')
        'nongNooch'    = @('Nong Nooch')
        'fishMarket'   = @('Naklua Fish Market', 'fish market')
        'oldCity'      = @('Old City', 'Rattanakosin')
        'nimman'       = @('Nimman', 'Nimmanhaemin')
        'riverside'    = @('Riverside', 'Ping River', 'Bang Rak', 'Charoenrat', 'Wat Ket')
        'nightBazaar'  = @('Night Bazaar', 'Chang Khlan')
        'santitham'    = @('Santitham', 'Chang Puak')
        'doiSuthep'    = @('Doi Suthep')
        'khaoSoi'      = @('khao soi', 'Khao Soi')
        'ubud'         = @('Ubud')
        'canggu'       = @('Canggu')
        'seminyak'     = @('Seminyak', 'Petitenget')
        'uluwatu'      = @('Uluwatu')
        'sanur'        = @('Sanur')
        'nusaPenida'   = @('Nusa Penida', 'Kelingking')
        'cookingClass' = @('cooking class')
        'warung'       = @('warung')
        'sukhumvit'    = @('Sukhumvit', 'Asok', 'Phrom Phong')
        'silom'        = @('Silom', 'Sathorn')
        'oldTown'      = @('Old Town', 'Rattanakosin', 'Banglamphu')
        'activity'     = @('activity')
        'localTips'    = @('local tips')
        'kata'         = @('Kata', 'Karon')
        'bangTao'      = @('Bang Tao', 'Laguna', 'Kamala', 'Cherngtalay')
        'patong'       = @('Patong')
        'bigBuddha'    = @('Big Buddha', 'Wat Phra Yai')
        'phiPhi'       = @('Phi Phi')
        'khanomJeen'   = @('khanom jeen')
    }

    foreach ($slot in $slots) {
        if ($slot.slot -eq 'hero' -or $slot.slot -eq 'whenToGo') { continue }
        if ($Body -match "slot=`"$($slot.slot)`"") { continue }  # already there
        $keywords = $keywordMap[$slot.slot]
        if (-not $keywords) { continue }

        # First try: section header + inject before -> AffiliateLink
        $matched = $false
        foreach ($kw in $keywords) {
            $escKw = [regex]::Escape($kw)
            $pattern = "(?i)(### [^\n]*$escKw[^\n]*\r?\n(?:.*?\r?\n)*?)(-> <AffiliateLink)"
            if ($Body -match $pattern) {
                $Body = [regex]::Replace(
                    $Body, $pattern,
                    {
                        param($m)
                        $script:localHit = $true
                        "$($m.Groups[1].Value)`n<GuidePhoto slot=`"$($slot.slot)`" />`n`n$($m.Groups[2].Value)"
                    },
                    [System.Text.RegularExpressions.RegexOptions]::Singleline
                )
                if ($script:localHit) { $inserted++; $matched = $true; $script:localHit = $false; break }
            }
        }
        if ($matched) { continue }

        # Second try: first inline mention of keyword - insert on new line after that paragraph
        foreach ($kw in $keywords) {
            $escKw = [regex]::Escape($kw)
            $pattern = "(?i)($escKw[^\n]*\r?\n)"
            if ($Body -match $pattern) {
                $Body = [regex]::Replace(
                    $Body, $pattern,
                    {
                        param($m)
                        $script:localHit = $true
                        "$($m.Groups[1].Value)`n<GuidePhoto slot=`"$($slot.slot)`" />`n"
                    },
                    [System.Text.RegularExpressions.RegexOptions]::None, 1
                )
                if ($script:localHit) { $inserted++; $script:localHit = $false; break }
            }
        }
    }

    return @{ Body = $Body; Inserted = $inserted }
}

# Default current-guide state (overridable in UI)
$global:CurrentSlug = "chiang-mai"

# Photo slot PRESETS - swap per guide. Each preset has 8 slots.
# Slot key must match GuidePhoto.tsx PHOTOS dict keys (add there when publishing).
$global:PhotoSlotPresets = [ordered]@{
    "bangkok" = @(
        [pscustomobject]@{ slot="hero";      file="hero.jpg";       alt="Bangkok skyline at night with the Chao Phraya River in view" },
        [pscustomobject]@{ slot="whenToGo";  file="when-to-go.jpg"; alt="Songkran water festival celebration in the streets of Bangkok" },
        [pscustomobject]@{ slot="sukhumvit"; file="sukhumvit.jpg";  alt="BTS Skytrain running above Sukhumvit Road in Bangkok" },
        [pscustomobject]@{ slot="silom";     file="silom.jpg";      alt="Rooftop bar overlooking Bangkok's Silom skyline at sunset" },
        [pscustomobject]@{ slot="riverside"; file="riverside.jpg";  alt="Longtail boat on the Chao Phraya River at dusk, Bangkok" },
        [pscustomobject]@{ slot="oldTown";   file="old-town.jpg";   alt="Reclining Buddha statue at Wat Pho temple, Bangkok" },
        [pscustomobject]@{ slot="activity";  file="activity.jpg";   alt="Wat Arun temple silhouetted against sunset across the Chao Phraya" },
        [pscustomobject]@{ slot="localTips"; file="local-tips.jpg"; alt="Street food vendor cooking pad thai at a Bangkok night market" }
    )
    "chiang-mai" = @(
        [pscustomobject]@{ slot="hero";      file="hero.jpg";       alt="Doi Suthep golden temple overlooking Chiang Mai at sunset" },
        [pscustomobject]@{ slot="whenToGo";  file="when-to-go.jpg"; alt="Yi Peng lantern festival releasing sky lanterns at Mae Jo, Chiang Mai" },
        [pscustomobject]@{ slot="oldCity";   file="old-city.jpg";   alt="Chiang Mai Old City ancient moat and city wall at sunset" },
        [pscustomobject]@{ slot="nimman";    file="nimman.jpg";     alt="Nimman coffee shop and cafe district in Chiang Mai" },
        [pscustomobject]@{ slot="riverside"; file="riverside.jpg";  alt="Ping River teak houses at sunset in Chiang Mai" },
        [pscustomobject]@{ slot="santitham"; file="santitham.jpg";  alt="Santitham local Thai residential neighborhood Chiang Mai" },
        [pscustomobject]@{ slot="doiSuthep"; file="doi-suthep.jpg"; alt="Wat Phra That Doi Suthep golden temple with mountain view" },
        [pscustomobject]@{ slot="khaoSoi";   file="khao-soi.jpg";   alt="Bowl of Northern Thai khao soi curry noodles in Chiang Mai" }
    )
    "bali" = @(
        [pscustomobject]@{ slot="hero";         file="hero.jpg";          alt="Tegallalang rice terraces in the Ubud hills of Bali at sunrise" },
        [pscustomobject]@{ slot="whenToGo";     file="when-to-go.jpg";    alt="Balinese Nyepi Ogoh-Ogoh parade before the Day of Silence" },
        [pscustomobject]@{ slot="ubud";         file="ubud.jpg";          alt="Ubud rice terraces and jungle village in Bali" },
        [pscustomobject]@{ slot="canggu";       file="canggu.jpg";        alt="Surfer at Batu Bolong beach in Canggu, Bali" },
        [pscustomobject]@{ slot="seminyak";     file="seminyak.jpg";      alt="Seminyak beach club at sunset with cocktails on the sand" },
        [pscustomobject]@{ slot="uluwatu";      file="uluwatu.jpg";       alt="Uluwatu Temple perched on a cliff over the Indian Ocean at sunset" },
        [pscustomobject]@{ slot="nusaPenida";   file="nusa-penida.jpg";   alt="Kelingking Beach T-Rex cliff view on Nusa Penida" },
        [pscustomobject]@{ slot="cookingClass"; file="cooking-class.jpg"; alt="Balinese cooking class with fresh market ingredients" },
        [pscustomobject]@{ slot="warung";       file="warung.jpg";        alt="Traditional Balinese warung serving nasi campur and babi guling" }
    )
    "phuket" = @(
        [pscustomobject]@{ slot="hero";        file="hero.jpg";         alt="Promthep Cape sunset viewpoint at the southern tip of Phuket" },
        [pscustomobject]@{ slot="whenToGo";    file="when-to-go.jpg";   alt="Andaman coast red flag beach warning during monsoon season in Phuket" },
        [pscustomobject]@{ slot="kata";        file="kata.jpg";         alt="Kata Beach family-friendly Andaman coast in Phuket at sunset" },
        [pscustomobject]@{ slot="bangTao";     file="bang-tao.jpg";     alt="Bang Tao and Kamala luxury resort beach in northern Phuket" },
        [pscustomobject]@{ slot="oldTown";     file="old-town.jpg";     alt="Sino-Portuguese saffron shophouses on Thalang Road in Phuket Old Town" },
        [pscustomobject]@{ slot="patong";      file="patong.jpg";       alt="Patong Beach in daytime with longtail boats and busy sand strip" },
        [pscustomobject]@{ slot="bigBuddha";   file="big-buddha.jpg";   alt="Big Buddha Wat Phra Yai marble statue overlooking Phuket bay" },
        [pscustomobject]@{ slot="phiPhi";      file="phi-phi.jpg";      alt="Phi Phi Islands turquoise water and limestone cliffs day trip from Phuket" },
        [pscustomobject]@{ slot="khanomJeen";  file="khanom-jeen.jpg";  alt="Southern Thai khanom jeen curry rice noodles with fresh vegetables" }
    )
    "samui" = @(
        [pscustomobject]@{ slot="hero";         file="hero.jpg";          alt="Bophut Fisherman's Village lantern-lit walking street in Koh Samui at dusk" },
        [pscustomobject]@{ slot="whenToGo";     file="when-to-go.jpg";    alt="Ang Thong Marine Park emerald lagoon and limestone islands off Koh Samui" },
        [pscustomobject]@{ slot="bophut";       file="bophut.jpg";        alt="Bophut Fisherman's Village boutique dinner strip on the north coast of Koh Samui" },
        [pscustomobject]@{ slot="choengMon";    file="choeng-mon.jpg";    alt="Choeng Mon crescent beach with calm swimming water on Koh Samui's east tip" },
        [pscustomobject]@{ slot="chaweng";      file="chaweng.jpg";       alt="Chaweng Beach main tourist strip and long sand strip on Koh Samui" },
        [pscustomobject]@{ slot="lamai";        file="lamai.jpg";         alt="Lamai Beach and Hin Ta Hin Yai grandfather grandmother rock formations Koh Samui" },
        [pscustomobject]@{ slot="bigBuddha";    file="big-buddha.jpg";    alt="Big Buddha Wat Phra Yai gold statue on Ko Fan islet Koh Samui" },
        [pscustomobject]@{ slot="angThong";     file="ang-thong.jpg";     alt="Ang Thong National Marine Park limestone archipelago day trip from Koh Samui" },
        [pscustomobject]@{ slot="nathonMarket"; file="nathon-market.jpg"; alt="Nathon fresh market grilled fish and Thai food stalls at dawn Koh Samui" }
    )
    "pattaya" = @(
        [pscustomobject]@{ slot="hero";        file="hero.jpg";         alt="Wongamat Beach at sunset with the Pattaya coastline in the background" },
        [pscustomobject]@{ slot="whenToGo";    file="when-to-go.jpg";   alt="Songkran and Wan Lai water festival celebration in Pattaya" },
        [pscustomobject]@{ slot="wongamat";    file="wongamat.jpg";     alt="Wongamat Beach at sunset with palms and family-friendly seafront in North Pattaya" },
        [pscustomobject]@{ slot="jomtien";     file="jomtien.jpg";      alt="Jomtien Beach with tree shade and calm sand south of Pattaya" },
        [pscustomobject]@{ slot="pratamnak";   file="pratamnak.jpg";    alt="Pratamnak Hill viewpoint over Pattaya Bay with Big Buddha Wat Phra Yai" },
        [pscustomobject]@{ slot="central";     file="central.jpg";      alt="Central Pattaya beach and skyline near Central Festival mall" },
        [pscustomobject]@{ slot="sanctuary";   file="sanctuary.jpg";    alt="Sanctuary of Truth all-teak temple by the sea in Pattaya" },
        [pscustomobject]@{ slot="kohLarn";     file="koh-larn.jpg";     alt="Coral Island Koh Larn white sand beach and turquoise water day trip from Pattaya" },
        [pscustomobject]@{ slot="nongNooch";   file="nong-nooch.jpg";   alt="Nong Nooch Tropical Botanical Garden with topiary and orchid houses" },
        [pscustomobject]@{ slot="fishMarket";  file="fish-market.jpg";  alt="Naklua Fish Market grilled seafood and local Thai stalls at dawn" }
    )
    "generic" = @(
        [pscustomobject]@{ slot="hero";          file="hero.jpg";          alt="Hero image - main destination shot" },
        [pscustomobject]@{ slot="whenToGo";      file="when-to-go.jpg";    alt="Seasonal image (festival, weather)" },
        [pscustomobject]@{ slot="neighborhood1"; file="neighborhood-1.jpg";alt="First neighborhood" },
        [pscustomobject]@{ slot="neighborhood2"; file="neighborhood-2.jpg";alt="Second neighborhood" },
        [pscustomobject]@{ slot="neighborhood3"; file="neighborhood-3.jpg";alt="Third neighborhood" },
        [pscustomobject]@{ slot="neighborhood4"; file="neighborhood-4.jpg";alt="Fourth neighborhood" },
        [pscustomobject]@{ slot="activity";      file="activity.jpg";      alt="Signature activity" },
        [pscustomobject]@{ slot="localTips";     file="local-tips.jpg";    alt="Local tips / food shot" }
    )
}

# ===================================================================
# PREVENTION MECHANISM: Auto-import presets from components/GuidePhoto.tsx
# ===================================================================
# GuidePhoto.tsx is the runtime source of truth - Vercel needs it to render
# the guide's photos. If it defines slots for a guide, those slots MUST exist
# in this app or the workflow silently falls back to "generic" (the bug we
# hit repeatedly). This function parses GuidePhoto.tsx at launch and merges
# each guide's slot definitions into $global:PhotoSlotPresets, overwriting
# hardcoded values. Result: as long as a guide is added to GuidePhoto.tsx,
# it appears in the slot preset dropdown with the correct slot names.
# Hardcoded presets above serve as a safety net if the parse fails.
function Import-PresetsFromGuidePhoto {
    param([string]$RepoRoot)
    $tsxPath = Join-Path $RepoRoot "components\GuidePhoto.tsx"
    if (-not (Test-Path $tsxPath)) { return 0 }
    try {
        $content = [System.IO.File]::ReadAllText($tsxPath)
        # Locate the GUIDES const block, walk braces to find its close
        $startIdx = $content.IndexOf('const GUIDES')
        if ($startIdx -lt 0) { return 0 }
        $openIdx = $content.IndexOf('{', $startIdx)
        if ($openIdx -lt 0) { return 0 }
        $depth = 1; $i = $openIdx + 1
        while ($i -lt $content.Length -and $depth -gt 0) {
            $c = $content[$i]
            if ($c -eq '{') { $depth++ }
            elseif ($c -eq '}') { $depth-- }
            $i++
        }
        if ($depth -ne 0) { return 0 }
        $body = $content.Substring($openIdx + 1, $i - $openIdx - 2)

        # Walk top-level guide blocks: `"slug": { ... }` or `slug: { ... }`
        $imported = 0
        $j = 0
        while ($j -lt $body.Length) {
            # Skip whitespace, commas, and comment lines
            while ($j -lt $body.Length) {
                $ch = $body[$j]
                if ($ch -eq ' ' -or $ch -eq "`n" -or $ch -eq "`r" -or $ch -eq "`t" -or $ch -eq ',') { $j++; continue }
                # Skip // comment to end of line
                if ($ch -eq '/' -and ($j + 1) -lt $body.Length -and $body[$j + 1] -eq '/') {
                    while ($j -lt $body.Length -and $body[$j] -ne "`n") { $j++ }
                    continue
                }
                break
            }
            if ($j -ge $body.Length) { break }
            $rest = $body.Substring($j)
            if ($rest -match '^"?([\w-]+)"?\s*:\s*\{') {
                $slug = $matches[1]
                $keyLen = $matches[0].Length
                $blockOpen = $j + $keyLen
                # Find matching close brace for this guide's slot map
                $d = 1; $k = $blockOpen
                while ($k -lt $body.Length -and $d -gt 0) {
                    $c = $body[$k]
                    if ($c -eq '{') { $d++ }
                    elseif ($c -eq '}') { $d-- }
                    $k++
                }
                if ($d -ne 0) { break }
                $slotBody = $body.Substring($blockOpen, $k - $blockOpen - 1)
                # Extract each slot: `slot: { file: "...", alt: "..." }`
                $slotMatches = [regex]::Matches($slotBody, '(\w+)\s*:\s*\{\s*file:\s*"([^"]+)"\s*,\s*alt:\s*"([^"]+)"\s*\}')
                if ($slotMatches.Count -gt 0) {
                    $slots = @()
                    foreach ($sm in $slotMatches) {
                        $slots += [pscustomobject]@{
                            slot = $sm.Groups[1].Value
                            file = $sm.Groups[2].Value
                            alt  = $sm.Groups[3].Value
                        }
                    }
                    $global:PhotoSlotPresets[$slug] = $slots
                    $imported++
                }
                $j = $k
            } else {
                $j++
            }
        }
        return $imported
    } catch {
        return 0
    }
}

# Run the auto-importer so any guide defined in GuidePhoto.tsx wins over
# stale hardcoded presets above. Silent on failure - hardcoded is the fallback.
$global:AutoImportedPresetCount = Import-PresetsFromGuidePhoto -RepoRoot $PSScriptRoot

# Active preset - defaults to current slug if there's a match, else "generic"
$global:PhotoSlots = if ($global:PhotoSlotPresets.Contains($global:CurrentSlug)) {
    $global:PhotoSlotPresets[$global:CurrentSlug]
} else {
    $global:PhotoSlotPresets["generic"]
}

# Free-photo source URLs - Search buttons open these with alt text as query.
$global:PhotoSourceUrls = [ordered]@{
    "Pixabay"   = "https://pixabay.com/images/search/{Q}/"
    "Unsplash"  = "https://unsplash.com/s/photos/{Q}"
    "Pexels"    = "https://www.pexels.com/search/{Q}/"
    "Wikimedia" = "https://commons.wikimedia.org/w/index.php?search={Q}&title=Special:MediaSearch&type=image"
}

function Search-Photo {
    param([string]$Source, [string]$Query)
    if (-not $global:PhotoSourceUrls.Contains($Source)) { throw "Unknown source: $Source" }
    if (-not $Query) { $Query = "travel destination" }
    $url = $global:PhotoSourceUrls[$Source] -replace '\{Q\}', [uri]::EscapeDataString($Query)
    Start-Process $url
    [System.Windows.Forms.Clipboard]::SetText($Query)
}

# Metadata - driven by Tab 3 form fields
$global:Meta = [pscustomobject]@{
    slug        = "chiang-mai"
    title       = ""
    description = ""
    author      = "Niphon Srisawat"
    destination = ""
    publishDate = (Get-Date -Format "yyyy-MM-dd")
    lastUpdated = (Get-Date -Format "yyyy-MM-dd")
    heroAlt     = ""
}

# Photo file paths chosen by user (populated on drop or file-pick)
$global:PickedPhotos = @{}

# AI-phrase blocklist - flag these on Save Draft
$global:AiPhrases = @(
    "vibrant tapestry", "hidden gem", "something for everyone", "must-visit",
    "bustling metropolis", "charming", "picturesque", "at your fingertips",
    "in the heart of", "look no further", "nestled in", "boasts a",
    "delve into", "unlock the", "a myriad of", "unparalleled",
    "world-class", "a stone's throw"
)

# ============================================================================
# CLAUDE API
# ============================================================================
function Invoke-ClaudeAPI {
    param(
        [Parameter(Mandatory)] [string] $UserPrompt,
        [string] $SystemPrompt = "",
        [int]    $MaxTokens = 0
    )

    if (-not $global:ClaudeApiKey) {
        throw "Claude API key not configured. Copy guide-workflow-config.example.json to guide-workflow-config.json and fill in your API key."
    }
    if ($MaxTokens -le 0) { $MaxTokens = $global:ClaudeMaxTokens }

    $body = @{
        model      = $global:ClaudeModel
        max_tokens = $MaxTokens
        messages   = @(
            @{ role = "user"; content = $UserPrompt }
        )
    }
    if ($SystemPrompt) { $body.system = $SystemPrompt }

    $headers = @{
        "x-api-key"         = $global:ClaudeApiKey
        "anthropic-version" = "2023-06-01"
        "content-type"      = "application/json"
    }

    $json = $body | ConvertTo-Json -Depth 20 -Compress

    try {
        $response = Invoke-RestMethod `
            -Uri "https://api.anthropic.com/v1/messages" `
            -Method POST -Headers $headers -Body $json -TimeoutSec 300
        return $response.content[0].text
    } catch {
        $err = $_.Exception.Message
        $detail = if ($_.ErrorDetails) { $_.ErrorDetails.Message } else { "" }
        throw "Claude API error: $err`n$detail"
    }
}

# ============================================================================
# PROMPT BUILDERS
# ============================================================================
function Get-ResearchPrompt {
    param(
        [string]$Destination = "Chiang Mai",
        [string]$Country     = "Thailand",
        [string]$PublishMonth = "September 2026"
    )

    @"
I am writing a comprehensive travel guide for $Destination, $Country for my travel-affiliate website, driftcoconut.com. The guide will be published in $PublishMonth and needs to be accurate as of that date.

Please research and provide the following, with source citations for every claim:

1. BEST TIME TO VISIT: Month-by-month breakdown covering weather (temperature in Celsius, rainfall pattern), tourist seasonality (peak/shoulder/low), and major festivals with exact 2026 and 2027 dates. Include air quality / burning season warnings if applicable. Include price-impact-per-season observations.

2. QUICK FACTS: Airport code(s), currency + current USD exchange rate, time zone (with/without DST), primary languages, visa-on-arrival rules for US / UK / EU / Australia / Japan / South Korea passport holders (current 2026 status), cost of a mid-range day in USD (accommodation + 3 meals + local transport).

3. NEIGHBORHOOD BREAKDOWN: Identify 4 best neighborhoods for tourists. For each:
   - Character in one sentence
   - Who it suits (families / digital nomads / luxury / backpackers)
   - Price range of typical mid-range hotel (USD/night)
   - 2 named example hotels with current 2026 pricing if possible
   - What's within walking distance
   - Nearest metro / BTS / transport station

4. TOP 8 THINGS TO DO: Organized by time commitment (2 half-day, 4 full-day, 2 multi-day excursions). Include name, one-line description, cost in local currency and USD, whether advance booking is needed, best time of day/week.

5. GETTING AROUND: Local transport with actual prices (metro, taxi, ride-share apps, tuk-tuk, motorbike). Airport-to-city transfer options and time.

6. LOCAL CUSTOMS + SCAMS: 3 etiquette rules that surprise visitors. 3 currently-active tourist scams. 1 obscure insider tip only a resident would know.

7. FAQ FACTS: Solo female traveler safety, days needed for first-timers, daily budget backpacker/mid-range/luxury in USD, cash-vs-card acceptance, best area for first-time visitors.

8. ANY DESTINATION-SPECIFIC WARNINGS: Air quality, monsoon, active political situations, health advisories.

Format: Cite a source URL for every price, every date, every claim. Prefer official tourism boards, recent 2025-2026 travel blogs, and current expat forums (Reddit) over Wikipedia. Flag anything you're uncertain about with [UNCERTAIN].
"@
}

function Get-DraftPrompt {
    param(
        [string]$Destination   = "Chiang Mai",
        [string]$Country       = "Thailand",
        [string]$PublishMonth  = "September 2026",
        [string]$ResearchDoc   = "",
        [string]$PersonalNotes = ""
    )

    @"
You are drafting a destination guide for driftcoconut.com, a travel affiliate site with an Asia-Pacific focus and a "coastal drift" brand voice - warm, unhurried, specific. This guide is for $Destination, $Country. It will be published in $PublishMonth.

BRAND VOICE RULES (strict):
- Second-person, conversational, expert
- Zero cliche phrases like "vibrant tapestry", "hidden gem", "something for everyone", "must-visit", "bustling metropolis", "charming"
- Concrete over abstract: name streets, name restaurants, name price points in local currency + USD
- Never symmetric bullet patterns like "whether you're X, Y, or Z"
- Every claim must be backed by the research doc below - don't invent
- The author is a Thailand-based traveler (Niphon Srisawat, founder of driftcoconut). Write with local Asia insider authority.

STRUCTURE (must follow exactly):

*One-line subtitle in italics - vibe-capturing, not descriptive*

## Quick facts
[Bulleted sidebar-style facts from research]

## When to go
[~300 words. Month-by-month weather + tourism + price patterns. Include specific festival dates from research.]

## Where to stay
[~500 words. Cover 4 neighborhoods. For each: character sentence, who it suits, USD price range, 2 named hotels from research, walkable landmarks, nearest transport. End each neighborhood with a natural sentence like:
-> <AffiliateLink type="booking" query="{Neighborhood} $Destination">Browse {neighborhood} hotels on Booking.com</AffiliateLink>]

## Things to do
[~400 words. 8 activities organized as: half-day, full-day, multi-day excursions. Name each, describe in 2-3 sentences with cost. For any organized tour, wrap with:
<AffiliateLink type="klook" query="{Activity} $Destination">book the {activity} on Klook</AffiliateLink>]

## Getting around
[~200 words. Airport transfer, local transport, prices. Include naturally once:
book <AffiliateLink type="welcomePickups">Welcome Pickups</AffiliateLink> ahead
Grab an <AffiliateLink type="airalo">Airalo</AffiliateLink> eSIM before you land]

## Local tips + scams
[~250 words. 3 etiquette, 3 scams, 1 insider tip. Feel like a local wrote it.]

## FAQ
[Format as `### Question` then 40-60 word answer. Include:
- Solo female traveler safety
- How many days do I need
- Is $Destination expensive
- Best area for first-timers
- Do I need cash
- $Destination-specific bonus question]

## Related destinations
[One-line closer with 3 related destinations.]

TOTAL LENGTH: 1,900 to 2,200 words.

--- RESEARCH DOC ---
$ResearchDoc

--- PERSONAL NOTES ON $Destination ---
$PersonalNotes

Now draft the guide. Start directly with the italicized subtitle. Do not include the # title heading - the guide page renders that from frontmatter. Do not include preamble or meta-commentary.
"@
}

# ============================================================================
# HELPERS
# ============================================================================
function Get-CurrentDraftDir {
    $dir = Join-Path $global:DraftsRoot $global:CurrentSlug
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    return $dir
}

function Get-CurrentPhotosDir {
    $dir = Join-Path $global:PhotosRoot $global:CurrentSlug
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    return $dir
}

function Count-Words {
    param([string]$Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return 0 }
    return ($Text -split '\s+' | Where-Object { $_ -match '\S' }).Count
}

function Find-AiPhrases {
    param([string]$Text)
    $found = @()
    foreach ($p in $global:AiPhrases) {
        if ($Text -match [regex]::Escape($p)) { $found += $p }
    }
    return $found
}

function New-RichBox {
    param([int]$X, [int]$Y, [int]$W, [int]$H, [string]$Placeholder = "")
    $rtb = New-Object System.Windows.Forms.RichTextBox
    $rtb.Location = New-Object System.Drawing.Point($X, $Y)
    $rtb.Size = New-Object System.Drawing.Size($W, $H)
    $rtb.Font = New-Object System.Drawing.Font("Consolas", 9)
    $rtb.AcceptsTab = $true
    $rtb.WordWrap = $true
    $rtb.ScrollBars = "Vertical"
    if ($Placeholder) { $rtb.Text = $Placeholder }
    return $rtb
}

function New-TabButton {
    param([string]$Text, [int]$X)
    $b = New-Object System.Windows.Forms.Button
    $b.Text = $Text
    $b.Location = New-Object System.Drawing.Point($X, 0)
    $b.Size = New-Object System.Drawing.Size(200, 32)
    $b.FlatStyle = "Flat"
    $b.BackColor = [System.Drawing.Color]::FromArgb(244, 235, 218)  # sand
    $b.ForeColor = [System.Drawing.Color]::FromArgb(26, 99, 119)    # sea-700
    $b.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    return $b
}

function Set-ActiveTab {
    param([string]$Which)
    $global:panelResearch.Visible = ($Which -eq "research")
    $global:panelDraft.Visible    = ($Which -eq "draft")
    $global:panelPublish.Visible  = ($Which -eq "publish")

    # highlight active tab button
    $active = [System.Drawing.Color]::FromArgb(30, 122, 145)  # sea-600
    $inactive = [System.Drawing.Color]::FromArgb(244, 235, 218)
    $global:btnTabResearch.BackColor = if ($Which -eq "research") { $active } else { $inactive }
    $global:btnTabResearch.ForeColor = if ($Which -eq "research") { [System.Drawing.Color]::White } else { [System.Drawing.Color]::FromArgb(26,99,119) }
    $global:btnTabDraft.BackColor    = if ($Which -eq "draft") { $active } else { $inactive }
    $global:btnTabDraft.ForeColor    = if ($Which -eq "draft") { [System.Drawing.Color]::White } else { [System.Drawing.Color]::FromArgb(26,99,119) }
    $global:btnTabPublish.BackColor  = if ($Which -eq "publish") { $active } else { $inactive }
    $global:btnTabPublish.ForeColor  = if ($Which -eq "publish") { [System.Drawing.Color]::White } else { [System.Drawing.Color]::FromArgb(26,99,119) }
}

# ============================================================================
# MAIN FORM
# ============================================================================
$form = New-Object System.Windows.Forms.Form
$form.Text = "driftcoconut Guide Workflow - Claude edition"
$form.Size = New-Object System.Drawing.Size(980, 870)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(251, 247, 240)  # warm paper
$form.Font = New-Object System.Drawing.Font("Segoe UI", 9)

# --- HEADER STRIP (destination + slug + Claude status) ---
$header = New-Object System.Windows.Forms.Panel
$header.Location = New-Object System.Drawing.Point(10, 8)
$header.Size = New-Object System.Drawing.Size(945, 40)
$header.BackColor = [System.Drawing.Color]::FromArgb(240, 249, 251)

$lblGuideTitle = New-Object System.Windows.Forms.Label
$lblGuideTitle.Text = "Guide:"
$lblGuideTitle.Location = New-Object System.Drawing.Point(8, 12)
$lblGuideTitle.Size = New-Object System.Drawing.Size(45, 18)
$header.Controls.Add($lblGuideTitle)

$txtHeaderSlug = New-Object System.Windows.Forms.TextBox
$txtHeaderSlug.Text = $global:CurrentSlug
$txtHeaderSlug.Location = New-Object System.Drawing.Point(55, 10)
$txtHeaderSlug.Size = New-Object System.Drawing.Size(150, 22)
$txtHeaderSlug.Add_TextChanged({
    # Force lowercase + kebab-case (Linux/Vercel filesystems are case-sensitive; slugs
    # must match the URL exactly). Prevents the Bali.mdx / Pattaya.mdx case-mismatch bug.
    $raw = $txtHeaderSlug.Text.Trim().ToLower() -replace '\s+', '-'
    if ($raw -ne $txtHeaderSlug.Text) {
        # Preserve cursor position while rewriting the field
        $pos = $txtHeaderSlug.SelectionStart
        $txtHeaderSlug.Text = $raw
        $txtHeaderSlug.SelectionStart = [Math]::Min($pos, $raw.Length)
    }
    $global:CurrentSlug = $raw
    if ($global:CurrentSlug) { $global:Meta.slug = $global:CurrentSlug }

    # Auto-switch photo preset when slug matches a known preset key
    if ($global:cmbPreset -and $global:PhotoSlotPresets.Contains($raw)) {
        if ($global:cmbPreset.SelectedItem -ne $raw) {
            $global:cmbPreset.SelectedItem = $raw
        }
    }
}.GetNewClosure())
$header.Controls.Add($txtHeaderSlug)

# API toggle checkbox - lets user switch between "auto" (call Claude API directly)
# and "manual" (copy prompts to Claude Cowork / Perplexity / Gemini, paste back).
$global:chkUseAPI = New-Object System.Windows.Forms.CheckBox
$global:chkUseAPI.Text = "Use Claude API"
$global:chkUseAPI.Location = New-Object System.Drawing.Point(215, 12)
$global:chkUseAPI.Size = New-Object System.Drawing.Size(120, 20)
$global:chkUseAPI.Checked = $global:UseClaudeAPI
$header.Controls.Add($global:chkUseAPI)

$global:lblApiStatus = New-Object System.Windows.Forms.Label
$global:lblApiStatus.Location = New-Object System.Drawing.Point(340, 12)
$global:lblApiStatus.Size = New-Object System.Drawing.Size(600, 18)
$header.Controls.Add($global:lblApiStatus)

# Compute the status label + colour based on toggle + key presence.
function Update-ApiStatusLabel {
    if ($global:UseClaudeAPI) {
        if ($global:ClaudeApiKey) {
            $global:lblApiStatus.Text = "AUTO mode: Claude API ready ($($global:ClaudeModel))"
            $global:lblApiStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
        } else {
            $global:lblApiStatus.Text = "AUTO mode ON but NO API KEY - edit guide-workflow-config.json"
            $global:lblApiStatus.ForeColor = [System.Drawing.Color]::Firebrick
        }
    } else {
        $global:lblApiStatus.Text = "MANUAL mode: Copy prompt -> paste into Claude Cowork / Perplexity / Gemini -> paste output back"
        $global:lblApiStatus.ForeColor = [System.Drawing.Color]::FromArgb(120, 90, 30)
    }
    # Also flip button enable state (set once buttons exist)
    if ($global:btnRunClaudeResearch) {
        $enabled = $global:UseClaudeAPI -and [bool]$global:ClaudeApiKey
        $global:btnRunClaudeResearch.Enabled = $enabled
        $global:btnRunClaudeDraft.Enabled    = $enabled
    }
}

$global:chkUseAPI.Add_CheckedChanged({
    $global:UseClaudeAPI = $global:chkUseAPI.Checked
    Save-ConfigJson
    Update-ApiStatusLabel
}.GetNewClosure())

$form.Controls.Add($header)

# Initial paint of status label (button state gets set after buttons are created)
Update-ApiStatusLabel

# --- TAB BAR ---
$tabBar = New-Object System.Windows.Forms.Panel
$tabBar.Location = New-Object System.Drawing.Point(10, 54)
$tabBar.Size = New-Object System.Drawing.Size(945, 36)
$tabBar.BackColor = [System.Drawing.Color]::FromArgb(251, 247, 240)

$global:btnTabResearch = New-TabButton "1. Research" 0
$global:btnTabDraft    = New-TabButton "2. Notes -> Draft + Voice" 210
$global:btnTabPublish  = New-TabButton "3. Photos + Publish" 420

$tabBar.Controls.Add($global:btnTabResearch)
$tabBar.Controls.Add($global:btnTabDraft)
$tabBar.Controls.Add($global:btnTabPublish)
$form.Controls.Add($tabBar)

# --- PANEL AREA ---
$panelTop = 96
$panelH   = 730

# ============================================================================
# TAB 1: RESEARCH
# ============================================================================
$global:panelResearch = New-Object System.Windows.Forms.Panel
$global:panelResearch.Location = New-Object System.Drawing.Point(10, $panelTop)
$global:panelResearch.Size = New-Object System.Drawing.Size(945, $panelH)
$global:panelResearch.BackColor = [System.Drawing.Color]::White

# Row: Destination / Country / Publish Month
$lbl1 = New-Object System.Windows.Forms.Label
$lbl1.Text = "Destination:"; $lbl1.Location = New-Object System.Drawing.Point(10, 12); $lbl1.Size = New-Object System.Drawing.Size(70, 18)
$global:panelResearch.Controls.Add($lbl1)

$txtDest = New-Object System.Windows.Forms.TextBox
$txtDest.Text = "Chiang Mai"
$txtDest.Location = New-Object System.Drawing.Point(80, 10); $txtDest.Size = New-Object System.Drawing.Size(180, 22)
$global:panelResearch.Controls.Add($txtDest)

$lbl2 = New-Object System.Windows.Forms.Label
$lbl2.Text = "Country:"; $lbl2.Location = New-Object System.Drawing.Point(275, 12); $lbl2.Size = New-Object System.Drawing.Size(55, 18)
$global:panelResearch.Controls.Add($lbl2)

$txtCountry = New-Object System.Windows.Forms.TextBox
$txtCountry.Text = "Thailand"
$txtCountry.Location = New-Object System.Drawing.Point(330, 10); $txtCountry.Size = New-Object System.Drawing.Size(140, 22)
$global:panelResearch.Controls.Add($txtCountry)

$lbl3 = New-Object System.Windows.Forms.Label
$lbl3.Text = "Publish month:"; $lbl3.Location = New-Object System.Drawing.Point(485, 12); $lbl3.Size = New-Object System.Drawing.Size(90, 18)
$global:panelResearch.Controls.Add($lbl3)

$txtMonth = New-Object System.Windows.Forms.TextBox
$txtMonth.Text = "September 2026"
$txtMonth.Location = New-Object System.Drawing.Point(575, 10); $txtMonth.Size = New-Object System.Drawing.Size(140, 22)
$global:panelResearch.Controls.Add($txtMonth)

# Button row - tool dropdown + Send button + Copy + Run Claude + Load/Save
$lblTool = New-Object System.Windows.Forms.Label
$lblTool.Text = "Send to:"; $lblTool.Location = New-Object System.Drawing.Point(10, 50); $lblTool.Size = New-Object System.Drawing.Size(55, 18)
$global:panelResearch.Controls.Add($lblTool)

$global:cmbResearchTool = New-Object System.Windows.Forms.ComboBox
$global:cmbResearchTool.Location = New-Object System.Drawing.Point(65, 47); $global:cmbResearchTool.Size = New-Object System.Drawing.Size(110, 22)
$global:cmbResearchTool.DropDownStyle = 'DropDownList'
foreach ($k in $global:ResearchTools.Keys) { [void]$global:cmbResearchTool.Items.Add($k) }
$global:cmbResearchTool.SelectedIndex = 0  # Perplexity default
$global:panelResearch.Controls.Add($global:cmbResearchTool)

$btnSendResearch = New-Object System.Windows.Forms.Button
$btnSendResearch.Text = "Copy + Open"
$btnSendResearch.Location = New-Object System.Drawing.Point(180, 45); $btnSendResearch.Size = New-Object System.Drawing.Size(110, 28)
$btnSendResearch.BackColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
$btnSendResearch.ForeColor = [System.Drawing.Color]::White
$btnSendResearch.FlatStyle = "Flat"
$global:panelResearch.Controls.Add($btnSendResearch)

$btnCopyResearchPrompt = New-Object System.Windows.Forms.Button
$btnCopyResearchPrompt.Text = "Copy only"
$btnCopyResearchPrompt.Location = New-Object System.Drawing.Point(295, 45); $btnCopyResearchPrompt.Size = New-Object System.Drawing.Size(90, 28)
$global:panelResearch.Controls.Add($btnCopyResearchPrompt)

$global:btnRunClaudeResearch = New-Object System.Windows.Forms.Button
$global:btnRunClaudeResearch.Text = "Run Claude API"
$global:btnRunClaudeResearch.Location = New-Object System.Drawing.Point(390, 45); $global:btnRunClaudeResearch.Size = New-Object System.Drawing.Size(120, 28)
$global:btnRunClaudeResearch.BackColor = [System.Drawing.Color]::FromArgb(120, 90, 30)
$global:btnRunClaudeResearch.ForeColor = [System.Drawing.Color]::White
$global:btnRunClaudeResearch.FlatStyle = "Flat"
$global:panelResearch.Controls.Add($global:btnRunClaudeResearch)

$btnLoadResearch = New-Object System.Windows.Forms.Button
$btnLoadResearch.Text = "Load research.md"
$btnLoadResearch.Location = New-Object System.Drawing.Point(515, 45); $btnLoadResearch.Size = New-Object System.Drawing.Size(130, 28)
$global:panelResearch.Controls.Add($btnLoadResearch)

$btnSaveResearch = New-Object System.Windows.Forms.Button
$btnSaveResearch.Text = "Save research.md"
$btnSaveResearch.Location = New-Object System.Drawing.Point(650, 45); $btnSaveResearch.Size = New-Object System.Drawing.Size(130, 28)
$global:panelResearch.Controls.Add($btnSaveResearch)

$lblResearchStatus = New-Object System.Windows.Forms.Label
$lblResearchStatus.Location = New-Object System.Drawing.Point(10, 78); $lblResearchStatus.Size = New-Object System.Drawing.Size(920, 18)
$lblResearchStatus.ForeColor = [System.Drawing.Color]::DimGray
$global:panelResearch.Controls.Add($lblResearchStatus)

# Copy + Open handler - copies prompt to clipboard AND opens the selected tool in browser
$btnSendResearch.Add_Click({
    $tool = $global:cmbResearchTool.SelectedItem
    Send-PromptToTool -Prompt $global:txtResearchPrompt.Text -ToolName $tool
    $lblResearchStatus.Text = "Prompt copied to clipboard. Opened $tool in browser - paste with Ctrl+V, then paste the result back into the Research output box below."
    $lblResearchStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
}.GetNewClosure())

# Prompt preview
$lblPrompt = New-Object System.Windows.Forms.Label
$lblPrompt.Text = "Research prompt (auto-generated from the 3 fields above; edit if needed):"
$lblPrompt.Location = New-Object System.Drawing.Point(10, 102); $lblPrompt.Size = New-Object System.Drawing.Size(500, 18)
$global:panelResearch.Controls.Add($lblPrompt)

$global:txtResearchPrompt = New-RichBox 10 122 920 210
$global:txtResearchPrompt.BackColor = [System.Drawing.Color]::FromArgb(248, 250, 252)
$global:panelResearch.Controls.Add($global:txtResearchPrompt)

# Research output
$lblOutput = New-Object System.Windows.Forms.Label
$lblOutput.Text = "Research output (paste the result from Perplexity/Gemini/etc. here, or Claude API auto-fills):"
$lblOutput.Location = New-Object System.Drawing.Point(10, 345); $lblOutput.Size = New-Object System.Drawing.Size(700, 18)
$global:panelResearch.Controls.Add($lblOutput)

$global:txtResearchOutput = New-RichBox 10 365 920 340
$global:panelResearch.Controls.Add($global:txtResearchOutput)

# Auto-refresh prompt when fields change
$refreshPrompt = {
    $global:txtResearchPrompt.Text = Get-ResearchPrompt -Destination $txtDest.Text -Country $txtCountry.Text -PublishMonth $txtMonth.Text
}.GetNewClosure()
$txtDest.Add_TextChanged($refreshPrompt)
$txtCountry.Add_TextChanged($refreshPrompt)
$txtMonth.Add_TextChanged($refreshPrompt)
& $refreshPrompt

# Copy prompt to clipboard
$btnCopyResearchPrompt.Add_Click({
    [System.Windows.Forms.Clipboard]::SetText($global:txtResearchPrompt.Text)
    $lblResearchStatus.Text = "Copied research prompt to clipboard."
    $lblResearchStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
}.GetNewClosure())

# Run Claude Research
$global:btnRunClaudeResearch.Add_Click({
    if (-not $global:ClaudeApiKey) {
        [System.Windows.Forms.MessageBox]::Show("Configure Claude API key in guide-workflow-config.json first.", "No API key", 'OK', 'Warning') | Out-Null
        return
    }
    $global:btnRunClaudeResearch.Enabled = $false
    $lblResearchStatus.Text = "Calling Claude... (may take 30-90 sec)"
    $lblResearchStatus.ForeColor = [System.Drawing.Color]::DarkOrange
    $global:panelResearch.Refresh()
    try {
        $result = Invoke-ClaudeAPI -UserPrompt $global:txtResearchPrompt.Text -MaxTokens $global:ClaudeMaxTokens
        $global:txtResearchOutput.Text = $result
        $wc = Count-Words $result
        $lblResearchStatus.Text = "Claude returned $wc words. Review, then Save research.md."
        $lblResearchStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
    } catch {
        [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "Claude API error", 'OK', 'Error') | Out-Null
        $lblResearchStatus.Text = "Claude call failed."
        $lblResearchStatus.ForeColor = [System.Drawing.Color]::Firebrick
    } finally {
        $global:btnRunClaudeResearch.Enabled = $true
    }
}.GetNewClosure())

# Load research file - opens a file picker so user can pick any .md/.txt from anywhere
$btnLoadResearch.Add_Click({
    $ofd = New-Object System.Windows.Forms.OpenFileDialog
    $ofd.Title = "Select a research .md/.txt file to load"
    $ofd.Filter = "Markdown/Text (*.md;*.txt;*.mdx)|*.md;*.txt;*.mdx|All files (*.*)|*.*"
    $ofd.InitialDirectory = $global:DraftsRoot
    $result = $ofd.ShowDialog()
    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        try {
            $global:txtResearchOutput.Text = Get-Content $ofd.FileName -Raw -ErrorAction Stop
            $wc = Count-Words $global:txtResearchOutput.Text
            $lblResearchStatus.Text = "Loaded: $($ofd.FileName)  ($wc words)"
            $lblResearchStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
        } catch {
            $lblResearchStatus.Text = "Failed to load: $($_.Exception.Message)"
            $lblResearchStatus.ForeColor = [System.Drawing.Color]::Firebrick
        }
    }
}.GetNewClosure())

# Save research.md
$btnSaveResearch.Add_Click({
    $path = Join-Path (Get-CurrentDraftDir) "research.md"
    Set-Content -Path $path -Value $global:txtResearchOutput.Text -Encoding UTF8
    $lblResearchStatus.Text = "Saved: $path"
    $lblResearchStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
}.GetNewClosure())

$form.Controls.Add($global:panelResearch)

# ============================================================================
# TAB 2: NOTES -> DRAFT + VOICE
# ============================================================================
$global:panelDraft = New-Object System.Windows.Forms.Panel
$global:panelDraft.Location = New-Object System.Drawing.Point(10, $panelTop)
$global:panelDraft.Size = New-Object System.Drawing.Size(945, $panelH)
$global:panelDraft.BackColor = [System.Drawing.Color]::White
$global:panelDraft.Visible = $false

$lblNotes = New-Object System.Windows.Forms.Label
$lblNotes.Text = "Your personal notes on the destination (adds authentic voice - 5-15 lines is enough):"
$lblNotes.Location = New-Object System.Drawing.Point(10, 10); $lblNotes.Size = New-Object System.Drawing.Size(700, 18)
$global:panelDraft.Controls.Add($lblNotes)

$global:txtNotes = New-RichBox 10 30 920 180
$global:panelDraft.Controls.Add($global:txtNotes)

# Button row
$btnLoadNotes = New-Object System.Windows.Forms.Button
$btnLoadNotes.Text = "Load notes.md"
$btnLoadNotes.Location = New-Object System.Drawing.Point(10, 220); $btnLoadNotes.Size = New-Object System.Drawing.Size(105, 28)
$global:panelDraft.Controls.Add($btnLoadNotes)

$btnSaveNotes = New-Object System.Windows.Forms.Button
$btnSaveNotes.Text = "Save notes.md"
$btnSaveNotes.Location = New-Object System.Drawing.Point(120, 220); $btnSaveNotes.Size = New-Object System.Drawing.Size(105, 28)
$global:panelDraft.Controls.Add($btnSaveNotes)

# Draft tool dropdown + Copy+Open button
$lblToolDraft = New-Object System.Windows.Forms.Label
$lblToolDraft.Text = "Send draft prompt to:"
$lblToolDraft.Location = New-Object System.Drawing.Point(235, 224); $lblToolDraft.Size = New-Object System.Drawing.Size(120, 18)
$global:panelDraft.Controls.Add($lblToolDraft)

$global:cmbDraftTool = New-Object System.Windows.Forms.ComboBox
$global:cmbDraftTool.Location = New-Object System.Drawing.Point(355, 221); $global:cmbDraftTool.Size = New-Object System.Drawing.Size(110, 22)
$global:cmbDraftTool.DropDownStyle = 'DropDownList'
foreach ($k in $global:ResearchTools.Keys) { [void]$global:cmbDraftTool.Items.Add($k) }
$global:cmbDraftTool.SelectedIndex = 1  # Gemini default for drafting (better long-form)
$global:panelDraft.Controls.Add($global:cmbDraftTool)

$btnSendDraft = New-Object System.Windows.Forms.Button
$btnSendDraft.Text = "Copy + Open"
$btnSendDraft.Location = New-Object System.Drawing.Point(470, 220); $btnSendDraft.Size = New-Object System.Drawing.Size(110, 28)
$btnSendDraft.BackColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
$btnSendDraft.ForeColor = [System.Drawing.Color]::White
$btnSendDraft.FlatStyle = "Flat"
$global:panelDraft.Controls.Add($btnSendDraft)

$btnCopyDraftPrompt = New-Object System.Windows.Forms.Button
$btnCopyDraftPrompt.Text = "Copy only"
$btnCopyDraftPrompt.Location = New-Object System.Drawing.Point(585, 220); $btnCopyDraftPrompt.Size = New-Object System.Drawing.Size(90, 28)
$global:panelDraft.Controls.Add($btnCopyDraftPrompt)

# Handler for Copy + Open on draft tab
$btnSendDraft.Add_Click({
    $prompt = Get-DraftPrompt `
        -Destination $txtDest.Text `
        -Country $txtCountry.Text `
        -PublishMonth $txtMonth.Text `
        -ResearchDoc $global:txtResearchOutput.Text `
        -PersonalNotes $global:txtNotes.Text
    $tool = $global:cmbDraftTool.SelectedItem
    Send-PromptToTool -Prompt $prompt -ToolName $tool
    $global:lblDraftStatus.Text = "Draft prompt ($(Count-Words $prompt) words incl research + notes) copied to clipboard. Opened $tool - paste with Ctrl+V, then paste result back into the Draft body box below."
    $global:lblDraftStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
}.GetNewClosure())

# Second button row - Claude API + Load draft + SAVE DRAFT (moved to y=253 so it doesn't collide with tool row)
$global:btnRunClaudeDraft = New-Object System.Windows.Forms.Button
$global:btnRunClaudeDraft.Text = "Run Claude API"
$global:btnRunClaudeDraft.Location = New-Object System.Drawing.Point(10, 253); $global:btnRunClaudeDraft.Size = New-Object System.Drawing.Size(130, 28)
$global:btnRunClaudeDraft.BackColor = [System.Drawing.Color]::FromArgb(120, 90, 30)
$global:btnRunClaudeDraft.ForeColor = [System.Drawing.Color]::White
$global:btnRunClaudeDraft.FlatStyle = "Flat"
$global:panelDraft.Controls.Add($global:btnRunClaudeDraft)

$btnLoadDraft = New-Object System.Windows.Forms.Button
$btnLoadDraft.Text = "Load draft.md"
$btnLoadDraft.Location = New-Object System.Drawing.Point(145, 253); $btnLoadDraft.Size = New-Object System.Drawing.Size(120, 28)
$global:panelDraft.Controls.Add($btnLoadDraft)

$btnSaveDraft = New-Object System.Windows.Forms.Button
$btnSaveDraft.Text = "SAVE DRAFT (write draft.md + final.md + AI-phrase scan + word count)"
$btnSaveDraft.Location = New-Object System.Drawing.Point(270, 253); $btnSaveDraft.Size = New-Object System.Drawing.Size(400, 28)
$btnSaveDraft.BackColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
$btnSaveDraft.ForeColor = [System.Drawing.Color]::White
$btnSaveDraft.FlatStyle = "Flat"
$global:panelDraft.Controls.Add($btnSaveDraft)

$lblDraftBody = New-Object System.Windows.Forms.Label
$lblDraftBody.Text = "Draft body (paste result from Perplexity/Gemini/etc. here, or Claude API auto-fills):"
$lblDraftBody.Location = New-Object System.Drawing.Point(10, 290); $lblDraftBody.Size = New-Object System.Drawing.Size(700, 18)
$global:panelDraft.Controls.Add($lblDraftBody)

$global:txtDraft = New-RichBox 10 310 920 350
$global:panelDraft.Controls.Add($global:txtDraft)

$global:lblDraftStatus = New-Object System.Windows.Forms.Label
$global:lblDraftStatus.Location = New-Object System.Drawing.Point(10, 668); $global:lblDraftStatus.Size = New-Object System.Drawing.Size(920, 42)
$global:lblDraftStatus.Font = New-Object System.Drawing.Font("Consolas", 9)
$global:panelDraft.Controls.Add($global:lblDraftStatus)

# Handlers
$btnLoadNotes.Add_Click({
    $ofd = New-Object System.Windows.Forms.OpenFileDialog
    $ofd.Title = "Select a personal notes .md/.txt file to load"
    $ofd.Filter = "Markdown/Text (*.md;*.txt)|*.md;*.txt|All files (*.*)|*.*"
    $ofd.InitialDirectory = $global:DraftsRoot
    $result = $ofd.ShowDialog()
    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        try {
            $global:txtNotes.Text = Get-Content $ofd.FileName -Raw -ErrorAction Stop
            $global:lblDraftStatus.Text = "Loaded notes: $($ofd.FileName)"
            $global:lblDraftStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
        } catch {
            $global:lblDraftStatus.Text = "Failed to load: $($_.Exception.Message)"
            $global:lblDraftStatus.ForeColor = [System.Drawing.Color]::Firebrick
        }
    }
}.GetNewClosure())

$btnSaveNotes.Add_Click({
    $p = Join-Path (Get-CurrentDraftDir) "notes.md"
    Set-Content -Path $p -Value $global:txtNotes.Text -Encoding UTF8
    $global:lblDraftStatus.Text = "Saved notes: $p"
}.GetNewClosure())

$btnCopyDraftPrompt.Add_Click({
    $prompt = Get-DraftPrompt `
        -Destination $txtDest.Text `
        -Country $txtCountry.Text `
        -PublishMonth $txtMonth.Text `
        -ResearchDoc $global:txtResearchOutput.Text `
        -PersonalNotes $global:txtNotes.Text
    [System.Windows.Forms.Clipboard]::SetText($prompt)
    $global:lblDraftStatus.Text = "Copied draft prompt to clipboard ($(Count-Words $prompt) words including research + notes)."
}.GetNewClosure())

$global:btnRunClaudeDraft.Add_Click({
    if (-not $global:ClaudeApiKey) {
        [System.Windows.Forms.MessageBox]::Show("Configure Claude API key first.", "No API key", 'OK', 'Warning') | Out-Null
        return
    }
    if ([string]::IsNullOrWhiteSpace($global:txtResearchOutput.Text)) {
        [System.Windows.Forms.MessageBox]::Show("Load or run research first (Tab 1).", "No research", 'OK', 'Warning') | Out-Null
        return
    }
    $global:btnRunClaudeDraft.Enabled = $false
    $global:lblDraftStatus.Text = "Calling Claude for draft... (60-120 sec)"
    $global:lblDraftStatus.ForeColor = [System.Drawing.Color]::DarkOrange
    $global:panelDraft.Refresh()
    try {
        $prompt = Get-DraftPrompt `
            -Destination $txtDest.Text `
            -Country $txtCountry.Text `
            -PublishMonth $txtMonth.Text `
            -ResearchDoc $global:txtResearchOutput.Text `
            -PersonalNotes $global:txtNotes.Text
        $result = Invoke-ClaudeAPI -UserPrompt $prompt -MaxTokens $global:ClaudeMaxTokens
        $global:txtDraft.Text = $result
        $wc = Count-Words $result
        $global:lblDraftStatus.Text = "Claude draft returned $wc words. Review, then SAVE DRAFT to run AI-phrase scan + write final.md."
        $global:lblDraftStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
    } catch {
        [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "Claude API error", 'OK', 'Error') | Out-Null
        $global:lblDraftStatus.Text = "Claude call failed."
        $global:lblDraftStatus.ForeColor = [System.Drawing.Color]::Firebrick
    } finally {
        $global:btnRunClaudeDraft.Enabled = $true
    }
}.GetNewClosure())

$btnLoadDraft.Add_Click({
    $ofd = New-Object System.Windows.Forms.OpenFileDialog
    $ofd.Title = "Select a draft .md/.mdx file to load (any name - e.g. chiang-mai-travel-guide.md)"
    $ofd.Filter = "Markdown/Text (*.md;*.mdx;*.txt)|*.md;*.mdx;*.txt|All files (*.*)|*.*"
    $ofd.InitialDirectory = $global:DraftsRoot
    $result = $ofd.ShowDialog()
    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        try {
            $global:txtDraft.Text = Get-Content $ofd.FileName -Raw -ErrorAction Stop
            $wc = Count-Words $global:txtDraft.Text
            $global:lblDraftStatus.Text = "Loaded draft: $($ofd.FileName)  ($wc words)"
            $global:lblDraftStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
        } catch {
            $global:lblDraftStatus.Text = "Failed to load: $($_.Exception.Message)"
            $global:lblDraftStatus.ForeColor = [System.Drawing.Color]::Firebrick
        }
    }
}.GetNewClosure())

# SAVE DRAFT - one button does draft.md + final.md + AI-phrase scan + word count
$btnSaveDraft.Add_Click({
    $dir = Get-CurrentDraftDir
    $draftPath = Join-Path $dir "draft.md"
    $finalPath = Join-Path $dir "final.md"
    $text = $global:txtDraft.Text

    Set-Content -Path $draftPath -Value $text -Encoding UTF8
    Set-Content -Path $finalPath -Value $text -Encoding UTF8

    $wc = Count-Words $text
    $target = "1,900-2,200"
    $wcStatus = if ($wc -lt 1800) { "UNDER target ($target)" }
                elseif ($wc -gt 2500) { "OVER target ($target)" }
                else { "on target ($target)" }

    $ai = Find-AiPhrases $text
    $aiMsg = if ($ai.Count -gt 0) { "AI phrases found: $($ai -join ', ')" } else { "No AI phrases detected." }

    $global:lblDraftStatus.Text = "Saved draft.md + final.md`nWords: $wc ($wcStatus)  -  $aiMsg"
    $global:lblDraftStatus.ForeColor = if ($ai.Count -gt 0) { [System.Drawing.Color]::Firebrick } else { [System.Drawing.Color]::FromArgb(30, 122, 145) }
}.GetNewClosure())

$form.Controls.Add($global:panelDraft)

# ============================================================================
# TAB 3: PHOTOS + PUBLISH
# ============================================================================
$global:panelPublish = New-Object System.Windows.Forms.Panel
$global:panelPublish.Location = New-Object System.Drawing.Point(10, $panelTop)
$global:panelPublish.Size = New-Object System.Drawing.Size(945, $panelH)
$global:panelPublish.BackColor = [System.Drawing.Color]::White
$global:panelPublish.Visible = $false

# --- Metadata form (compact grid) ---
$lblMeta = New-Object System.Windows.Forms.Label
$lblMeta.Text = "Metadata (goes into MDX frontmatter):"
$lblMeta.Location = New-Object System.Drawing.Point(10, 10); $lblMeta.Size = New-Object System.Drawing.Size(400, 18)
$lblMeta.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$global:panelPublish.Controls.Add($lblMeta)

# Auto-fill button - derives Title/Description/Destination/HeroAlt from Tab 1 fields + draft body
$btnAutoFill = New-Object System.Windows.Forms.Button
$btnAutoFill.Text = "Auto-fill from pipeline (force)"
$btnAutoFill.Location = New-Object System.Drawing.Point(420, 6); $btnAutoFill.Size = New-Object System.Drawing.Size(200, 24)
$btnAutoFill.FlatStyle = "Flat"
$btnAutoFill.BackColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
$btnAutoFill.ForeColor = [System.Drawing.Color]::White
$btnAutoFill.Add_Click({ AutoFill-Metadata -Force }.GetNewClosure())
$global:panelPublish.Controls.Add($btnAutoFill)

$lblAutoFillHint = New-Object System.Windows.Forms.Label
$lblAutoFillHint.Text = "(auto-runs on Tab 3 switch if fields are empty)"
$lblAutoFillHint.Location = New-Object System.Drawing.Point(628, 10); $lblAutoFillHint.Size = New-Object System.Drawing.Size(310, 18)
$lblAutoFillHint.ForeColor = [System.Drawing.Color]::DimGray
$global:panelPublish.Controls.Add($lblAutoFillHint)

function New-MetaField {
    param([string]$Label, [int]$Y, [int]$W = 700, [string]$Default = "")
    $l = New-Object System.Windows.Forms.Label
    $l.Text = $Label; $l.Location = New-Object System.Drawing.Point(10, ($Y + 2)); $l.Size = New-Object System.Drawing.Size(110, 18)
    $global:panelPublish.Controls.Add($l)
    $t = New-Object System.Windows.Forms.TextBox
    $t.Location = New-Object System.Drawing.Point(120, $Y); $t.Size = New-Object System.Drawing.Size($W, 22)
    $t.Text = $Default
    $global:panelPublish.Controls.Add($t)
    return $t
}

$global:txtMetaTitle       = New-MetaField "Title:"       32  810
$global:txtMetaDescription = New-MetaField "Description:" 58  810
$global:txtMetaAuthor      = New-MetaField "Author:"      84  810 "Niphon Srisawat"
$global:txtMetaDestination = New-MetaField "Destination:" 110 810
$global:txtMetaHeroAlt     = New-MetaField "Hero alt:"    136 810

# --- Preset + photo source selectors ---
$lblPreset = New-Object System.Windows.Forms.Label
$lblPreset.Text = "Slot preset:"; $lblPreset.Location = New-Object System.Drawing.Point(10, 170); $lblPreset.Size = New-Object System.Drawing.Size(75, 18)
$global:panelPublish.Controls.Add($lblPreset)

$global:cmbPreset = New-Object System.Windows.Forms.ComboBox
$global:cmbPreset.Location = New-Object System.Drawing.Point(85, 167); $global:cmbPreset.Size = New-Object System.Drawing.Size(130, 22)
$global:cmbPreset.DropDownStyle = 'DropDownList'
foreach ($k in $global:PhotoSlotPresets.Keys) { [void]$global:cmbPreset.Items.Add($k) }
$global:cmbPreset.SelectedItem = if ($global:PhotoSlotPresets.Contains($global:CurrentSlug)) { $global:CurrentSlug } else { "generic" }
$global:panelPublish.Controls.Add($global:cmbPreset)

$lblSource = New-Object System.Windows.Forms.Label
$lblSource.Text = "Photo source:"; $lblSource.Location = New-Object System.Drawing.Point(230, 170); $lblSource.Size = New-Object System.Drawing.Size(90, 18)
$global:panelPublish.Controls.Add($lblSource)

$global:cmbPhotoSource = New-Object System.Windows.Forms.ComboBox
$global:cmbPhotoSource.Location = New-Object System.Drawing.Point(320, 167); $global:cmbPhotoSource.Size = New-Object System.Drawing.Size(110, 22)
$global:cmbPhotoSource.DropDownStyle = 'DropDownList'
foreach ($k in $global:PhotoSourceUrls.Keys) { [void]$global:cmbPhotoSource.Items.Add($k) }
$global:cmbPhotoSource.SelectedIndex = 0  # Pixabay default
$global:panelPublish.Controls.Add($global:cmbPhotoSource)

$lblPhotosHint = New-Object System.Windows.Forms.Label
$lblPhotosHint.Text = "Search opens the source with the row's alt text as query. Pick... selects the local file."
$lblPhotosHint.Location = New-Object System.Drawing.Point(445, 170); $lblPhotosHint.Size = New-Object System.Drawing.Size(490, 18)
$lblPhotosHint.ForeColor = [System.Drawing.Color]::DimGray
$global:panelPublish.Controls.Add($lblPhotosHint)

# --- Photo slots grid ---
$global:PhotoRows = @{}    # slot -> textbox for the path
$global:PhotoLabels = @{}  # slot -> label (so we can rename on preset swap)
$global:PhotoAlts = @{}    # slot -> current alt text (used for search queries)
$photoTop = 200

# Function to (re)populate the 8 rows from the active preset.
# Called once at startup and again whenever cmbPreset changes.
function Sync-PhotoSlotRows {
    # Clear old rows: remove all controls in the row-block area
    $toRemove = @()
    foreach ($ctrl in $global:panelPublish.Controls) {
        if ($ctrl.Tag -is [string] -and $ctrl.Tag.StartsWith("photorow:")) { $toRemove += $ctrl }
    }
    foreach ($ctrl in $toRemove) { $global:panelPublish.Controls.Remove($ctrl) }
    $global:PhotoRows.Clear()
    $global:PhotoLabels.Clear()
    $global:PhotoAlts.Clear()

    for ($i = 0; $i -lt $global:PhotoSlots.Count; $i++) {
        $slot = $global:PhotoSlots[$i]
        $y = $photoTop + ($i * 30)

        $lblSlot = New-Object System.Windows.Forms.Label
        $lblSlot.Text = "$($slot.slot) ($($slot.file))"
        $lblSlot.Location = New-Object System.Drawing.Point(10, ($y + 2))
        $lblSlot.Size = New-Object System.Drawing.Size(160, 18)
        $lblSlot.Tag = "photorow:$($slot.slot)"
        $global:panelPublish.Controls.Add($lblSlot)
        $global:PhotoLabels[$slot.slot] = $lblSlot

        $txtPath = New-Object System.Windows.Forms.TextBox
        $txtPath.Location = New-Object System.Drawing.Point(170, $y)
        $txtPath.Size = New-Object System.Drawing.Size(475, 22)
        $txtPath.Tag = "photorow:$($slot.slot)"
        $global:panelPublish.Controls.Add($txtPath)
        $global:PhotoRows[$slot.slot] = $txtPath
        $global:PhotoAlts[$slot.slot] = $slot.alt

        $btnSearch = New-Object System.Windows.Forms.Button
        $btnSearch.Text = "Search"
        $btnSearch.Location = New-Object System.Drawing.Point(650, ($y - 1))
        $btnSearch.Size = New-Object System.Drawing.Size(70, 24)
        $btnSearch.Tag = "photorow:$($slot.slot)"
        $slotKey = $slot.slot  # capture for closure
        $btnSearch.Add_Click({
            $source = $global:cmbPhotoSource.SelectedItem
            $query = $global:PhotoAlts[$slotKey]
            Search-Photo -Source $source -Query $query
            $global:lblPublishStatus.Text = "Opened $source with query: `"$query`" (also copied to clipboard)"
            $global:lblPublishStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
        }.GetNewClosure())
        $global:panelPublish.Controls.Add($btnSearch)

        $btnPick = New-Object System.Windows.Forms.Button
        $btnPick.Text = "Pick..."
        $btnPick.Location = New-Object System.Drawing.Point(725, ($y - 1))
        $btnPick.Size = New-Object System.Drawing.Size(65, 24)
        $btnPick.Tag = "photorow:$($slot.slot)"
        $slotKey2 = $slot.slot
        $btnPick.Add_Click({
            $ofd = New-Object System.Windows.Forms.OpenFileDialog
            $ofd.Filter = "Images (*.jpg;*.jpeg;*.png;*.webp)|*.jpg;*.jpeg;*.png;*.webp"
            $ofd.InitialDirectory = $global:ProjectRoot
            $result = $ofd.ShowDialog()
            if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
                $global:PhotoRows[$slotKey2].Text = $ofd.FileName
            }
        }.GetNewClosure())
        $global:panelPublish.Controls.Add($btnPick)

        # Also stash a hidden "Copy alt" mini-button so user can copy alt text without opening browser
        $btnCopyAlt = New-Object System.Windows.Forms.Button
        $btnCopyAlt.Text = "Copy alt"
        $btnCopyAlt.Location = New-Object System.Drawing.Point(795, ($y - 1))
        $btnCopyAlt.Size = New-Object System.Drawing.Size(70, 24)
        $btnCopyAlt.Tag = "photorow:$($slot.slot)"
        $slotKey3 = $slot.slot
        $btnCopyAlt.Add_Click({
            [System.Windows.Forms.Clipboard]::SetText($global:PhotoAlts[$slotKey3])
            $global:lblPublishStatus.Text = "Copied alt to clipboard: `"$($global:PhotoAlts[$slotKey3])`""
        }.GetNewClosure())
        $global:panelPublish.Controls.Add($btnCopyAlt)
    }
}

# Wire preset change: swap the slot table and re-render rows
$global:cmbPreset.Add_SelectedIndexChanged({
    $picked = $global:cmbPreset.SelectedItem
    if ($global:PhotoSlotPresets.Contains($picked)) {
        $global:PhotoSlots = $global:PhotoSlotPresets[$picked]
        Sync-PhotoSlotRows
        $global:lblPublishStatus.Text = "Loaded preset: $picked ($($global:PhotoSlots.Count) slots)"
        $global:lblPublishStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
    }
}.GetNewClosure())

# Initial render
Sync-PhotoSlotRows

# --- Action buttons at bottom ---
$actionY = $photoTop + ($global:PhotoSlots.Count * 30) + 20

$btnCopyPhotos = New-Object System.Windows.Forms.Button
$btnCopyPhotos.Text = "Copy Photos -> public/guides/<slug>/"
$btnCopyPhotos.Location = New-Object System.Drawing.Point(10, $actionY); $btnCopyPhotos.Size = New-Object System.Drawing.Size(260, 32)
$global:panelPublish.Controls.Add($btnCopyPhotos)

$btnAssembleMDX = New-Object System.Windows.Forms.Button
$btnAssembleMDX.Text = "Assemble final.mdx (wrap affiliates)"
$btnAssembleMDX.Location = New-Object System.Drawing.Point(280, $actionY); $btnAssembleMDX.Size = New-Object System.Drawing.Size(260, 32)
$global:panelPublish.Controls.Add($btnAssembleMDX)

$btnPublishMDX = New-Object System.Windows.Forms.Button
$btnPublishMDX.Text = "Publish -> content/guides/<slug>.mdx"
$btnPublishMDX.Location = New-Object System.Drawing.Point(550, $actionY); $btnPublishMDX.Size = New-Object System.Drawing.Size(260, 32)
$btnPublishMDX.BackColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
$btnPublishMDX.ForeColor = [System.Drawing.Color]::White
$btnPublishMDX.FlatStyle = "Flat"
$global:panelPublish.Controls.Add($btnPublishMDX)

$global:lblPublishStatus = New-Object System.Windows.Forms.Label
$global:lblPublishStatus.Location = New-Object System.Drawing.Point(10, ($actionY + 40))
$global:lblPublishStatus.Size = New-Object System.Drawing.Size(920, 100)
$global:lblPublishStatus.Font = New-Object System.Drawing.Font("Consolas", 8.5)
$global:lblPublishStatus.ForeColor = [System.Drawing.Color]::DimGray
$global:panelPublish.Controls.Add($global:lblPublishStatus)

# --- Copy Photos handler (with auto-compression baked in) ---
$btnCopyPhotos.Add_Click({
    $destDir = Get-CurrentPhotosDir
    $lines = @()
    $lines += "Copying + compressing to: $destDir"
    $lines += ""
    $totalOrigKB = 0
    $totalOutKB  = 0
    foreach ($slot in $global:PhotoSlots) {
        $src = $global:PhotoRows[$slot.slot].Text.Trim().Trim('"')
        if (-not $src) { continue }
        if (-not (Test-Path $src)) {
            $lines += "  MISSING: $($slot.slot) -> $src"
            continue
        }
        $dst = Join-Path $destDir $slot.file
        try {
            Copy-Item -Path $src -Destination $dst -Force
            $origKB = [int]([Math]::Round((Get-Item $dst).Length / 1024))
            $totalOrigKB += $origKB
            # In-place compress
            $r = Compress-Jpeg -Path $dst -MaxDim 1600 -MaxKB 450
            if ($r) {
                $totalOutKB += $r.SizeKB
                $lines += ("  OK  {0,-16} -> {1,-22} {2,4}KB -> {3,4}KB  {4}x{5}  q{6}" -f `
                    $slot.slot, $slot.file, $origKB, $r.SizeKB, $r.Width, $r.Height, $r.Quality)
            } else {
                $lines += "  COPY-ONLY: $($slot.slot) (compression skipped)"
            }
        } catch {
            $lines += "  FAIL: $($slot.slot): $($_.Exception.Message)"
        }
    }
    $lines += ""
    $lines += "TOTAL: $totalOrigKB KB -> $totalOutKB KB  (saved $($totalOrigKB - $totalOutKB) KB)"
    $global:lblPublishStatus.Text = ($lines -join "`n")
    $global:lblPublishStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
}.GetNewClosure())

# --- Assemble MDX handler ---
$btnAssembleMDX.Add_Click({
    # Read final.md body (or draft.md if final missing)
    $dir = Get-CurrentDraftDir
    $srcPath = Join-Path $dir "final.md"
    if (-not (Test-Path $srcPath)) { $srcPath = Join-Path $dir "draft.md" }
    if (-not (Test-Path $srcPath)) {
        $global:lblPublishStatus.Text = "No final.md or draft.md found. Run Tab 2 SAVE DRAFT first."
        $global:lblPublishStatus.ForeColor = [System.Drawing.Color]::Firebrick
        return
    }
    $body = Get-Content $srcPath -Raw

    # --- FIX PASS baked in ---
    # 1) Repair mojibake (UTF-8 misinterpreted as Latin-1) if present in the pasted draft
    $body = Fix-Mojibake -Text $body

    # 2) Auto-insert <GuidePhoto> tags at neighborhood + activity sections
    $insertResult = Insert-GuidePhotoTags -Body $body -Slug $global:CurrentSlug
    $body = $insertResult.Body
    $guidePhotoInserted = $insertResult.Inserted

    # 3) Capitalize the Destination + Title if user typed them lowercase
    $rawDest = $global:txtMetaDestination.Text.Trim()
    if ($rawDest -and $rawDest.Length -gt 0 -and $rawDest[0] -cmatch '[a-z]') {
        $global:txtMetaDestination.Text = ConvertTo-TitleCase $rawDest
    }
    $rawTitle = $global:txtMetaTitle.Text.Trim()
    if ($rawTitle -and $rawTitle.Length -gt 0 -and $rawTitle[0] -cmatch '[a-z]') {
        # Capitalize just the first word (city name), leave the rest as-is
        $words = $rawTitle -split ' ', 2
        $global:txtMetaTitle.Text = (ConvertTo-TitleCase $words[0]) + $(if ($words.Length -gt 1) { ' ' + $words[1] } else { '' })
    }

    # Regex-wrap common affiliate anchor phrases with <AffiliateLink> JSX (only if not already wrapped)
    $wrapCount = 0
    $wrapRules = @(
        @{ pattern = 'Browse ([A-Z][A-Za-z /]+) hotels on Booking\.com'; jsx = { param($m) "<AffiliateLink type=""booking"" query=""$($m.Groups[1].Value) $($global:txtMetaDestination.Text.Split(',')[0].Trim())"">Browse $($m.Groups[1].Value) hotels on Booking.com</AffiliateLink>" } },
        @{ pattern = 'book (?:the )?([A-Za-z ]+?) (?:day )?tour on Klook'; jsx = { param($m) "<AffiliateLink type=""klook"" query=""$($m.Groups[1].Value) $($global:txtMetaDestination.Text.Split(',')[0].Trim())"">book the $($m.Groups[1].Value) tour on Klook</AffiliateLink>" } },
        @{ pattern = 'book Welcome Pickups'; jsx = { param($m) '<AffiliateLink type="welcomePickups">book Welcome Pickups</AffiliateLink>' } },
        @{ pattern = 'grab (?:an )?Airalo'; jsx = { param($m) '<AffiliateLink type="airalo">Grab an Airalo</AffiliateLink>' } }
    )

    foreach ($rule in $wrapRules) {
        # Skip anything already inside <AffiliateLink> tags
        $body = [regex]::Replace($body, "(?<!<AffiliateLink[^>]*>[^<]*?)$($rule.pattern)", {
            param($m) $wrapCount++; & $rule.jsx $m
        }, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    }

    # Build MDX frontmatter from metadata form
    $slug = $global:CurrentSlug
    $frontmatter = @"
---
slug: $slug
title: "$($global:txtMetaTitle.Text)"
description: "$($global:txtMetaDescription.Text)"
author: "$($global:txtMetaAuthor.Text)"
destination: "$($global:txtMetaDestination.Text)"
publishDate: "$(Get-Date -Format 'yyyy-MM-dd')"
lastUpdated: "$(Get-Date -Format 'yyyy-MM-dd')"
hero: "/guides/$slug/hero.jpg"
heroAlt: "$($global:txtMetaHeroAlt.Text)"
---

"@

    $finalMdx = $frontmatter + $body

    $outPath = Join-Path $dir "final.mdx"
    # UTF-8 no-BOM (Next.js prefers this)
    [System.IO.File]::WriteAllText($outPath, $finalMdx, (New-Object System.Text.UTF8Encoding($false)))
    $global:lblPublishStatus.Text = "Assembled: $outPath`nAffiliate anchors wrapped: $wrapCount  |  GuidePhoto tags inserted: $guidePhotoInserted  |  Mojibake fixed  |  Title/Destination capitalized. Review, then Publish."
    $global:lblPublishStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
}.GetNewClosure())

# --- Publish handler ---
$btnPublishMDX.Add_Click({
    $srcMdx = Join-Path (Get-CurrentDraftDir) "final.mdx"
    if (-not (Test-Path $srcMdx)) {
        $global:lblPublishStatus.Text = "No final.mdx yet. Run Assemble first."
        $global:lblPublishStatus.ForeColor = [System.Drawing.Color]::Firebrick
        return
    }
    $dstMdx = Join-Path $global:PublishedRoot "$global:CurrentSlug.mdx"
    Copy-Item -Path $srcMdx -Destination $dstMdx -Force
    $global:lblPublishStatus.Text = "Published: $dstMdx`nCommit + push to deploy on Vercel."
    $global:lblPublishStatus.ForeColor = [System.Drawing.Color]::FromArgb(30, 122, 145)
}.GetNewClosure())

$form.Controls.Add($global:panelPublish)

# ============================================================================
# TAB SWITCHING
# ============================================================================
# Now that all buttons exist, re-apply the API mode state so Run Claude buttons
# get their initial enabled/disabled colour correctly.
Update-ApiStatusLabel

$global:btnTabResearch.Add_Click({ Set-ActiveTab "research" }.GetNewClosure())
$global:btnTabDraft.Add_Click(   { Set-ActiveTab "draft"    }.GetNewClosure())
$global:btnTabPublish.Add_Click( {
    Set-ActiveTab "publish"
    # Auto-fill metadata if all 4 target fields are still empty
    $allEmpty = -not $global:txtMetaTitle.Text -and `
                -not $global:txtMetaDescription.Text -and `
                -not $global:txtMetaDestination.Text -and `
                -not $global:txtMetaHeroAlt.Text
    if ($allEmpty) { AutoFill-Metadata }
}.GetNewClosure())
Set-ActiveTab "research"

# ============================================================================
# RUN
# ============================================================================
[void]$form.ShowDialog()
