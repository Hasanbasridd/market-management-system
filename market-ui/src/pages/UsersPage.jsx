import { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    const res = await API.get('/users');
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, newRole) => {
    await API.put(`/users/${id}/role`, { role: newRole });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Silinemedi');
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>👥 Kullanıcı Yönetimi</h1>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Yükleniyor...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ad</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Rol</th>
                  <th style={styles.th}>Kayıt Tarihi</th>
                  <th style={styles.th}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={styles.td}>
                      {u.name}
                      {u.email === currentUser?.email && (
                        <span style={styles.meBadge}>sen</span>
                      )}
                    </td>
                    <td style={{ ...styles.td, color: '#6b7280' }}>{u.email}</td>
                    <td style={styles.td}>
                      <select
                        style={u.role === 'admin' ? styles.roleSelectAdmin : styles.roleSelectStaff}
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        disabled={u.email === currentUser?.email}
                      >
                        <option value="admin">👑 admin</option>
                        <option value="staff">👤 staff</option>
                      </select>
                    </td>
                    <td style={{ ...styles.td, color: '#6b7280', fontSize: '12px' }}>
                      {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={styles.td}>
                      {u.email !== currentUser?.email && (
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(u.id)}
                        >
                          🗑️ Sil
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: '8px 4px' },
  title: { color: '#111827', fontSize: '26px', fontWeight: '800', marginBottom: '28px', letterSpacing: '-0.5px' },
  tableWrapper: {
    background: 'white', borderRadius: '24px', overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '14px 20px', color: '#9ca3af', fontSize: '12px', textAlign: 'left',
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px',
    borderBottom: '1px solid #f3f4f6', background: '#fafafa',
  },
  td: { padding: '16px 20px', color: '#111827', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid #f3f4f6' },
  meBadge: {
    marginLeft: '8px', background: '#dbeafe', color: '#2563eb',
    padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
  },
  roleSelectAdmin: {
    background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '100px',
    padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    color: '#7c3aed', outline: 'none',
  },
  roleSelectStaff: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '100px',
    padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    color: '#16a34a', outline: 'none',
  },
  deleteBtn: {
    background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '100px',
    padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
  },
};
