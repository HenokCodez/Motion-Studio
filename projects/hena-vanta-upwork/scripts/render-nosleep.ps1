$code = @'
[DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern uint SetThreadExecutionState(uint esFlags);
'@
$ste = Add-Type -MemberDefinition $code -Name "Win32Sleep" -Namespace "Win32" -PassThru -ErrorAction SilentlyContinue
# ES_CONTINUOUS (0x80000000) | ES_SYSTEM_REQUIRED (0x00000001) | ES_AWAYMODE_REQUIRED (0x00000040)
try {
    [Win32.Win32Sleep]::SetThreadExecutionState(0x80000041)
} catch {}

Write-Host "Starting Remotion render with sleep-prevention..."
$out = "D:/Youtube/Hena Vanta/Project FIle/Videos/1. I tried Upwork for 365 days...is it worth it/AI/out/upwork_365_days.mp4"

npx remotion render src/index.ts HenaVanta $out --crf=16 --concurrency=8 --port=3033 --log=info

if (Test-Path -LiteralPath $out) {
    Write-Host "Render successful! Running loudness verification..."
    node ../../.agents/skills/hena-vanta/scripts/check-loudness.mjs $out
} else {
    Write-Error "Render output not found at $out"
}

try {
    [Win32.Win32Sleep]::SetThreadExecutionState(0x80000000)
} catch {}
