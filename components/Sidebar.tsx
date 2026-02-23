'use client';

interface Room {
  _id: string;
  name: string;
}

interface SidebarProps {
  rooms: Room[];
  selectedRoom: string | null;
  onRoomSelect: (roomId: string | null) => void;
  onAddRoom: () => void;
}

export default function Sidebar({ rooms, selectedRoom, onRoomSelect, onAddRoom }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Rooms</h2>
      
      <button
        onClick={() => onRoomSelect(null)}
        className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
          selectedRoom === null
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        All Devices
      </button>

      <div className="space-y-2 mb-4">
        {rooms.sort((a, b) => a.name.localeCompare(b.name)).map((room) => (
          <button
            key={room._id}
            onClick={() => onRoomSelect(room._id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedRoom === room._id
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>

      <button
        onClick={onAddRoom}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        + Add Room
      </button>
    </div>
  );
}
