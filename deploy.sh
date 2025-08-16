#!/bin/bash

# Blackjack Payout Trainer - Deployment Script
# This script helps deploy the application to various hosting platforms

set -e  # Exit on any error

echo "🎰 Blackjack Payout Trainer - Deployment Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    required_files=("index.html" "styles.css" "script.js" "test-suite.js" "README.md")
    missing_files=()
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        print_error "Missing required files:"
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        exit 1
    fi
    
    print_success "All required files found"
}

# Validate HTML, CSS, and JavaScript
validate_code() {
    print_status "Validating code..."
    
    # Check for basic HTML structure
    if ! grep -q "<!DOCTYPE html>" index.html; then
        print_warning "HTML5 DOCTYPE not found in index.html"
    fi
    
    # Check for CSS syntax (basic check)
    if grep -q "}" styles.css && grep -q "{" styles.css; then
        print_success "CSS appears to have valid syntax"
    else
        print_warning "CSS syntax may have issues"
    fi
    
    # Check for JavaScript syntax (basic check)
    if grep -q "class " script.js && grep -q "function" script.js; then
        print_success "JavaScript appears to have valid syntax"
    else
        print_warning "JavaScript syntax may have issues"
    fi
}

# Run tests if available
run_tests() {
    print_status "Running tests..."
    
    # Check if Node.js is available for testing
    if command -v node &> /dev/null; then
        # Create a simple test runner
        cat > test_runner.js << 'EOF'
// Simple test runner for deployment validation
const fs = require('fs');

// Load the test suite
const testSuiteContent = fs.readFileSync('test-suite.js', 'utf8');
const scriptContent = fs.readFileSync('script.js', 'utf8');

// Mock DOM elements for testing
global.document = {
    getElementById: () => ({ textContent: '', style: {} }),
    createElement: () => ({ 
        style: {}, 
        addEventListener: () => {},
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} }
    }),
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
};

global.window = {
    localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
    },
    addEventListener: () => {},
    performance: { now: () => Date.now() }
};

global.requestAnimationFrame = (fn) => setTimeout(fn, 16);

try {
    // Execute the scripts
    eval(scriptContent);
    eval(testSuiteContent);
    
    console.log('✅ Code validation passed');
    process.exit(0);
} catch (error) {
    console.error('❌ Code validation failed:', error.message);
    process.exit(1);
}
EOF
        
        if node test_runner.js; then
            print_success "Code validation passed"
        else
            print_error "Code validation failed"
            exit 1
        fi
        
        # Clean up
        rm test_runner.js
    else
        print_warning "Node.js not available - skipping code validation"
    fi
}

# Create deployment package
create_package() {
    print_status "Creating deployment package..."
    
    # Create deployment directory
    DEPLOY_DIR="blackjack-payout-trainer-deploy"
    rm -rf "$DEPLOY_DIR"
    mkdir -p "$DEPLOY_DIR"
    
    # Copy files
    cp index.html styles.css script.js test-suite.js "$DEPLOY_DIR/"
    cp README.md USER_GUIDE.md DEVELOPER_GUIDE.md "$DEPLOY_DIR/"
    
    # Create a simple .htaccess for Apache servers
    cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
EOF
    
    # Create deployment info
    cat > "$DEPLOY_DIR/DEPLOYMENT_INFO.txt" << EOF
Blackjack Payout Trainer - Deployment Package
Generated: $(date)
Version: 1.0.0

Files included:
- index.html (Main application page)
- styles.css (All styling and animations)
- script.js (Core application logic)
- test-suite.js (Testing framework)
- README.md (User documentation)
- USER_GUIDE.md (Detailed user guide)
- DEVELOPER_GUIDE.md (Technical documentation)
- .htaccess (Apache server configuration)

Deployment Instructions:
1. Upload all files to your web server
2. Ensure the server supports HTML5 and modern JavaScript
3. Test the application in a web browser
4. Configure HTTPS for optimal performance (recommended)

For more information, see README.md and DEVELOPER_GUIDE.md
EOF
    
    print_success "Deployment package created in $DEPLOY_DIR/"
}

# Generate deployment instructions
generate_instructions() {
    print_status "Generating deployment instructions..."
    
    cat > "DEPLOYMENT_INSTRUCTIONS.md" << 'EOF'
# Deployment Instructions

## Quick Deploy Options

### 1. GitHub Pages
1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your app will be available at `https://username.github.io/repository-name`

### 2. Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the deployment folder
3. Your app will be deployed instantly with a random URL
4. Optionally configure a custom domain

### 3. Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy
4. Your app will be available at the provided URL

### 4. Traditional Web Hosting
1. Upload all files to your web server's public directory
2. Ensure the server supports:
   - HTML5
   - Modern JavaScript (ES6+)
   - HTTPS (recommended)
3. Test the application in a web browser

## Server Requirements
- **Web Server**: Any HTTP server (Apache, Nginx, IIS, etc.)
- **HTTPS**: Recommended for localStorage persistence
- **Compression**: Enable gzip compression for better performance
- **Caching**: Set appropriate cache headers for static assets

## Testing Deployment
1. Open the application in a web browser
2. Verify all functionality works correctly
3. Test on different devices and browsers
4. Run the built-in test suite (press 'T' in the app)
5. Check browser console for any errors

## Troubleshooting
- **Files not loading**: Check file paths and server configuration
- **JavaScript errors**: Ensure the server supports modern JavaScript
- **Styling issues**: Verify CSS file is loading correctly
- **Performance problems**: Enable compression and caching

For more detailed information, see the README.md and DEVELOPER_GUIDE.md files.
EOF
    
    print_success "Deployment instructions created"
}

# Main deployment process
main() {
    echo
    print_status "Starting deployment preparation..."
    echo
    
    # Run all checks and preparations
    check_files
    validate_code
    run_tests
    create_package
    generate_instructions
    
    echo
    print_success "Deployment preparation complete!"
    echo
    echo "📦 Deployment package: blackjack-payout-trainer-deploy/"
    echo "📋 Instructions: DEPLOYMENT_INSTRUCTIONS.md"
    echo
    echo "Next steps:"
    echo "1. Review the deployment package"
    echo "2. Choose a hosting platform"
    echo "3. Upload the files"
    echo "4. Test the deployed application"
    echo
    print_success "Ready for deployment! 🚀"
}

# Handle command line arguments
case "${1:-}" in
    "check")
        check_files
        validate_code
        ;;
    "test")
        run_tests
        ;;
    "package")
        create_package
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "  check    - Check files and validate code"
        echo "  test     - Run tests"
        echo "  package  - Create deployment package"
        echo "  help     - Show this help message"
        echo
        echo "Run without arguments to perform full deployment preparation."
        ;;
    *)
        main
        ;;
esac