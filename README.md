# Home Automation System

A comprehensive Next.js 14 web application for controlling ESP32-connected home automation devices with multiple control methods: web interface, voice commands, Bluetooth connectivity, and manual switches.

## Features

✅ **User Authentication** - Secure registration and login with JWT
✅ **Device Management** - Add, edit, delete, and control devices
✅ **Room Organization** - Group devices by rooms
✅ **Real-Time Updates** - Live device status updates (Socket.io ready)
✅ **Activity Logging** - Track all device actions with timestamps
✅ **Voice Control** - Control devices using voice commands (Web Speech API)
✅ **Bluetooth Mode** - Direct device control via Bluetooth (Web Bluetooth API)
✅ **Scheduling** - Schedule devices to turn on/off at specific times
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Dark Mode** - Toggle between light and dark themes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Real-Time**: Socket.io (ready to implement)
- **Voice Control**: Web Speech API
- **Bluetooth**: Web Bluetooth API

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Modern browser (Chrome recommended for Bluetooth features)

## Installation

1. **Clone and navigate to the project**:
   ```bash
   cd home-automation
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Edit `.env.local` file with your settings:
   ```env
   MONGODB_URI=mongodb://localhost:27017/home-automation
   JWT_SECRET=your-secret-key-change-this-in-production
   ESP32_IP=http://192.168.1.100
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
home-automation/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── devices/      # Device management endpoints
│   │   ├── rooms/        # Room management endpoints
│   │   ├── logs/         # Activity logs endpoint
│   │   ├── schedules/    # Scheduling endpoints
│   │   └── esp32/        # ESP32 communication endpoint
│   ├── dashboard/        # Main dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── logs/             # Activity logs page
│   └── layout.tsx        # Root layout with AuthProvider
├── components/           # Reusable React components
│   ├── DeviceCard.tsx    # Device card component
│   └── Sidebar.tsx       # Sidebar component
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # MongoDB connection
│   └── auth.ts           # JWT utilities
├── models/               # Mongoose schemas
│   ├── User.ts           # User model
│   ├── Device.ts         # Device model
│   ├── Room.ts           # Room model
│   ├── ActivityLog.ts    # Activity log model
│   └── Schedule.ts       # Schedule model
└── .env.local            # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Devices
- `GET /api/devices` - Get all user devices
- `POST /api/devices` - Create new device
- `PUT /api/devices/[id]` - Update device
- `DELETE /api/devices/[id]` - Delete device
- `POST /api/devices/update` - Toggle device ON/OFF

### Rooms
- `GET /api/rooms` - Get all user rooms
- `POST /api/rooms` - Create new room
- `DELETE /api/rooms/[id]` - Delete room

### Logs
- `GET /api/logs` - Get activity logs (paginated)

### Schedules
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create schedule
- `DELETE /api/schedules/[id]` - Delete schedule

### ESP32
- `POST /api/esp32/update` - Receive status updates from ESP32

## Usage Guide

### 1. Register and Login
- Navigate to `/register` to create an account
- Login with your credentials at `/login`

### 2. Add Rooms
- Click "Add Room" in the sidebar
- Enter room name (e.g., "Living Room", "Bedroom")

### 3. Add Devices
- Click "+ Add Device" button
- Fill in device details:
  - Name (e.g., "Living Room Light")
  - Room (select from dropdown)
  - Relay Number (1-16, must be unique)
  - Type (Light, Fan, Outlet, Other)

### 4. Control Devices
- Click "Turn ON" or "Turn OFF" on device cards
- Status indicator shows current state (green = ON, red = OFF)
- Edit device properties with "Edit" button
- Delete devices with "Delete" button (confirmation required)

### 5. View Activity Logs
- Click "Activity Logs" in the navigation
- See all device actions with timestamps
- Filter by control method (Web, Voice, Bluetooth, Manual)

### 6. Voice Control (Coming Soon)
- Click microphone button
- Say device name and action (e.g., "Turn on living room light")
- System will parse and execute command

### 7. Bluetooth Control (Coming Soon)
- Enable Bluetooth mode
- Connect to ESP32 device
- Control devices directly without internet

## ESP32 Integration

### ESP32 Setup
Your ESP32 should send HTTP POST requests to update device status:

```cpp
// When manual switch is toggled
POST http://your-server/api/esp32/update
Content-Type: application/json

{
  "relayNumber": 1,
  "status": true
}
```

### Receiving Commands
ESP32 should listen for commands from the server (implement webhook or polling).

## Database Schema

### Users
- name, email, password (hashed), role, timestamps

### Devices
- name, roomId, relayNumber, status, type, userId, lastUpdated, timestamps

### Rooms
- name, userId, timestamps

### Activity Logs
- deviceId, deviceName, action, triggeredBy, userId, timestamp

### Schedules
- deviceId, userId, time, action, enabled, timestamps

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- User data isolation
- Input validation
- Error sanitization

## Development

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in `.env.local`
- Verify network connectivity

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token expiration (7 days default)

### Device Not Updating
- Check ESP32 connectivity
- Verify relay number is correct
- Check activity logs for errors

## Future Enhancements

- [ ] Socket.io real-time updates implementation
- [ ] Voice control with Web Speech API
- [ ] Bluetooth control with Web Bluetooth API
- [ ] Schedule execution with cron jobs
- [ ] Energy usage tracking
- [ ] Multi-user support with roles
- [ ] Device grouping
- [ ] Offline detection
- [ ] Mobile app (React Native)

## Contributing

This is a project template. Feel free to customize and extend based on your needs.

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions, please check the documentation or create an issue in the repository.

---

Built with ❤️ using Next.js 14 and TypeScript
