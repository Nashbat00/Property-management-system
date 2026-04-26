import { useDemoState } from '../hooks/useDemoState';
import { Link } from 'react-router-dom';

function StatCard({ label, value, accent }) {
  return (
    <div className="card">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

export default function ManagerDashboard() {
  const { units, dues, payments, maintenance, announcements } = useDemoState();

  const totalBalance = units.reduce((sum, u) => sum + u.currentBalance, 0);
  const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  const pendingMaintenance = maintenance.filter((m) => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manager Dashboard</h2>
        <p className="text-gray-500 text-sm">Overview of your building&apos;s status.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Units" value={units.length} />
        <StatCard
          label="Outstanding Balance"
          value={`$${totalBalance}`}
          accent={totalBalance > 0 ? 'text-orange-600' : 'text-green-600'}
        />
        <StatCard
          label="Pending Payments"
          value={pendingPayments}
          accent={pendingPayments > 0 ? 'text-yellow-600' : 'text-gray-900'}
        />
        <StatCard
          label="Open Maintenance"
          value={pendingMaintenance}
          accent={pendingMaintenance > 0 ? 'text-red-600' : 'text-gray-900'}
        />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Units</h3>
          <Link to="/dues" className="text-sm text-primary-600 hover:underline">
            Manage dues -&gt;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2">Unit</th>
                <th className="py-2">Floor</th>
                <th className="py-2">Balance</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.id} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{u.unitNumber}</td>
                  <td className="py-2 text-gray-600">{u.floor}</td>
                  <td className="py-2">${u.currentBalance}</td>
                  <td className="py-2">
                    {u.currentBalance === 0 ? (
                      <span className="badge bg-green-100 text-green-700">Paid</span>
                    ) : (
                      <span className="badge bg-orange-100 text-orange-700">Outstanding</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Dues</h3>
          {dues.slice(-3).reverse().map((d) => {
            const unit = units.find((u) => u.id === d.unitId);
            return (
              <div key={d.id} className="flex justify-between py-2 border-b last:border-0 border-gray-100 text-sm">
                <span>Unit {unit?.unitNumber} - {d.month}</span>
                <span className="font-medium">${d.amount}</span>
              </div>
            );
          })}
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Latest Announcement</h3>
          {announcements[0] ? (
            <div>
              <p className="font-medium text-gray-900">{announcements[0].title}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcements[0].content}</p>
              <Link to="/announcements" className="text-xs text-primary-600 hover:underline mt-2 inline-block">
                View all -&gt;
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No announcements yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
