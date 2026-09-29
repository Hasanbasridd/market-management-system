import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

// ── NavItem: Hover state for inactive links ──────────────────
function NavItem({ to, icon, label, end }) {
  const [hovered, setHovered] = useState(false);
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => navLinkStyle({ isActive, hovered })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.navIcon}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

// ── Layout ───────────────────────────────────────────────────
export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/',           label: 'Dashboard',   icon: '📊', end: true },
    { to: '/products',   label: 'Ürünler',     icon: '🛍️' },
    { to: '/categories', label: 'Kategoriler', icon: '📦' },
    { to: '/stock',      label: 'Stok',        icon: '📈' },
    { to: '/cart',       label: 'Sepetim',     icon: '🛒' },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.appContainer}>

        {/* ── SIDEBAR ── */}
        <aside style={styles.sidebar}>

          {/* Logo */}
          <div style={styles.logoContainer}>
            <span style={styles.logoEmoji}>🛒</span>
            <span style={styles.logoText}>Market.io</span>
          </div>

          {/* Navigation */}
          <nav style={styles.nav}>
            {navItems.map(({ to, label, icon, end }) => (
              <NavItem key={to} to={to} icon={icon} label={label} end={end} />
            ))}

            {user?.role === 'admin' && (
              <NavItem to="/users" icon="👥" label="Kullanıcılar" />
            )}
          </nav>

          {/* User Section */}
          <div style={styles.userSection}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user?.name}</div>
              <div style={styles.userEmail}>{user?.email}</div>
              {user?.storeName && (
                <div style={styles.storeName}>🏪 {user.storeName}</div>
              )}
            </div>
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              title="Çıkış Yap"
            >
              ⏏
            </button>
          </div>

        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={styles.main}>
          {children}
        </main>

      </div>
    </div>
  );
}

// ── Nav link style function ──────────────────────────────────
const navLinkStyle = ({ isActive, hovered }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 20px',
  borderRadius: '100px',
  color: isActive ? '#ffffff' : theme.colors.textMuted,
  background: isActive
    ? theme.colors.primary              // black when active
    : hovered
    ? '#e5e7eb'                         // light gray on hover
    : 'transparent',
  textDecoration: 'none',
  marginBottom: '6px',
  fontWeight: '600',
  fontSize: '15px',
  transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
});

// ── Styles ───────────────────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: theme.colors.bg,          // #e8eaed
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
  },
  appContainer: {
    display: 'flex',
    width: '100%',
    minHeight: 'calc(100vh - 40px)',
    background: theme.colors.bg,
    borderRadius: '32px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  },
  sidebar: {
    width: '250px',
    flexShrink: 0,
    background: theme.colors.surface,     // #f3f4f6
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${theme.colors.border}`,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '48px',
    paddingLeft: '8px',
  },
  logoEmoji: {
    fontSize: '24px',
    lineHeight: 1,
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: '-0.3px',
  },
  nav: {
    flex: 1,
  },
  navIcon: {
    fontSize: '18px',
    marginRight: '12px',
    lineHeight: 1,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: theme.colors.surfaceHigh,  // white
    borderRadius: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    marginTop: 'auto',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: theme.colors.border,       // #d1d5db
    color: theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    overflow: 'hidden',
    minWidth: 0,
  },
  userName: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    color: theme.colors.textMuted,
    fontSize: '11px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  storeName: {
    color: theme.colors.info, // blue
    fontSize: '11px',
    fontWeight: '700',
    marginTop: '2px',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: theme.colors.textMuted,
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px 6px',
    borderRadius: '8px',
    flexShrink: 0,
    transition: 'color 0.2s',
    lineHeight: 1,
  },
  main: {
    flex: 1,
    padding: '36px',
    background: theme.colors.bg,           // #e8eaed
    overflowY: 'auto',
  },
};