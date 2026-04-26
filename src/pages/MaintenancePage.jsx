import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDemoState } from '../hooks/useDemoState';
import { submitMaintenance, updateMaintenanceStatus } from '../lib/demoStore';

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
  };
  return <span className={`badge ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status.replace('_', ' ')}</span>;
}

export default function MaintenancePage() {
  const { user } = useAuth();
  const { units, maintenance } = useDemoState();
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const isManager = user?.role === 'manager';
  const visible = isManager
    ? [...maintenance].reverse()
    : [...maintenance].filter((m) => m.residentId === user?.id).reverse();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }
    submitMaintenance({
      unitId: user.unitId,
      residentId: user.id,
      description: description.trim(),
    });
    setDescription('');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Maintenance Requests</h2>

      {!isManager && user?.unitId && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Submit a new request</h3>
          {error && (
            <div className="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Describe the issue (e.g. water leak in kitchen, broken light bulb)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn-primary">
              Submit request
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">
          {isManager ? 'All requests' : 'My requests'}
        </h3>
        <div className="space-y-3">
          {visible.length === 0 ? (
            <p className="text-sm text-gray-500">No maintenance requests yet.</p>
          ) : (
            visible.map((m) => {
              const unit = units.find((u) => u.id === m.unitId);
              return (
                <div key={m.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500">
                      Unit {unit?.unitNumber || '-'} -{' '}
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                    <StatusBadge status={m.status} />
                  </div>
                  <p className="text-sm text-gray-800">{m.description}</p>
                  {m.resolvedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Resolved on {new Date(m.resolvedAt).toLocaleDateString()}
                    </p>
                  )}
                  {isManager && m.status !== 'resolved' && (
                    <div className="flex gap-2 mt-2">
                      {m.status === 'pending' && (
                        <button
                          onClick={() => updateMaintenanceStatus(m.id, 'in_progress')}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Mark in progress
                        </button>
                      )}
                      <button
                        onClick={() => updateMaintenanceStatus(m.id, 'resolved')}
                        className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark resolved
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
