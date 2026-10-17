import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoomByCode, toggleRoom } from '../api/rooms';
import { updateQuestion, deleteQuestion } from '../api/questions';

const HostRoom = () => {
  const { code } = useParams();

  const [room, setRoom] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHidden, setShowHidden] = useState(true); 

  const loadRoom = async () => {
    try {
      const res = await getRoomByCode(code);
      setRoom(res.data.room);
      setQuestions(res.data.questions);
    } catch (err) {
      setNotFound(true);
    }
  };

  useEffect(() => {
    loadRoom();
    const interval = setInterval(loadRoom, 5000);
    return () => clearInterval(interval);
  }, [code]);

  const handleToggleRoom = async () => {
    try {
      await toggleRoom(room._id);
      loadRoom();
    } catch (err) {
      // ignore, next poll resyncs
    }
  };

  const handleQuestionUpdate = async (id, field, value) => {
    try {
      await updateQuestion(id, { [field]: value });
      loadRoom();
    } catch (err) {
      // ignore, next poll resyncs
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question permanently?')) return;
    try {
      await deleteQuestion(id);
      loadRoom();
    } catch (err) {
      // ignore
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/room/${code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-500">Room not found</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading room...</p>
      </div>
    );
  }

  const sorted = [...questions].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
    return b.voteCount - a.voteCount;
  });

const visibleQuestions = showHidden ? sorted : sorted.filter((q) => !q.isHidden);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 overflow-hidden">
        <div className="h-1 bg-slate-900" />
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-xs text-slate-500 hover:text-slate-700">
              ← Back to dashboard
            </Link>
            <h1 className="text-base font-semibold text-slate-900 mt-0.5">{room.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                room.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {room.isOpen ? 'Open' : 'Closed'}
            </span>
            <button
              onClick={handleToggleRoom}
              className="text-sm font-medium text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              {room.isOpen ? 'Close Room' : 'Reopen'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Share this link with your audience</p>
            <p className="text-sm font-mono text-slate-900 mt-0.5">
              {window.location.origin}/room/{code}
            </p>
          </div>
          <button
            onClick={copyLink}
            className="text-sm font-medium text-white bg-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition whitespace-nowrap"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
  <h2 className="text-sm font-semibold text-slate-900">
    Questions ({visibleQuestions.length})
  </h2>
  <label className="flex items-center gap-1.5 text-xs text-slate-500">
    <input
      type="checkbox"
      checked={showHidden}
      onChange={(e) => setShowHidden(e.target.checked)}
      className="rounded"
    />
    Show hidden
  </label>
</div>

        {sorted.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
            No questions yet. Share the link above to get started.
          </div>
        )}

        <div className="space-y-3">
          {visibleQuestions.map((q)  => (
  <div
    key={q._id}
    className={`bg-white border rounded-xl p-4 shadow-sm ${
      q.isHidden
        ? 'border-slate-200 bg-slate-50 opacity-70'
        : q.isAnswered
        ? 'border-emerald-200 bg-emerald-50/30'
        : 'border-slate-200'
    }`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex gap-1.5 mb-1.5">
          {q.isPinned && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
              Pinned
            </span>
          )}
          {q.isHidden && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
              Hidden
            </span>
          )}
        </div>
        <p className="text-sm text-slate-900">{q.text}</p>
      </div>
      <div className="flex flex-col items-center justify-center min-w-[48px]">
        <span className="text-sm font-semibold text-slate-900">{q.voteCount}</span>
        <span className="text-[10px] text-slate-400">votes</span>
      </div>
    </div>

    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
      <button
        onClick={() => handleQuestionUpdate(q._id, 'isAnswered', !q.isAnswered)}
        className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition ${
          q.isAnswered
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        {q.isAnswered ? '✓ Answered' : 'Mark Answered'}
      </button>

      <button
        onClick={() => handleQuestionUpdate(q._id, 'isPinned', !q.isPinned)}
        className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition ${
          q.isPinned
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        {q.isPinned ? 'Unpin' : 'Pin'}
      </button>

      <button
        onClick={() => handleQuestionUpdate(q._id, 'isHidden', !q.isHidden)}
        className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition ${
          q.isHidden
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        {q.isHidden ? 'Unhide' : 'Hide'}
      </button>

      <button
        onClick={() => handleDelete(q._id)}
        className="text-xs font-medium px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition ml-auto"
      >
        Delete
      </button>
    </div>
  </div>
))}
        </div>
      </main>
    </div>
  );
};

export default HostRoom;