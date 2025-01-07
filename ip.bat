@echo off

:: Define the directory, the old IP address, and the backups directory
set "DIRECTORY=%USERPROFILE%\MovieServer"
set "BACKUP_DIR=%DIRECTORY%\backups"
set "OLD_IP=192.168.254.137"

:: Prompt the user for the new IP address
set /p NEW_IP=Enter the new IP address: 

:: Check if the directory exists
if not exist "%DIRECTORY%" (
    echo Directory %DIRECTORY% does not exist. Please install MovieServer using the MovieServer installer at https://github.com/A-Star100/MovieServer/releases/latest and then execute this script again.
    exit /b 1
)

:: Create the backups directory if it doesn't exist
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

:: Replace all occurrences of the old IP with the new IP and create backups
echo Updating all occurrences of %OLD_IP% to %NEW_IP% in %DIRECTORY%...
for /r "%DIRECTORY%" %%f in (*) do (
    echo Processing "%%f"...
    copy "%%f" "%BACKUP_DIR%\%%~nxf.bak" >nul
    powershell -Command "(gc \"%%f\") -replace '%OLD_IP%', '%NEW_IP%' | sc \"%%f\""
)

echo Update completed! Backup files are stored in %BACKUP_DIR%.
pause
