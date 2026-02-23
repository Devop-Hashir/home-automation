# Quick Start Guide

## The SWC/Turbopack Warning

You may see warnings about `@next/swc-win32-x64-msvc` when starting the dev server. **This is normal and can be safely ignored**. The application will fall back to using WASM bindings and work perfectly fine.

## Starting the Application

### 1. Start MongoDB

First, make sure MongoDB is running. Open a terminal and run:

```bash
mongod
```

Or if you're using MongoDB as a Windows service, it should already be running.

### 2. Start the Development Server

In the project directory, run:

```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.1.6
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
✓ Starting...
✓ Ready in 3.5s
```

You may see warnings about SWC - **ignore them**. The app will work fine.

### 3. Open Your Browser

Navigate to: **http://localhost:3000**

You should be automatically redirected to the login page.

## First Time Setup

### Step 1: Register an Account
1. Click "Register" link on the login page
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: At least 6 characters
   - Confirm Password: Same as password
3. Click "Register"
4. You'll be automatically logged in and redirected to the dashboard

### Step 2: Create Your First Room
1. On the dashboard, click "Add Room" in the sidebar
2. Enter a room name (e.g., "Living Room")
3. Click "Add Room"

### Step 3: Add Your First Device
1. Click the "+ Add Device" button
2. Fill in the form:
   - **Device Name**: e.g., "Living Room Light"
   - **Room**: Select the room you just created
   - **Relay Number**: Enter a number from 1-16 (must be unique)
   - **Device Type**: Select Light, Fan, Outlet, or Other
3. Click "Add Device"

### Step 4: Control Your Device
1. Find your device card on the dashboard
2. Click "Turn ON" to turn it on (indicator turns green)
3. Click "Turn OFF" to turn it off (indicator turns red)
4. The device status is saved in the database

### Step 5: View Activity Logs
1. Click "Activity Logs" in the top navigation
2. See all device actions with timestamps
3. View which control method was used (Web, Voice, Bluetooth, Manual)

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** Make sure MongoDB is running
```bash
mongod
```

### Issue: "Port 3000 is already in use"
**Solution:** Either:
1. Stop the other process using port 3000
2. Or change the port:
```bash
npm run dev -- -p 3001
```

### Issue: SWC/Turbopack Warnings
**Solution:** These are harmless warnings. The app uses WASM fallback and works perfectly. You can ignore them.

### Issue: "Module not found" errors
**Solution:** Reinstall dependencies:
```bash
npm install
```

### Issue: Login doesn't work
**Solution:** 
1. Check MongoDB is running
2. Check `.env.local` has correct MONGODB_URI
3. Clear browser localStorage and try again

## Environment Variables

Make sure your `.env.local` file has these variables:

```env
MONGODB_URI=mongodb://localhost:27017/home-automation
JWT_SECRET=your-secret-key-change-this-in-production
ESP32_IP=http://192.168.1.100
```

## Testing the Application

### Manual Testing Checklist:
- [ ] Register a new user
- [ ] Login with credentials
- [ ] Create a room
- [ ] Add a device
- [ ] Toggle device ON/OFF
- [ ] Edit device properties
- [ ] Delete a device
- [ ] Delete a room
- [ ] View activity logs
- [ ] Test pagination (add 50+ log entries)
- [ ] Test responsive design (resize browser)

## Default Credentials

There are no default credentials. You must register a new account on first use.

## Database

The application creates a MongoDB database called `home-automation` with these collections:
- `users` - User accounts
- `devices` - Device configurations
- `rooms` - Room definitions
- `activitylogs` - Device action history
- `schedules` - Scheduled actions

## API Endpoints

All API endpoints are available at `http://localhost:3000/api/`

See the main README.md for full API documentation.

## Next Steps

Once you have the basic app running:

1. **Add more devices** - Create devices for all your rooms
2. **Organize by rooms** - Use the sidebar to filter devices by room
3. **Monitor activity** - Check the logs page to see all device actions
4. **Create schedules** - Use the schedules API to automate devices

## Need Help?

Check the following files:
- `README.md` - Full documentation
- `IMPLEMENTATION_STATUS.md` - Feature status and what's implemented
- MongoDB logs - Check for database connection issues
- Browser console - Check for JavaScript errors

## Production Deployment

When ready to deploy:

1. Update `.env.local` with production values
2. Change `JWT_SECRET` to a secure random string
3. Use a cloud MongoDB instance (MongoDB Atlas)
4. Run `npm run build`
5. Run `npm start`
6. Deploy to Vercel, Netlify, or your preferred hosting

---

**Enjoy your Home Automation System! 🏠✨**
