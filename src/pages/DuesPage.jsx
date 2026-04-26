import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDemoState } from '../hooks/useDemoState';
import { createDues, deleteDues, updateDues } from '../lib/demoStore';

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function DuesPage() {
  const { user } = useAuth();
  const { units, dues } = useDemoState();
  const [amount, setAmount] = useState('250');
  const [month, setMonth] = useState(getCurrentMonth());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state for a single row at a time
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMonth, setEditMonth] = useState('');

  const isManager = user?.role === 'manager';

  function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (dues.some((d) => d.month === month)) {
      setError(`Dues for ${month} have already been created`);
      return;
    }
    const records = createDues({ amount: numericAmount, month });
    setSuccess(`Created dues for ${records.length} units (${month})`);
  }

  function startEdit(d) {
    setEditingId(d.id);
    setEditAmount(String(d.amount));
    setEditMonth(d.month);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditAmount('');
    setEditMonth('');
  }

  function saveEdit(id) {
    const numeric = Number(editAmount);
    if (!numeric || numeric <= 0) return;
    updateDues(id, { amount: numeric, month: editMonth });
    cancelEdit();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dues</h2>

      {isManager && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Create monthly dues</h3>
          {error && (
            <div className="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 p-2 rounded bg-green-50 text-green-700 text-sm border border-green-100">
              {success}
            </div>
          )}
          <form onSubmit={handleCreate} className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount per unit</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                Create for all units
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">All dues</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2">Month</th>
                <th className="py-2">Unit</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Created</th>
                {isManager && <th className="py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {dues.length === 0 ? (
                <tr>
                  <td colSpan={isManager ? 5 : 4} className="py-3 text-gray-500 text-center">
                    No dues yet.
                  </td>
                </tr>
              ) : (
                [...dues].reverse().map((d) => {
                  const unit = units.find((u) => u.id === d.unitId);
                  const isEditing = editingId === d.id;
                  return (
                    <tr key={d.id} className="border-b border-gray-100 align-top">
                      <td className="py-2 font-medium">
                        {isEditing ? (
                          <input
                            type="month"
                            value={editMonth}
                            onChange={(e) => setEditMonth(e.target.value)}
                            className="input-field py-1 text-xs"
                          />
                        ) : (
                          d.month
                        )}
                      </td>
                      <td className="py-2">{unit?.unitNumber || '-'}</td>
                      <td className="py-2">
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="input-field py-1 text-xs w-24"
                          />
                        ) : (
                          `$${d.amount}`
                        )}
                      </td>
                      <td className="py-2 text-gray-500">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      {isManager && (
                        <td className="py-2">
                          {isEditing ? (
                            <div className="flex gap-1 flex-wrap">
                              <button
                                onClick={() => saveEdit(d.id)}
                                className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1 flex-wrap">
                              <button
                                onClick={() => startEdit(d)}
                                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                title="Edit amount or month"
                              >
                                ✎ Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Remove this dues record?')) deleteDues(d.id);
                                }}
                                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                title="Undo this dues record"
                              >
                                ↶ Undo
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
