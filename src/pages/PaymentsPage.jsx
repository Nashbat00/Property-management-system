import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDemoState } from '../hooks/useDemoState';
import { deletePayment, notifyPayment, updatePaymentStatus } from '../lib/demoStore';
import QuickPay from '../components/payments/QuickPay';

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return <span className={`badge ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const { units, payments } = useDemoState();
  const [amount, setAmount] = useState('250');
  const [month, setMonth] = useState(getCurrentMonth());
  const [success, setSuccess] = useState('');

  const isManager = user?.role === 'manager';

  const visiblePayments = isManager
    ? [...payments].reverse()
    : [...payments].filter((p) => p.residentId === user?.id).reverse();

  function handleNotify(e) {
    e.preventDefault();
    setSuccess('');
    notifyPayment({
      unitId: user.unitId,
      residentId: user.id,
      amount: Number(amount),
      month,
    });
    setSuccess('Payment notification sent. Awaiting manager confirmation.');
  }

  function confirm(id) {
    updatePaymentStatus(id, 'confirmed');
  }

  function reject(id) {
    updatePaymentStatus(id, 'rejected');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Payments</h2>

      {!isManager && user?.unitId && (
        <QuickPay
          amount={Number(amount)}
          month={month}
          onPay={(method) =>
            notifyPayment({
              unitId: user.unitId,
              residentId: user.id,
              amount: Number(amount),
              month,
              method,
            })
          }
        />
      )}

      {!isManager && user?.unitId && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Notify a manual / bank payment</h3>
          {success && (
            <div className="mb-3 p-2 rounded bg-green-50 text-green-700 text-sm border border-green-100">
              {success}
            </div>
          )}
          <form onSubmit={handleNotify} className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Month</label>
              <input
                type="month"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                Send notification
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            After making a bank transfer, notify your manager here so they can confirm it.
          </p>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">
          {isManager ? 'All payment notifications' : 'My payment history'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2">Date</th>
                <th className="py-2">Unit</th>
                <th className="py-2">Month</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Method</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visiblePayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-3 text-gray-500 text-center">
                    No payments yet.
                  </td>
                </tr>
              ) : (
                visiblePayments.map((p) => {
                  const unit = units.find((u) => u.id === p.unitId);
                  const methodLabel = {
                    apple: ' Pay',
                    google: 'G Pay',
                    card: 'Card',
                    bank: 'Bank',
                  }[p.method || 'bank'];
                  return (
                    <tr key={p.id} className="border-b border-gray-100">
                      <td className="py-2">{p.paymentDate}</td>
                      <td className="py-2">{unit?.unitNumber || '-'}</td>
                      <td className="py-2">{p.month}</td>
                      <td className="py-2 font-medium">${p.amount}</td>
                      <td className="py-2 text-gray-600">{methodLabel}</td>
                      <td className="py-2">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-2">
                        {isManager ? (
                          p.status === 'pending' ? (
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => confirm(p.id)}
                                className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => reject(p.id)}
                                className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => updatePaymentStatus(p.id, 'pending')}
                              className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                              title="Revert this decision"
                            >
                              ↶ Undo
                            </button>
                          )
                        ) : p.status === 'pending' ? (
                          <button
                            onClick={() => {
                              if (confirm('Cancel this payment notification?')) deletePayment(p.id);
                            }}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            title="Cancel this notification"
                          >
                            ↶ Undo
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
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
