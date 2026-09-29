import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { theme, S } from '../styles/theme';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login(form);
      const { token, name, email, role, storeId, storeName } = res.data;

      // Context'e kaydet (storeId ve storeName de dahil)
      login({ name, email, role, storeId, storeName }, token);

      // Dashboard'a yönlendir
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? theme.colors.primary : theme.colors.border,
    boxShadow: focusedField === field ? `0 0 0 3px rgba(17,24,39,0.06)` : 'none',
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <span style={styles.logoEmoji}>🛒</span>
          <span style={styles.logoText}>Market.io</span>
        </div>

        {/* Subtitle */}
        <p style={styles.subtitle}>Hesabınıza giriş yapın</p>

        {/* Error Alert */}
        {error && (
          <div style={S.alertError}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input
              style={inputStyle('email')}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="hasan@market.com"
              required
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Şifre</label>
            <input
              style={inputStyle('password')}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.65 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loadingRow}>
                <span style={styles.spinner} /> Giriş yapılıyor...
              </span>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: theme.colors.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    background: theme.colors.surfaceHigh,
    borderRadius: theme.radius.xl,          // 32px
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  logoEmoji: {
    fontSize: '36px',
    lineHeight: 1,
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: '500',
    margin: '0 0 32px 0',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: theme.colors.surfaceHigh,
    border: `1.5px solid ${theme.colors.border}`,
    borderRadius: '14px',
    color: theme.colors.text,
    fontSize: '14px',
    fontWeight: '500',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    background: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.radius.pill,        // 100px
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    letterSpacing: '0.2px',
    transition: 'opacity 0.2s',
    boxShadow: theme.shadow.btn,
  },
  loadingRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.35)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};