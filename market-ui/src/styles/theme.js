// ─── Ortak Tasarım Sistemi (Design Tokens) ─────────────────
// Tüm sayfalar bu dosyadan renk, gölge ve bileşen stillerini alır

export const theme = {
  colors: {
    bg: '#e8eaed',           // Dış arka plan
    surface: '#f3f4f6',      // Kart/panel zemini
    surfaceHigh: '#ffffff',  // Yükseltilmiş kart (beyaz)
    border: '#d1d5db',       // Kenarlık
    text: '#111827',         // Ana metin
    textMuted: '#6b7280',    // İkincil metin
    textLight: '#9ca3af',    // Soluk metin
    primary: '#111827',      // Birincil buton (siyah)
    success: '#16a34a',      // Yeşil
    successBg: '#dcfce7',    // Açık yeşil bg
    danger: '#dc2626',       // Kırmızı
    dangerBg: '#fee2e2',     // Açık kırmızı bg
    warning: '#d97706',      // Turuncu
    warningBg: '#fef3c7',    // Açık turuncu bg
    info: '#2563eb',         // Mavi
    infoBg: '#dbeafe',       // Açık mavi bg
  },
  shadow: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
    cardHover: '0 8px 30px rgba(0,0,0,0.08)',
    modal: '0 20px 60px rgba(0,0,0,0.12)',
    btn: '0 2px 8px rgba(0,0,0,0.1)',
    neumorphic: '6px 6px 12px #c8cacd, -6px -6px 12px #ffffff',
  },
  radius: {
    sm: '10px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    pill: '100px',
  },
};

// ─── Ortak Bileşen Stilleri ─────────────────────────────────

export const S = {
  // Sayfa kapsayıcısı
  page: {
    padding: '8px 4px',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
  },

  // Sayfa başlığı alanı
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  pageTitle: {
    color: theme.colors.text,
    fontSize: '26px',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    color: theme.colors.textMuted,
    fontSize: '14px',
    margin: '4px 0 0 0',
    fontWeight: '500',
  },

  // Birincil buton (siyah, yuvarlak)
  btnPrimary: {
    padding: '12px 24px',
    background: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.radius.pill,
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: theme.shadow.btn,
    transition: 'all 0.2s',
    letterSpacing: '0.2px',
  },
  btnSuccess: {
    padding: '12px 24px',
    background: theme.colors.success,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.radius.pill,
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
  },
  btnDanger: {
    padding: '12px 24px',
    background: theme.colors.danger,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.radius.pill,
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
  },
  btnGhost: {
    padding: '10px 20px',
    background: theme.colors.surface,
    color: theme.colors.textMuted,
    border: '1px solid ' + theme.colors.border,
    borderRadius: theme.radius.pill,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },

  // İkon buton (tablo içi)
  iconBtn: {
    width: '36px',
    height: '36px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.15s',
  },

  // Kart
  card: {
    background: theme.colors.surfaceHigh,
    borderRadius: theme.radius.lg,
    padding: '28px',
    boxShadow: theme.shadow.card,
  },

  // Tablo sarmalayıcı
  tableWrapper: {
    background: theme.colors.surfaceHigh,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    boxShadow: theme.shadow.card,
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '14px 20px',
    color: theme.colors.textLight,
    fontSize: '12px',
    textAlign: 'left',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    borderBottom: '1px solid ' + theme.colors.surface,
    background: '#fafafa',
  },
  td: {
    padding: '16px 20px',
    color: theme.colors.text,
    fontSize: '14px',
    fontWeight: '500',
    borderBottom: '1px solid ' + theme.colors.surface,
  },

  // Input & Select
  input: {
    width: '100%',
    padding: '13px 18px',
    background: theme.colors.surface,
    border: '1.5px solid ' + theme.colors.border,
    borderRadius: theme.radius.md,
    color: theme.colors.text,
    fontSize: '14px',
    fontWeight: '500',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  searchInput: {
    padding: '13px 20px',
    background: theme.colors.surfaceHigh,
    border: 'none',
    borderRadius: theme.radius.pill,
    color: theme.colors.text,
    fontSize: '14px',
    boxShadow: theme.shadow.card,
    outline: 'none',
    minWidth: '280px',
  },

  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(17,24,39,0.4)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    background: theme.colors.surfaceHigh,
    borderRadius: theme.radius.xl,
    padding: '40px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: theme.shadow.modal,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: '22px',
    fontWeight: '800',
    marginBottom: '28px',
    letterSpacing: '-0.3px',
  },

  // Form alanı
  field: { marginBottom: '20px' },
  label: {
    display: 'block',
    color: theme.colors.textMuted,
    fontSize: '13px',
    marginBottom: '8px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // Bildirim (alert)
  alertError: {
    background: theme.colors.dangerBg,
    color: theme.colors.danger,
    padding: '14px 18px',
    borderRadius: theme.radius.md,
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
    borderLeft: '4px solid ' + theme.colors.danger,
  },
  alertSuccess: {
    background: theme.colors.successBg,
    color: theme.colors.success,
    padding: '14px 18px',
    borderRadius: theme.radius.md,
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
    borderLeft: '4px solid ' + theme.colors.success,
  },

  // Modal alt butonları
  modalBtns: { display: 'flex', gap: '12px', marginTop: '32px' },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    background: theme.colors.surface,
    color: theme.colors.textMuted,
    border: '1px solid ' + theme.colors.border,
    borderRadius: theme.radius.pill,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  saveBtn: {
    flex: 1,
    padding: '14px',
    background: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.radius.pill,
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
  },

  // Badge (etiket)
  badge: (color, bg) => ({
    display: 'inline-block',
    padding: '4px 12px',
    background: bg,
    color: color,
    borderRadius: theme.radius.pill,
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.3px',
  }),
};
