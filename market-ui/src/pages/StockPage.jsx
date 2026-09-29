import { useState, useEffect } from 'react';
import { stockService, productService } from '../services/api';
import Layout from '../components/Layout';

export default function StockPage() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('in');
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    setLoading(true);
    const res = await stockService.getMovements();
    setMovements(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovements();
    productService.getAll().then(res => setProducts(res.data));
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📈 Stok Hareketleri</h1>
          <div style={styles.btnGroup}>
            <button style={styles.inBtn} onClick={() => openModal('in')}>📥 Stok Girişi</button>
            <button style={styles.outBtn} onClick={() => openModal('out')}>📤 Stok Çıkışı</button>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Yükleniyor...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ürün</th>
                  <th style={styles.th}>Tür</th>
                  <th style={styles.th}>Miktar</th>
                  <th style={styles.th}>Not</th>
                  <th style={styles.th}>Yapan</th>
                  <th style={styles.th}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {movements.map(m => (
                  <tr key={m.id}>
                    <td style={styles.td}>{m.productName}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.typeBadge,
                        background: m.type === 'in' ? '#dcfce7' : '#fee2e2',
                        color: m.type === 'in' ? '#16a34a' : '#dc2626',
                      }}>
                        {m.type === 'in' ? '📥 Giriş' : '📤 Çıkış'}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '700', color: m.type === 'in' ? '#16a34a' : '#dc2626' }}>
                      {m.type === 'in' ? '+' : '-'}{m.quantity}
                    </td>
                    <td style={{ ...styles.td, color: '#6b7280' }}>{m.note || '-'}</td>
                    <td style={styles.td}>{m.movedByName}</td>
                    <td style={{ ...styles.td, color: '#6b7280', fontSize: '12px' }}>
                      {new Date(m.movedAt).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <StockModal
            type={modalType}
            products={products}
            onClose={() => setShowModal(false)}
            onSave={() => { setShowModal(false); fetchMovements(); }}
          />
        )}
      </div>
    </Layout>
  );
}

function StockModal({ type, products, onClose, onSave }) {
  const [form, setForm] = useState({ productId: '', quantity: '', note: '' });
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = type === 'in'
        ? await stockService.stockIn(form)
        : await stockService.stockOut(form);
      setResult(res.data);
      setTimeout(() => { onSave(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>
          {type === 'in' ? '📥 Stok Girişi' : '📤 Stok Çıkışı'}
        </h2>

        {result ? (
          <div style={styles.success}>
            ✅ {result.message}<br />
            <span style={{ color: '#16a34a', opacity: 0.7 }}>Yeni stok: {result.newStock}</span>
          </div>
        ) : (
          <>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Ürün</label>
                <select
                  style={styles.input}
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: e.target.value })}
                  required
                >
                  <option value="">Seçin...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stok: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Miktar</label>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Not (opsiyonel)</label>
                <input
                  style={styles.input}
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="Satış, iade, fire..."
                />
              </div>
              <div style={styles.modalBtns}>
                <button type="button" onClick={onClose} style={styles.cancelBtn}>İptal</button>
                <button
                  type="submit"
                  style={{ ...styles.saveBtn, background: type === 'in' ? '#16a34a' : '#dc2626' }}
                >
                  {type === 'in' ? 'Giriş Yap' : 'Çıkış Yap'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '8px 4px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { color: '#111827', fontSize: '26px', fontWeight: '800', margin: 0 },
  btnGroup: { display: 'flex', gap: '12px' },
  inBtn: {
    background: '#16a34a', color: 'white', border: 'none', borderRadius: '100px',
    padding: '12px 24px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
  },
  outBtn: {
    background: '#dc2626', color: 'white', border: 'none', borderRadius: '100px',
    padding: '12px 24px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
  },
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
  typeBadge: { padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.4)',
    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 200,
  },
  modal: {
    background: 'white', borderRadius: '32px', padding: '40px',
    width: '100%', maxWidth: '460px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
  modalTitle: { color: '#111827', fontSize: '22px', fontWeight: '800', marginBottom: '28px' },
  success: {
    background: '#dcfce7', color: '#16a34a', padding: '24px', borderRadius: '20px',
    textAlign: 'center', lineHeight: '1.8', fontWeight: '600', fontSize: '16px',
  },
  error: {
    background: '#fee2e2', color: '#dc2626', padding: '14px 18px', borderRadius: '14px',
    marginBottom: '20px', borderLeft: '4px solid #dc2626',
  },
  field: { marginBottom: '20px' },
  label: {
    display: 'block', color: '#6b7280', fontSize: '13px', marginBottom: '8px',
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  input: {
    width: '100%', padding: '13px 18px', background: '#f3f4f6',
    border: '1.5px solid #d1d5db', borderRadius: '14px', color: '#111827',
    boxSizing: 'border-box', outline: 'none', fontSize: '14px',
  },
  modalBtns: { display: 'flex', gap: '12px', marginTop: '24px' },
  cancelBtn: {
    flex: 1, padding: '14px', background: '#f3f4f6', color: '#6b7280',
    border: '1px solid #d1d5db', borderRadius: '100px', cursor: 'pointer', fontWeight: '600',
  },
  saveBtn: {
    flex: 1, padding: '14px', color: 'white', border: 'none',
    borderRadius: '100px', cursor: 'pointer', fontWeight: '700',
  },
};