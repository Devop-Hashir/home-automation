'use client';

import { useState } from 'react';

interface Device {
  _id: string;
  name: string;
  status: boolean;
  type: string;
  roomId?: { name: string } | null;
  lastUpdated: string;
  relayNumber: number;
}

interface DeviceCardProps {
  device: Device;
  onToggle: (deviceId: string, status: boolean) => Promise<void>;
  onEdit: (device: Device) => void;
  onDelete: (deviceId: string) => void;
}

export default function DeviceCard({ device, onToggle, onEdit, onDelete }: DeviceCardProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(device._id, !device.status);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {device.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {device.roomId?.name || 'No Room'}
          </p>
        </div>
        <div
          className={`w-4 h-4 rounded-full ${
            device.status ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={device.status ? 'ON' : 'OFF'}
        />
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Type: {device.type}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Relay: {device.relayNumber}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Last updated: {formatDate(device.lastUpdated)}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            device.status
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {loading ? 'Loading...' : device.status ? 'Turn OFF' : 'Turn ON'}
        </button>
        <button
          onClick={() => onEdit(device)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(device._id)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
