import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Tag,
  Package,
  FileText,
  Receipt,
  Building2,
  Users,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui';

const navLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Tag, label: 'Event Types', path: '/event-types' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: FileText, label: 'Quotations', path: '/quotations' },
  { icon: Receipt, label: 'Invoices', path: '/invoices' },
  { icon: Building2, label: 'Organization', path: '/organization' },
  { icon: Users, label: 'Team', path: '/users', adminOnly: true },
  { icon: ClipboardList, label: 'Audit Log', path: '/audit-log', adminOnly: true },
];

const Sidebar = () => {
  const { user, currentOrg, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const links = navLinks.filter(
    (l) => !l.adminOnly || isAdmin
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = user.displayName || user.email || 'User';
  const userInitials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const orgInitials = (currentOrg?.name || 'EF')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden md:flex md:flex-col w-60 lg:w-64 h-screen bg-app-bg-secondary border-r border-app-border flex-shrink-0">
      <div className="p-5 border-b border-app-border">
        <div className="flex items-center gap-3">
          {currentOrg?.logoBase64 ? (
            <img
              src={currentOrg.logoBase64}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-app-accent-light text-app-accent-dark flex items-center justify-center font-display font-semibold">
              {orgInitials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-app-text-primary truncate">
              {currentOrg?.name || 'EventFlow'}
            </p>
            <p className="text-xs text-app-text-muted truncate">EventFlow</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-app-accent-light text-app-accent-dark'
                    : 'text-app-text-secondary hover:bg-app-bg-tertiary hover:text-app-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1 bottom-1 w-1 bg-app-accent rounded-r"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon size={18} />
                  <span className="hidden lg:inline">{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-app-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-app-bg-tertiary">
          <div className="w-9 h-9 rounded-full bg-app-accent-light text-app-accent-dark flex items-center justify-center font-semibold text-sm">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0 hidden lg:block">
            <p className="text-sm font-medium text-app-text-primary truncate">
              {displayName}
            </p>
            <Badge status={user.role || 'STAFF'} className="text-[10px] mt-0.5" />
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-app-bg-secondary text-app-text-muted hover:text-app-danger transition"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
