#!/bin/bash

# HackmeNow Simple Deployment Script for Pure HTML/CSS/JS
# This script creates a deployment package for any web hosting service

echo "🚀 Preparing HackmeNow for simple web hosting deployment..."

# Create deployment directory
echo "📁 Creating deployment package..."
mkdir -p hackmenow-simple

# Copy all necessary files
echo "📄 Copying files..."
cp index.html hackmenow-simple/
cp -r src/ hackmenow-simple/
cp -r public/ hackmenow-simple/

# Create .htaccess for better compatibility (optional)
echo "🔧 Creating .htaccess file..."
cat > hackmenow-simple/.htaccess << 'EOF'
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Frame-Options DENY
</IfModule>
EOF

# Create README for deployment
echo "📝 Creating deployment instructions..."
cat > hackmenow-simple/README.md << 'EOF'
# HackmeNow - Simple Deployment

This is a pure HTML/CSS/JavaScript version of HackmeNow that can be deployed on any web hosting service.

## Deployment Instructions:

### For any web hosting (including Namecheap shared hosting):

1. Upload all files in this folder to your domain's public_html directory
2. Make sure the folder structure is preserved:
   ```
   public_html/
   ├── index.html
   ├── .htaccess (optional, for better performance)
   ├── src/
   │   ├── style.css
   │   ├── main.js
   │   └── js/
   │       ├── BootSequence.js
   │       ├── GameEngine.js
   │       ├── FileExplorer.js
   │       ├── NetworkMonitor.js
   │       ├── StorylineManager.js
   │       ├── Terminal.js
   │       ├── WindowManager.js
   │       └── WiresharkSimulator.js
   └── public/
       └── vite.svg
   ```

3. Visit your domain to play the game!

## Features:
- No server-side dependencies required
- Works on any web hosting service
- Pure client-side JavaScript
- No build process needed
- No Node.js required

## File Upload Methods:
- **cPanel File Manager**: Upload through your hosting control panel
- **FTP**: Use FileZilla or any FTP client
- **Drag & Drop**: Many hosting services support direct file upload

Your HackmeNow game will be available at: https://yourdomain.com
EOF

# Create zip package
echo "📦 Creating zip package..."
cd hackmenow-simple
zip -r ../hackmenow-simple-deployment.zip . -x "*.DS_Store"
cd ..

echo "✅ Simple deployment package created!"
echo ""
echo "📋 Deployment options:"
echo "1. Upload the 'hackmenow-simple' folder contents to your web hosting"
echo "2. Or extract 'hackmenow-simple-deployment.zip' on your web hosting"
echo ""
echo "📁 Package includes:"
echo "- index.html (main file)"
echo "- src/ folder with all CSS and JavaScript"
echo "- public/ folder with assets"
echo "- .htaccess for better performance (optional)"
echo "- README.md with deployment instructions"
echo ""
echo "🌐 No server configuration needed - works on any web hosting!"
echo "📂 Total package contents:"
find hackmenow-simple -type f | wc -l
echo "files ready for deployment"
