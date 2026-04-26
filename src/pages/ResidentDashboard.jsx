import { useDemoState } from '../hooks/useDemoState';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function ResidentDashboard() {
  const { user } = useAuth();
  const { units, dues, payments, maintenance, announcements } = useDemoState();

  const myUnit = units.find((u) => u.id === user?.unitId);
  const myDues = dues.filter((d) => d.unitId === myUnit?.id).slice(-5).reverse();
  const myPayments = payments.filter((p) => p.residentId === user?.id);
  const myMaintenance = maintenance.filter((m) => m.residentId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName}</h2>
        <p className="text-gray-500 text-sm">
          {myUnit ? `Unit ${myUnit.unitNumber} - Floor ${myUnit.floor}` : 'No unit assigned yet.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Current Balance</p>
          <p className={`text-3xl font-bold mt-1 ${
            (myUnit?.currentBalance || 0) > 0 ? 'text-orange-600' : 'text-green-600'
          }`}>
            ${myUnit?.currentBalance || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {(myUnit?.currentBalance || 0) > 0 ? 'Payment required' : 'All paid'}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">My Payments</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">{myPayments.length}</p>
          <Link to="/payments" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
            View history -&gt;
          </Link>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Open Requests</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">
            {myMaintenance.filter((m) => m.status !== 'resolved').length}
          </p>
          <Link to="/maintenance" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
            Submit new -&gt;
          </Link>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Recent Dues</h3>
        {myDues.length === 0 ? (
          <p className="text-sm text-gray-500">No dues yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {myDues.map((d) => (
              <div key={d.id} className="flex justify-between py-2 text-sm">
                <span className="text-gray-700">{d.month}</span>
                <span className="font-medium">${d.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Latest Announcement</h3>
        {announcements[0] ? (
          <div>
            <p className="font-medium text-gray-900">{announcements[0].title}</p>
            <p className="text-sm text-gray-600 mt-1">{announcements[0].content}</p>
            <Link
              to="/announcements"
              className="text-xs text-primary-600 hover:underline mt-2 inline-block"
            >
              View all -&gt;
            </Link>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No announcements yet.</p>
        )}
      </div>
    </div>
  );
}
