@echo off
setlocal

set "MVN_CMD="
if not exist "%JAVA_HOME%\bin\java.exe" (
    if exist "C:\Program Files\Java\jdk-17\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    )
)

for /f "usebackq delims=" %%I in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$root = Join-Path $env:USERPROFILE '.m2\wrapper\dists'; if (Test-Path $root) { Get-ChildItem -Path $root -Recurse -Filter mvn.cmd -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName }"`) do (
    set "MVN_CMD=%%I"
)

if not defined MVN_CMD (
    for /f "usebackq delims=" %%I in (`where mvn 2^>nul`) do (
        set "MVN_CMD=%%I"
        goto run
    )
)

:run
if not defined MVN_CMD (
    echo Could not find Maven.
    echo Expected a Maven distribution under %%USERPROFILE%%\.m2\wrapper\dists or an available mvn in PATH.
    exit /b 1
)

if exist "%USERPROFILE%\.m2\repository" (
    call "%MVN_CMD%" "-Duser.home=%USERPROFILE%" "-Dmaven.repo.local=%USERPROFILE%\.m2\repository" %*
) else (
    call "%MVN_CMD%" %*
)
exit /b %ERRORLEVEL%
