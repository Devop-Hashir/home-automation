'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Device {
  _id: string;
  name: string;
  status: boolean;
  type: string;
  roomId?: { _id: string; name: string } | null;
  lastUpdated: string;
  relayNumber: number;
}

interface Room {
  _id: string;
  name: string;
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [token, router]);

  const fetchData = async () => {
    await Promise.all([fetchDevices(), fetchRooms()]);
    setLoading(false);
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDevices(data.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleToggleDevice = async (deviceId: string, status: boolean) => {
    try {
      await fetch('/api/devices/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceId, status }),
      });
      await fetchDevices();
    } catch (error) {
      console.error('Error toggling device:', error);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('Delete this device?')) return;
    try {
      await fetch(`/api/devices/${deviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const filteredDevices = selectedRoom
    ? devices.filter((d) => d.roomId?._id === selectedRoom)
    : devices;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🏠</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Home Automation
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </span>
              <button
                onClick={() => router.push('/logs')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                📊 Activity Logs
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Rooms</h2>
              <button
                onClick={() => setSelectedRoom(null)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all font-medium ${
                  selectedRoom === null
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                🏠 All Devices ({devices.length})
              </button>
              <div className="space-y-2 mb-4">
                {rooms.sort((a, b) => a.name.localeCompare(b.name)).map((room) => (
                  <button
                    key={room._id}
                    onClick={() => setSelectedRoom(room._id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                      selectedRoom === room._id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    📍 {room.name} ({devices.filter(d => d.roomId?._id === room._id).length})
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddRoom(true)}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md"
              >
                + Add Room
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedRoom ? rooms.find((r) => r._id === selectedRoom)?.name : 'All Devices'}
              </h2>
              <button
                onClick={() => setShowAddDevice(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                + Add Device
              </button>
            </div>

            {filteredDevices.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No devices yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Add your first device to get started with home automation
                </p>
                <button
                  onClick={() => setShowAddDevice(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Add Your First Device
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDevices.map((device) => (
                  <DeviceCardImproved
                    key={device._id}
                    device={device}
                    onToggle={handleToggleDevice}
                    onDelete={handleDeleteDevice}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddDevice && (
        <AddDeviceModal
          token={token!}
          rooms={rooms}
          onClose={() => setShowAddDevice(false)}
          onSuccess={() => {
            setShowAddDevice(false);
            fetchDevices();
          }}
        />
      )}

      {showAddRoom && (
        <AddRoomModal
          token={token!}
          onClose={() => setShowAddRoom(false)}
          onSuccess={() => {
            setShowAddRoom(false);
            fetchRooms();
          }}
        />
      )}
    </div>
  );
}

// Improved Device Card Component
function DeviceCardImproved({
  device,
  onToggle,
  onDelete,
}: {
  device: Device;
  onToggle: (id: string, status: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(device._id, !device.status);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Light': return '💡';
      case 'Fan': return '🌀';
      case 'Outlet': return '🔌';
      default: return '📱';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getDeviceIcon(device.type)}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{device.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {device.roomId?.name || 'No Room'} • Relay {device.relayNumber}
            </p>
          </div>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            device.status ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}
          title={device.status ? 'ON' : 'OFF'}
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Status:</span>
          <span className={`font-semibold ${device.status ? 'text-green-600' : 'text-red-600'}`}>
            {device.status ? 'ON' : 'OFF'}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Updated: {new Date(device.lastUpdated).toLocaleString()}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            device.status
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
        >
          {loading ? '...' : device.status ? 'Turn OFF' : 'Turn ON'}
        </button>
        <button
          onClick={() => onDelete(device._id)}
          className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// Add Device Modal
function AddDeviceModal({
  token,
  rooms,
  onClose,
  onSuccess,
}: {
  token: string;
  rooms: Room[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [relayNumber, setRelayNumber] = useState('');
  const [type, setType] = useState('Light');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          roomId: roomId || null,
          relayNumber: parseInt(relayNumber),
          type,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Device</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Device Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
              placeholder="e.g., Living Room Light"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">No Room</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Relay Number (1-16)
            </label>
            <input
              type="number"
              min="1"
              max="16"
              value={relayNumber}
              onChange={(e) => setRelayNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
              placeholder="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Device Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Light">💡 Light</option>
              <option value="Fan">🌀 Fan</option>
              <option value="Outlet">🔌 Outlet</option>
              <option value="Other">📱 Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Device'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Room Modal
function AddRoomModal({
  token,
  onClose,
  onSuccess,
}: {
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Room</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
              placeholder="e.g., Living Room"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Room'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
