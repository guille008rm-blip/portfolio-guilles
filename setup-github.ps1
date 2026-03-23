# Script para crear repo en GitHub y hacer push
# 1. Autenticarse (abre navegador)
# 2. Crear repo público y push

Write-Host "=== Paso 1: Autenticación con GitHub ===" -ForegroundColor Cyan
gh auth login --web --git-protocol https

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en la autenticación. Abortando." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Paso 2: Creando repositorio en GitHub ===" -ForegroundColor Cyan
gh repo create portfolio-guilles --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Listo! Repositorio creado y código subido." -ForegroundColor Green
    Write-Host "Ahora ve a https://vercel.com/new e importa el repo 'portfolio-guilles'." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Error al crear el repositorio." -ForegroundColor Red
}
