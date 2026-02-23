# Windows Setup Guide

## Understanding the SWC Warning

When you run `npm run dev`, you might see this warning:

```
⚠ Attempted to load @next/swc-win32-x64-msvc, but an error occurred: 
\\?\D:\Next\auto-home\home-automation\node_modules\@next\swc-win32-x64-msvc\next-swc.win32-x64-msvc.node 
is not a valid Win32 application.
```

### What This Means

This warning appears because:
1. Next.js 16 tries to use the native SWC compiler (faster)
2. The native compiler has compatibility issues on some Windows systems
3. Next.js automatically falls back to WASM bindings (slightly slower but works perfectly)

### Is This a Problem?

**NO!** This is just a warning, not an error. Your application will:
- ✅ Start successfully
- ✅ Work perfectly
- ✅ Compile your code correctly
- ✅ Hot reload on file changes
- ⚠️ Be slightly slower to compile (but still fast enough)

### Can I Fix It?

You can try these solutions, but **it's not necessary**:

#### Solution 1: Reinstall Node.js (Most Reliable)
1. Uninstall Node.js completely
2. Download the latest LTS version from https://nodejs.org
3. Install with default options
4. Restart your computer
5. Run `npm install` in the project directory

#### Solution 2: Clear npm Cache
```bash
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

#### Solution 3: Use Different Node Version
If you have nvm (Node Version Manager):
```bash
nvm install 20.11.0
nvm use 20.11.0
npm install
```

#### Solution 4: Just Ignore It
The easiest solution - **do nothing**. The app works fine with the WASM fallback.

## Running the Application

### Option 1: Command Line (Recommended)
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

### Option 2: VS Code Terminal
1. Open VS Code
2. Open Terminal (Ctrl + `)
3. Run `npm run dev`
4. Click the localhost link that appears

### Option 3: PowerShell
```powershell
cd D:\Next\auto-home\home-automation
npm run dev
```

## MongoDB Setup on Windows

### Option 1: MongoDB Community Server (Local)

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Download Windows installer
   - Run installer with default options

2. **Start MongoDB**
   ```bash
   # As a service (automatic)
   net start MongoDB
   
   # Or manually
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

3. **Verify MongoDB is Running**
   ```bash
   # Open MongoDB Shell
   mongosh
   
   # You should see:
   # Current Mongosh Log ID: ...
   # Connecting to: mongodb://127.0.0.1:27017
   ```

### Option 2: MongoDB Atlas (Cloud - Easier)

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select region closest to you
   - Click "Create"

3. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Update .env.local**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/home-automation?retryWrites=true&w=majority
   ```

## Common Windows Issues

### Issue: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH
```bash
# Reinstall Node.js from https://nodejs.org
# Make sure to check "Add to PATH" during installation
```

### Issue: "Cannot find module"
**Solution:** Dependencies not installed
```bash
npm install
```

### Issue: "Port 3000 already in use"
**Solution:** Another app is using port 3000
```bash
# Option 1: Use different port
npm run dev -- -p 3001

# Option 2: Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: "EACCES: permission denied"
**Solution:** Run as administrator or fix permissions
```bash
# Run PowerShell as Administrator
# Or fix npm permissions:
npm config set prefix %APPDATA%\npm
```

### Issue: MongoDB connection timeout
**Solution:** MongoDB is not running
```bash
# Check if MongoDB service is running
sc query MongoDB

# Start MongoDB service
net start MongoDB
```

## Performance Tips for Windows

### 1. Exclude from Windows Defender
Add these folders to Windows Defender exclusions:
- `D:\Next\auto-home\home-automation\node_modules`
- `D:\Next\auto-home\home-automation\.next`

This can speed up compilation by 2-3x.

**Steps:**
1. Open Windows Security
2. Go to "Virus & threat protection"
3. Click "Manage settings"
4. Scroll to "Exclusions"
5. Click "Add or remove exclusions"
6. Add the folders above

### 2. Use SSD
Make sure your project is on an SSD drive, not HDD. This significantly improves:
- npm install speed
- Compilation speed
- Hot reload speed

### 3. Close Unnecessary Programs
When developing, close:
- Heavy IDEs (if not using)
- Chrome tabs (keep only what you need)
- Background apps

## Recommended Windows Setup

### Terminal
- **Windows Terminal** (recommended) - Download from Microsoft Store
- **PowerShell 7** - More features than default PowerShell
- **Git Bash** - Unix-like commands on Windows

### Code Editor
- **VS Code** (recommended)
  - Install "ES7+ React/Redux/React-Native snippets"
  - Install "Tailwind CSS IntelliSense"
  - Install "MongoDB for VS Code"

### Browser
- **Chrome** or **Edge** (Chromium-based)
  - Required for Bluetooth features
  - Better dev tools
  - React DevTools extension

## Development Workflow

1. **Start MongoDB** (if not running as service)
   ```bash
   net start MongoDB
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to http://localhost:3000
   - Open DevTools (F12)

4. **Make Changes**
   - Edit files in VS Code
   - Save (Ctrl+S)
   - Browser auto-refreshes

5. **Check Logs**
   - Terminal: Server logs
   - Browser Console: Client logs
   - MongoDB Compass: Database

## Useful Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clear Next.js cache
rm -rf .next

# Clear all and reinstall
rm -rf node_modules .next
npm install

# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB status
sc query MongoDB
```

## Getting Help

If you're still having issues:

1. **Check the error message carefully**
   - Read the full error, not just the first line
   - Google the specific error message

2. **Check the logs**
   - Terminal output
   - Browser console (F12)
   - MongoDB logs

3. **Try the basics**
   - Restart the dev server
   - Clear browser cache
   - Restart MongoDB
   - Restart your computer

4. **Search for solutions**
   - Stack Overflow
   - Next.js GitHub issues
   - MongoDB documentation

---

**Remember: The SWC warning is harmless. Your app works perfectly! 🚀**
