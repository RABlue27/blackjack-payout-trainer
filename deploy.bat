@echo off
REM Blackjack Payout Trainer - Windows Deployment Script

echo 🎰 Blackjack Payout Trainer - Deployment Script
echo ================================================
echo.

REM Check if required files exist
echo [INFO] Checking required files...
set "missing_files="

if not exist "index.html" set "missing_files=%missing_files% index.html"
if not exist "styles.css" set "missing_files=%missing_files% styles.css"
if not exist "script.js" set "missing_files=%missing_files% script.js"
if not exist "test-suite.js" set "missing_files=%missing_files% test-suite.js"
if not exist "README.md" set "missing_files=%missing_files% README.md"

if not "%missing_files%"=="" (
    echo [ERROR] Missing required files:%missing_files%
    pause
    exit /b 1
)

echo [SUCCESS] All required files found
echo.

REM Create deployment directory
echo [INFO] Creating deployment package...
if exist "blackjack-payout-trainer-deploy" rmdir /s /q "blackjack-payout-trainer-deploy"
mkdir "blackjack-payout-trainer-deploy"

REM Copy files
copy "index.html" "blackjack-payout-trainer-deploy\"
copy "styles.css" "blackjack-payout-trainer-deploy\"
copy "script.js" "blackjack-payout-trainer-deploy\"
copy "test-suite.js" "blackjack-payout-trainer-deploy\"
copy "README.md" "blackjack-payout-trainer-deploy\"
copy "USER_GUIDE.md" "blackjack-payout-trainer-deploy\"
copy "DEVELOPER_GUIDE.md" "blackjack-payout-trainer-deploy\"

REM Create deployment info
echo Blackjack Payout Trainer - Deployment Package > "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo Generated: %date% %time% >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo Version: 1.0.0 >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo. >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo Files included: >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo - index.html (Main application page) >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo - styles.css (All styling and animations) >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo - script.js (Core application logic) >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo - test-suite.js (Testing framework) >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo - README.md (User documentation) >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo - USER_GUIDE.md (Detailed user guide) >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo - DEVELOPER_GUIDE.md (Technical documentation) >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo. >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo Deployment Instructions: >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo 1. Upload all files to your web server >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo 2. Ensure the server supports HTML5 and modern JavaScript >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo 3. Test the application in a web browser >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"
echo 4. Configure HTTPS for optimal performance (recommended) >> "blackjack-payout-trainer-deploy\DEPLOYMENT_INFO.txt"

echo [SUCCESS] Deployment package created in blackjack-payout-trainer-deploy\
echo.

echo [SUCCESS] Deployment preparation complete!
echo.
echo 📦 Deployment package: blackjack-payout-trainer-deploy\
echo.
echo Next steps:
echo 1. Review the deployment package
echo 2. Choose a hosting platform (GitHub Pages, Netlify, Vercel, etc.)
echo 3. Upload the files
echo 4. Test the deployed application
echo.
echo [SUCCESS] Ready for deployment! 🚀
echo.
pause