import { createContext, useContext, useState } from 'react';

// Context: tüm component'lerin erişebileceği global kutu
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // localStorage'dan mevcut kullanıcıyı al (sayfa yenilenince kaybolmasın)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth: herhangi bir component'ten auth bilgisine erişmek için
export function useAuth() {
  return useContext(AuthContext);
}