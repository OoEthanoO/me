[CmdletBinding()]
param([string]$Root = 'C:\ProgramData\Portfolio', [Parameter(Mandatory)][string]$CaddyExe,
    [Parameter(Mandatory)][string]$MainCaddyfile, [switch]$EnableAutoDeploy)
. (Join-Path $PSScriptRoot 'common.ps1')
Assert-Administrator
foreach ($name in 'logs','releases','static','ops') { New-Item -ItemType Directory -Path (Join-Path $Root $name) -Force | Out-Null }
& icacls.exe $Root '/inheritance:r' '/grant:r' '*S-1-5-18:(OI)(CI)F' '*S-1-5-32-544:(OI)(CI)F' | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Could not protect the runtime directory.' }
$config = [pscustomobject]@{
    node=(Get-Command node.exe).Source; npm=(Get-Command npm.cmd).Source; git=(Get-Command git.exe).Source
    caddy=(Resolve-Path -LiteralPath $CaddyExe).Path; mainCaddyfile=(Resolve-Path -LiteralPath $MainCaddyfile).Path
}
Write-Json (Join-Path $Root 'server.json') $config

# YanLearn runs on this same Caddy server. Resolve its public TLS hostname
# locally so a router's stale DNS cannot send impact reads back to Vercel.
$hostsPath = Join-Path $env:SystemRoot 'System32\drivers\etc\hosts'
$hostsText = [IO.File]::ReadAllText($hostsPath)
$mappedAddresses = @($hostsText -split '\r?\n' | ForEach-Object {
    $fields = (($_ -split '#', 2)[0].Trim()) -split '\s+'
    if ($fields.Count -gt 1 -and $fields[1..($fields.Count - 1)] -contains 'learn.ethanyanxu.com') { $fields[0] }
})
if (@($mappedAddresses | Where-Object { $_ -ne '127.0.0.1' }).Count) {
    throw 'A different hosts entry already exists for YanLearn; inspect before replacing it.'
}
if ($mappedAddresses.Count -eq 0) {
    Copy-Item -LiteralPath $hostsPath -Destination (Join-Path $Root ('logs\hosts-before-' + (Get-Date -Format 'yyyyMMddHHmmss')))
    [IO.File]::AppendAllText($hostsPath, "`r`n# Co-hosted YanLearn impact API (Portfolio)`r`n127.0.0.1 learn.ethanyanxu.com`r`n", (New-Object Text.UTF8Encoding $false))
    Clear-DnsClientCache
}

$repo = Join-Path $Root 'repo'
if (-not (Test-Path -LiteralPath (Join-Path $repo '.git'))) {
    Invoke-Tool $config.git @('clone','--branch','main','https://github.com/OoEthanoO/me.git',$repo) (Join-Path $Root 'logs\install.log')
}
$ops = Join-Path $Root 'ops'
if ([IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\') -ne [IO.Path]::GetFullPath($ops).TrimEnd('\')) {
    Copy-Item -Path (Join-Path $PSScriptRoot '*.ps1') -Destination $ops -Force
}
if ($EnableAutoDeploy) {
    if (-not (Read-Json (Join-Path $Root 'active.json'))) { throw 'Activate and verify a release before enabling automatic deployment.' }
    $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument ('-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}" -Root "{1}"' -f (Join-Path $ops 'tick.ps1'),$Root)
    $triggers = @((New-ScheduledTaskTrigger -AtStartup), (New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(2) -RepetitionInterval (New-TimeSpan -Minutes 2)))
    $settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 25) `
        -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Register-ScheduledTask -TaskName 'portfolio-deploy' -Action $action -Trigger $triggers -Settings $settings -User 'SYSTEM' -RunLevel Highest -Force | Out-Null
}
Write-Output "Runtime installed at $Root."
