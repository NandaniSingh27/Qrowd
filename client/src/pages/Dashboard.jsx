import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createRoom, getMyRooms, toggleRoom } from '../api/rooms';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { user, logoutUser } = useAuth();

  const loadRooms = async () => {
    try {
      const res = await getMyRooms();
      setRooms(res.data);
    } catch (err) {
      setError('Could not load rooms');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    setLoading(true);
    try {
      await createRoom({ title });
      setTitle('');
      loadRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create room');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleRoom(id);
      loadRooms();
    } catch (err) {
      setError('Could not update room');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 overflow-hidden">
        <div className="h-1 bg-slate-900" />
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Welcome back</p>
            <h1 className="text-base font-semibold text-slate-900">{user?.name}</h1>
          </div>
          <button
            onClick={logoutUser}
            className="text-sm text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Create a room</h2>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Weekly Team Q&A"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </form>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        <h2 className="text-sm font-semibold text-slate-900 mb-3">Your rooms</h2>

        {fetching && <p className="text-sm text-slate-500">Loading rooms...</p>}

        {!fetching && rooms.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
            No rooms yet — create one above to get started.
          </div>
        )}

        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{room.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-slate-500">{room.code}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      room.isOpen
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {room.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/host/${room.code}`}
                  className="text-sm font-medium text-white bg-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
                >
                  Manage
                </Link>
                <button
                  onClick={() => handleToggle(room._id)}
                  className="text-sm font-medium text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
                >
                  {room.isOpen ? 'Close' : 'Reopen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;