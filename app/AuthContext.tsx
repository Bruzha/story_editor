//AuthContext.ts:
'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { parseCookies, destroyCookie, setCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import store from './store';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = (token: string) => {
    setCookie(null, 'jwt', token, {
      maxAge: 30 * 24 * 60 * 60, // 30 дней
      path: '/',
    });
    setIsAuthenticated(true);
    console.log('AuthContext: login() - isAuthenticated set to true');
    router.push('/'); // Перенаправляем на главную страницу после логина
  };

  const logout = () => {
    destroyCookie(null, 'jwt');
    setIsAuthenticated(false);
    console.log('AuthContext: logout() - isAuthenticated set to false');
    router.push('/auth/autorisation');
  };

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies['jwt'];
    if (token) {
      setIsAuthenticated(true);
      console.log('AuthContext: useEffect - isAuthenticated set to true on load');
    }
  }, []);

  const contextValue: AuthContextProps = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <Provider store={store}>
      <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    </Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
