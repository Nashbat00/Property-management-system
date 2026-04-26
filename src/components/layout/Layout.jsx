import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const isManager = user?.role === 'manager';
  const baseRoute = isManager ? '/dashboard/manager' : '/dashboard/resident';

  const navItems = isManager
    ? [
        { to: baseRoute, label: 'Overview', end: true },
        { to: '/dues', label: 'Dues' },
        { to: '/payments', label: 'Payments' },
        { to: '/maintenance', label: 'Maintenance' },
        { to: '/announcements', label: 'Announcements' },
      ]
    : [
        { to: baseRoute, label: 'My Unit', end: true },
        { to: '/payments', label: 'Payments' },
        { to: '/maintenance', label: 'Maintenance' },
        { to: '/announcements', label: 'Announcements' },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-bold text-lg text-primary-700">HomeLink</h1>
            <nav className="hidden sm:flex gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {!isSupabaseConfigured && (
              <span className="badge bg-yellow-100 text-yellow-800">DEMO MODE</span>
            )}
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user?.fullName} <span className="text-gray-400">({user?.role})</span>
            </span>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>

        <nav className="sm:hidden border-t border-gray-100 bg-white px-2 py-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1 rounded-md text-xs whitespace-nowrap ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
