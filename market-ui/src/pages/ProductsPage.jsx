import { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';
import Layout from '../components/Layout';
import { S } from '../styles/theme';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;
      const res = await productService.getAll(params);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getAll().then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const handleDelete = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    await productService.delete(id);
    fetchProducts();
  };

  const handleAddToCart = async (product) => {
    try {
      // Import cartService for this to work
      const { cartService } = await import('../services/api');
      await cartService.addToCart({ productId: product.id, quantity: 1 });
      alert(`${product.name} sepete eklendi!`);
    } catch (err) {
      alert(err.response?.data || 'Hata oluştu');
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛍️ Ürünler</h1>
          <button style={styles.addBtn} onClick={() => { setEditProduct(null); setShowModal(true); }}>
            + Yeni Ürün
          </button>
        </div>

        <div style={styles.filters}>
          <input
            style={styles.searchInput}
            placeholder="🔍 Ürün adı veya barkod ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={styles.select}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Yükleniyor...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Ürün Adı</th>
                  <th style={styles.th}>Barkod</th>
                  <th style={styles.th}>Kategori</th>
                  <th style={styles.th}>Fiyat</th>
                  <th style={styles.th}>Stok</th>
                  <th style={styles.th}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={styles.tableRow}>
                    <td style={styles.td}>{p.name}</td>
                    <td style={{ ...styles.td, color: '#64748b', fontSize: '12px' }}>{p.barcode}</td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge}>{p.categoryIcon} {p.categoryName}</span>
                    </td>
                    <td style={{ ...styles.td, color: '#34d399', fontWeight: '600' }}>
                      ₺{p.price.toFixed(2)}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.stockBadgeBase,
                        background: p.stock <= 10 ? '#fee2e2' : '#dcfce7',
                        color: p.stock <= 10 ? '#dc2626' : '#16a34a',
                      }}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.cartBtn} onClick={() => handleAddToCart(p)} title="Sepete Ekle">🛒</button>
                      <button style={styles.editBtn} onClick={() => { setEditProduct(p); setShowModal(true); }} title="Düzenle">✏️</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)} title="Sil">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <ProductModal
            product={editProduct}
            categories={categories}
            onClose={() => setShowModal(false)}
            onSave={() => { setShowModal(false); fetchProducts(); }}
          />
        )}
      </div>
    </Layout>
  );
}

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    barcode: product?.barcode || '',
    price: product?.price || '',
    stock: product?.stock || 0,
    categoryId: product?.categoryId || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (product) {
        await productService.update(product.id, form);
      } else {
        await productService.create(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>{product ? '✏️ Ürün Düzenle' : '➕ Yeni Ürün'}</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Ürün Adı', key: 'name', type: 'text' },
            { label: 'Barkod', key: 'barcode', type: 'text' },
            { label: 'Fiyat (₺)', key: 'price', type: 'number' },
            { label: 'Stok', key: 'stock', type: 'number' },
          ].map(field => (
            <div key={field.key} style={styles.field}>
              <label style={styles.label}>{field.label}</label>
              <input
                style={styles.input}
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                required
              />
            </div>
          ))}
          <div style={styles.field}>
            <label style={styles.label}>Kategori</label>
            <select
              style={styles.input}
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">Seçin...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
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
  container:      { padding: '8px 4px' },
  header:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title:          { color: '#111827', fontSize: '26px', fontWeight: '800', margin: 0 },
  addBtn:         { background: '#111827', color: 'white', border: 'none', borderRadius: '100px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' },
  filters:        { display: 'flex', gap: '16px', marginBottom: '24px' },
  searchInput:    { background: 'white', border: 'none', borderRadius: '100px', padding: '13px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', outline: 'none', minWidth: '300px', fontSize: '14px', color: '#111827' },
  select:         { background: 'white', border: '1px solid #d1d5db', borderRadius: '100px', padding: '13px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', outline: 'none', fontSize: '14px', color: '#111827', cursor: 'pointer' },
  tableWrapper:   { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' },
  table:          { width: '100%', borderCollapse: 'collapse' },
  tableHead:      {},
  th:             { padding: '14px 20px', color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid #f3f4f6', background: '#fafafa', textAlign: 'left' },
  tableRow:       {},
  td:             { padding: '16px 20px', color: '#111827', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid #f3f4f6' },
  categoryBadge:  { background: '#f3f4f6', color: '#4b5563', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' },
  stockBadgeBase: { padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' },
  cartBtn:        { background: '#111827', color: 'white', border: 'none', borderRadius: '10px', width: '34px', height: '34px', cursor: 'pointer', marginRight: '6px', fontSize: '14px' },
  editBtn:        { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', width: '34px', height: '34px', cursor: 'pointer', marginRight: '6px', fontSize: '14px' },
  deleteBtn:      { background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '10px', width: '34px', height: '34px', cursor: 'pointer', fontSize: '14px' },
  overlay:        { position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal:          { background: 'white', borderRadius: '32px', padding: '40px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' },
  modalTitle:     { color: '#111827', fontSize: '22px', fontWeight: '800', marginBottom: '28px' },
  error:          { background: '#fee2e2', color: '#dc2626', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', borderLeft: '4px solid #dc2626', fontSize: '14px', fontWeight: '600' },
  field:          { marginBottom: '20px' },
  label:          { display: 'block', color: '#6b7280', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input:          { background: '#f3f4f6', border: '1.5px solid #d1d5db', borderRadius: '14px', padding: '13px 18px', color: '#111827', boxSizing: 'border-box', outline: 'none', width: '100%', fontSize: '14px' },
  modalBtns:      { display: 'flex', gap: '12px', marginTop: '32px' },
  cancelBtn:      { flex: 1, padding: '14px', background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '100px', cursor: 'pointer', fontWeight: '600' },
  saveBtn:        { flex: 1, padding: '14px', background: '#111827', color: 'white', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: '700' },
};