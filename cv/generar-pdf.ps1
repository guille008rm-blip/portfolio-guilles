param(
  [string]$InputHtml = "$PSScriptRoot\guillermo-lopez-cv.html",
  [string]$OutputPdf = "$PSScriptRoot\guillermo-lopez-cv.pdf"
)

$browserCandidates = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

$browserPath = $null
foreach ($candidate in $browserCandidates) {
  if (Test-Path $candidate) {
    $browserPath = $candidate
    break
  }
}

if (-not $browserPath) {
  throw "No se encontro Chrome/Edge. Instala uno y vuelve a ejecutar este script."
}

if (-not (Test-Path $InputHtml)) {
  throw "No existe el HTML de entrada: $InputHtml"
}

$inputUri = "file:///" + (($InputHtml -replace "\\", "/"))

& $browserPath `
  --headless `
  --disable-gpu `
  --no-first-run `
  --no-default-browser-check `
  --print-to-pdf="$OutputPdf" `
  --print-to-pdf-no-header `
  $inputUri

# Chrome/Edge puede tardar unos instantes en terminar de escribir el PDF.
$maxAttempts = 20
$attempt = 0
while ($attempt -lt $maxAttempts) {
  if ((Test-Path $OutputPdf) -and ((Get-Item $OutputPdf).Length -gt 0)) {
    break
  }
  Start-Sleep -Milliseconds 200
  $attempt++
}

if (-not (Test-Path $OutputPdf) -or ((Get-Item $OutputPdf).Length -le 0)) {
  throw "No se pudo generar el PDF."
}

Write-Host "PDF generado en: $OutputPdf"
