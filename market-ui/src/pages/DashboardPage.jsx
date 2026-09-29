import { useState, useEffect } from 'react';
import { productService, stockService, categoryService } from '../services/api';
import Layout from '../components/Layout';

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, lowStock: 0, totalStock: 0 });
  const [recentMovements, setRecentMovements] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, catRes, moveRes] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          stockService.getMovements(),
        ]);
        const products = prodRes.data;
        const movements = moveRes.data;

        setStats({
          products: products.length,
          categories: catRes.data.length,
          lowStock: products.filter(p => p.stock <= 10).length,
          totalStock: products.reduce((a, p) => a + p.stock, 0),
        });

        setRecentMovements(movements.slice(0, 5));
        setTopProducts(
          [...products].sort((a, b) => b.stock - a.stock).slice(0, 5)
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div style={S.loadingWrap}>
          <div style={S.loadingDot} />
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>Yükleniyor...</span>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { icon: '🛍️', value: stats.products, label: 'Toplam Ürün', color: '#111827', bg: '#ffffff' },
    { icon: '📦', value: stats.categories, label: 'Kategori', color: '#2563eb', bg: '#dbeafe' },
    { icon: '📉', value: stats.lowStock, label: 'Kritik Stok', color: '#dc2626', bg: '#fee2e2', dark: true },
    { icon: '📊', value: stats.totalStock, label: 'Toplam Stok', color: '#16a34a', bg: '#dcfce7' },
  ];

  return (
    <Layout>
      <div style={S.page}>

        {/* ── Başlık ──────────────────────────────────────── */}
        <div style={S.topRow}>
          <div>
            <h1 style={S.pageTitle}>Kontrol Paneli</h1>
            <p style={S.pageSubtitle}>Marketinizin anlık özeti</p>
          </div>
          <div style={S.dateChip}>
            📅 {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* ── İstatistik Kartları ─────────────────────────── */}
        <div style={S.statGrid}>
          {statCards.map((c, i) => (
            <div key={i} style={{ ...S.statCard, background: c.dark ? c.color : '#ffffff' }}>
              <div style={{ ...S.statIconBox, background: c.bg }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
              </div>
              <div style={{ ...S.statValue, color: c.dark ? '#ffffff' : '#111827' }}>
                {c.value}
              </div>
              <div style={{ ...S.statLabel, color: c.dark ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Orta Bölüm ─────────────────────────────────── */}
        <div style={S.midGrid}>

          {/* Son Stok Hareketleri */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <h2 style={S.cardTitle}>Son Stok Hareketleri</h2>
              <a href="/stock" style={S.seeAll}>Tümünü Gör →</a>
            </div>
            <div>
              {recentMovements.length === 0 && (
                <p style={{ color: '#9ca3af', fontSize: 14 }}>Henüz hareket yok.</p>
              )}
              {recentMovements.map((m, i) => {
                const isIn = m.type === 'Giriş' || m.quantity > 0;
                return (
                  <div key={i} style={{ ...S.listRow, borderBottom: i < recentMovements.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div style={{ ...S.listDot, background: isIn ? '#dcfce7' : '#fee2e2' }}>
                      <span style={{ fontSize: 16 }}>{isIn ? '📥' : '📤'}</span>
                    </div>
                    <div style={S.listInfo}>
                      <div style={S.listName}>{m.productName || m.product?.name || 'Ürün'}</div>
                      <div style={S.listDate}>
                        {new Date(m.movedAt).toLocaleDateString('tr-TR')} · {m.movedByName || 'Sistem'}
                      </div>
                    </div>
                    <div style={{
                      ...S.listBadge,
                      background: isIn ? '#dcfce7' : '#fee2e2',
                      color: isIn ? '#16a34a' : '#dc2626',
                    }}>
                      {isIn ? '+' : ''}{m.quantity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* En Yüksek Stoklu Ürünler */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <h2 style={S.cardTitle}>En Yüksek Stoklu</h2>
              <a href="/products" style={S.seeAll}>Tümünü Gör →</a>
            </div>
            <div>
              {topProducts.map((p, i) => (
                <div key={i} style={{ ...S.listRow, borderBottom: i < topProducts.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={S.rankBadge}>{i + 1}</div>
                  <div style={S.listInfo}>
                    <div style={S.listName}>{p.name}</div>
                    <div style={S.listDate}>{p.categoryName || '—'} · ₺{p.price}</div>
                  </div>
                  <div style={{
                    ...S.listBadge,
                    background: p.stock <= 10 ? '#fee2e2' : '#dcfce7',
                    color: p.stock <= 10 ? '#dc2626' : '#16a34a',
                  }}>
                    {p.stock} adet
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Alt Bant ────────────────────────────────────── */}
        <div style={S.bottomBanner}>
          <div style={S.bannerLeft}>
            <span style={{ fontSize: 32 }}>🚀</span>
            <div>
              <div style={S.bannerTitle}>Hızlı Eylemler</div>
              <div style={S.bannerSub}>En sık kullandığınız işlemler</div>
            </div>
          </div>
          <div style={S.bannerBtns}>
            <a href="/products" style={S.quickBtn}>+ Ürün Ekle</a>
            <a href="/stock" style={{ ...S.quickBtn, background: '#f3f4f6', color: '#374151' }}>📥 Stok Girişi</a>
            <a href="/categories" style={{ ...S.quickBtn, background: '#f3f4f6', color: '#374151' }}>📦 Kategori</a>
          </div>
        </div>

      </div>
    </Layout>
  );
}

/* ── Stiller ─────────────────────────────────────────────── */
const S = {
  page: { padding: '4px' },
  loadingWrap: { display: 'flex', alignItems: 'center', gap: 12, padding: 40, color: '#9ca3af' },
  loadingDot: { width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' },

  topRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 28,
  },
  pageTitle: { margin: 0, fontSize: 26, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' },
  pageSubtitle: { margin: '4px 0 0', fontSize: 14, color: '#6b7280', fontWeight: 500 },
  dateChip: {
    background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 100,
    padding: '8px 18px', fontSize: 13, color: '#6b7280', fontWeight: 600,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },

  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 24, padding: '28px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  statIconBox: {
    width: 48, height: 48, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: { fontSize: 32, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1 },
  statLabel: { fontSize: 13, fontWeight: 600 },

  midGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 },

  card: {
    background: '#ffffff', borderRadius: 24, padding: 28,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
  },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { margin: 0, fontSize: 17, fontWeight: 800, color: '#111827' },
  seeAll: { fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 600 },

  listRow: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
  },
  listDot: {
    width: 40, height: 40, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  rankBadge: {
    width: 40, height: 40, borderRadius: '50%',
    background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 14, color: '#6b7280', flexShrink: 0,
  },
  listInfo: { flex: 1, minWidth: 0 },
  listName: { fontSize: 14, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  listDate: { fontSize: 12, color: '#9ca3af', fontWeight: 500, marginTop: 2 },
  listBadge: {
    padding: '5px 12px', borderRadius: 100,
    fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
  },

  bottomBanner: {
    background: '#111827', borderRadius: 24, padding: '24px 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 4px 20px rgba(17,24,39,0.2)',
  },
  bannerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  bannerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 800 },
  bannerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, marginTop: 2 },
  bannerBtns: { display: 'flex', gap: 12 },
  quickBtn: {
    display: 'inline-block', textDecoration: 'none',
    background: '#ffffff', color: '#111827',
    padding: '12px 22px', borderRadius: 100,
    fontSize: 14, fontWeight: 700,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
};