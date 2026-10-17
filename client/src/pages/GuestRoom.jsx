import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomByCode } from '../api/rooms';
import { submitQuestion, voteQuestion } from '../api/questions';
import { useVoterId } from '../hooks/useVoterId';

const GuestRoom = () => {
  const { code } = useParams();
  const voterId = useVoterId();

  const [room, setRoom] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [votedIds, setVotedIds] = useState(new Set());

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
    const interval = setInterval(loadRoom, 5000); // simple polling refresh
    return () => clearInterval(interval);
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (text.trim().length < 3) {
      setError('Question must be at least 3 characters');
      return;
    }

    setSubmitting(true);
    try {
      await submitQuestion(code, { text });
      setText('');
      loadRoom();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id) => {
    if (!voterId) return;
    try {
      const res = await voteQuestion(id, voterId);
      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? { ...q, voteCount: res.data.voteCount } : q))
      );
      setVotedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    } catch (err) {
      // fail silently on vote race conditions, next poll will resync
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-slate-900">Room not found</h1>
          <p className="text-sm text-slate-500 mt-1">Check the link and try again.</p>
        </div>
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 overflow-hidden">
        <div className="h-1 bg-slate-900" />
        <div className="max-w-2xl mx-auto px-5 py-4">
          <h1 className="text-base font-semibold text-slate-900">{room.title}</h1>
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
              room.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {room.isOpen ? 'Accepting questions' : 'Closed'}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8">
        {room.isOpen && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={300}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 whitespace-nowrap"
              >
                {submitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        )}

        {questions.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
            No questions yet — be the first to ask.
          </div>
        )}

        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q._id}
              className={`bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm ${
                q.isAnswered ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
              }`}
            >
              <div className="flex-1 pr-4">
                {q.isPinned && (
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                    Pinned
                  </span>
                )}
                <p className="text-sm text-slate-900">{q.text}</p>
                {q.isAnswered && (
                  <span className="text-xs font-medium text-emerald-700 mt-1 inline-block">
                    ✓ Answered
                  </span>
                )}
              </div>
              <button
                onClick={() => handleVote(q._id)}
                className={`flex flex-col items-center justify-center min-w-[52px] py-2 rounded-lg border transition ${
                  votedIds.has(q._id)
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-semibold">{q.voteCount}</span>
                <span className="text-[10px]">votes</span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GuestRoom;