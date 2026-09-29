import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import Layout from '../components/Layout';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    const res = await categoryService.getAll();
    setCategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Silinemedi');
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📦 Kategoriler</h1>
          <button style={styles.addBtn} onClick={() => { setEditCategory(null); setShowModal(true); }}>
            + Yeni Kategori
          </button>
        </div>

        <div style={styles.grid}>
          {categories.map(c => (
            <div key={c.id} style={styles.card}>
              <span style={styles.icon}>{c.icon}</span>
              <div style={styles.name}>{c.name}</div>
              <span style={styles.count}>{c.productCount} ürün</span>
              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => { setEditCategory(c); setShowModal(true); }}>✏️ Düzenle</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(c.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <CategoryModal
            category={editCategory}
            onClose={() => setShowModal(false)}
            onSave={() => { setShowModal(false); fetchCategories(); }}
          />
        )}
      </div>
    </Layout>
  );
}

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState({
    name: category?.name || '',
    icon: category?.icon || '📦',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (category) {
        await categoryService.update(category.id, form);
      } else {
        await categoryService.create(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>{category ? '✏️ Kategori Düzenle' : '➕ Yeni Kategori'}</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Kategori Adı</label>
            <input
              style={styles.input}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>İkon (Emoji)</label>
            <input
              style={styles.input}
              value={form.icon}
              onChange={e => setForm({ ...form, icon: e.target.value })}
            />
          </div>
          <div style={styles.modalBtns}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>İptal</button>
            <button type="submit" style={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container:  { padding: '8px 4px' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title:      { color: '#111827', fontSize: '26px', fontWeight: '800', margin: 0 },
  addBtn:     { background: '#111827', color: 'white', border: 'none', borderRadius: '100px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  card:       { background: 'white', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', transition: 'transform 0.2s' },
  icon:       { fontSize: '52px', marginBottom: '16px', display: 'block' },
  name:       { color: '#111827', fontSize: '17px', fontWeight: '700', marginBottom: '6px' },
  count:      { color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginBottom: '20px', display: 'block' },
  actions:    { display: 'flex', gap: '8px', justifyContent: 'center' },
  editBtn:    { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  deleteBtn:  { background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', fontSize: '14px' },
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal:      { background: 'white', borderRadius: '32px', padding: '40px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' },
  modalTitle: { color: '#111827', fontSize: '22px', fontWeight: '800', marginBottom: '28px' },
  error:      { background: '#fee2e2', color: '#dc2626', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', borderLeft: '4px solid #dc2626', fontSize: '14px', fontWeight: '600' },
  field:      { marginBottom: '20px' },
  label:      { display: 'block', color: '#6b7280', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input:      { background: '#f3f4f6', border: '1.5px solid #d1d5db', borderRadius: '14px', padding: '13px 18px', color: '#111827', boxSizing: 'border-box', outline: 'none', width: '100%', fontSize: '14px' },
  modalBtns:  { display: 'flex', gap: '12px', marginTop: '32px' },
  cancelBtn:  { flex: 1, padding: '14px', background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '100px', cursor: 'pointer', fontWeight: '600' },
  saveBtn:    { flex: 1, padding: '14px', background: '#111827', color: 'white', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: '700' },
};