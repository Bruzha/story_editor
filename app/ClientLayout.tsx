'use client';

import React, { ReactNode, useEffect } from 'react';
import Header from './components/sections/header/Header';
import Footer from './components/sections/footer/Footer';
import { useAuth } from './AuthContext';
import { parseCookies } from 'nookies';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { login, logout } = useAuth();
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies['my-token']) {
      login();
    } else {
      logout();
    }
  }, [login, logout]);

  // Рендер Autorisation только на странице /auth/autorisation
  const renderAutorisation = () => {
    // if (pathname === '/auth/autorisation') {
    //   return <Autorisation />;
    // }
    return null;
  };

  // Рендер Registration только на странице /auth/registration
  const renderRegistration = () => {
    // if (pathname === '/auth/registration') {
    //   return <Registration />;
    // }
    return null;
  };

  return (
    <>
      <Header />
      {renderAutorisation()}
      {renderRegistration()}
      {children}
      <Footer />
    </>
  );
}
