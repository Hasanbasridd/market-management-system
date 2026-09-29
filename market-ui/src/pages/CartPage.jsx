import { useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await cartService.getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Sepet yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await cartService.checkout();
      setMessage(res.data.message);
      if (res.data.orderId) {
          setOrderId(res.data.orderId);
      }
      // Sepeti yenile (artık boş gelecek)
      await loadCart();
    } catch (err) {
      setMessage(err.response?.data || 'Ödeme sırasında hata oluştu.');
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5228/api';
    
    fetch(`${baseUrl}/Invoice/${orderId}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Fatura_${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    });
  };

  if (loading && !cart) return <div style={styles.container}>Yükleniyor...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <header style={styles.header}>
          <h1 style={styles.title}>🛒 Sepetim</h1>
          <button onClick={() => navigate('/')} style={styles.backBtn}>Ana Sayfaya Dön</button>
        </header>

        {message && (
          <div style={styles.alert}>
            {message}
            {orderId && (
              <button onClick={handleDownloadInvoice} style={{...styles.checkoutBtn, marginLeft: '20px', padding: '8px 16px', fontSize: '14px'}}>
                📄 Faturayı İndir (PDF)
              </button>
            )}
          </div>
        )}

        {!cart?.items?.length ? (
          <div style={styles.empty}>Sepetinizde ürün bulunmuyor.</div>
        ) : (
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ürün</th>
                  <th style={styles.th}>Birim Fiyat</th>
                  <th style={styles.th}>Adet</th>
                  <th style={styles.th}>Toplam</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map(item => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.product.name}</td>
                    <td style={styles.td}>{item.product.price} ₺</td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>{(item.product.price * item.quantity).toFixed(2)} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.footer}>
              <h3 style={styles.total}>
                Genel Toplam: {cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toFixed(2)} ₺
              </h3>
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={styles.checkoutBtn}
              >
                {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#e8eaed', fontFamily: 'Inter, sans-serif' },
  inner: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { color: '#111827', fontSize: '28px', fontWeight: '800', margin: 0 },
  backBtn: {
    background: 'white', color: '#374151', border: '1px solid #d1d5db',
    borderRadius: '100px', padding: '10px 20px', cursor: 'pointer',
    fontWeight: '600', fontSize: '14px',
  },
  alert: {
    background: '#dcfce7', color: '#16a34a', padding: '16px 20px', borderRadius: '16px',
    marginBottom: '24px', fontWeight: '600', borderLeft: '4px solid #16a34a',
  },
  empty: {
    textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px',
    color: '#9ca3af', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', fontSize: '16px', fontWeight: '500',
  },
  card: {
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
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px', background: '#fafafa', borderTop: '1px solid #f3f4f6',
  },
  total: { margin: 0, color: '#111827', fontSize: '20px', fontWeight: '800' },
  checkoutBtn: {
    background: '#111827', color: 'white', border: 'none', borderRadius: '100px',
    padding: '14px 32px', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
};
