import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDemoState } from '../hooks/useDemoState';
import { deleteAnnouncement, postAnnouncement } from '../lib/demoStore';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { announcements } = useDemoState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const isManager = user?.role === 'manager';

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    postAnnouncement({ title: title.trim(), content: content.trim(), createdBy: user.id });
    setTitle('');
    setContent('');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>

      {isManager && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Post a new announcement</h3>
          {error && (
            <div className="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
            <textarea
              placeholder="Content"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn-primary">
              Post Announcement
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-sm text-gray-500">No announcements yet.</p>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className="card">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">{ann.title}</h4>
                <span className="text-xs text-gray-400">
                  {new Date(ann.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{ann.content}</p>
              {isManager && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      if (confirm('Delete this announcement?')) deleteAnnouncement(ann.id);
                    }}
                    className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    title="Undo / remove this announcement"
                  >
                    ↶ Undo
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
