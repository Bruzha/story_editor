import React from 'react';
import type { Metadata } from 'next';
import { Merriweather, Open_Sans } from 'next/font/google';
import ClientLayout from './ClientLayout';
import { AuthProvider } from './AuthContext';
import './globals.scss';

const merriweather = Merriweather({
  subsets: ['cyrillic'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
});

const openSans = Open_Sans({
  subsets: ['cyrillic'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
});

const primaryColor = '#4682B4'; //синий
const secondaryColor = '#A0522D'; //коричневый
const backgroundColor = '#FAF9F6'; //светлый кремовый
const textColor = '#333333'; //темно-серый
const secondaryTextColor = '#FFFFFF'; //белый

export const metadata: Metadata = {
  title: 'Редактор историй',
  description: 'Информационно-поисковая система для создания уникальных сюжетов и персонажей',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body
        style={
          {
            '--primary-color': primaryColor,
            '--secondary-color': secondaryColor,
            '--background-color': backgroundColor,
            '--text-color': textColor,
            '--secondary-text-color': secondaryTextColor,
          } as React.CSSProperties
        }
        className={`${merriweather.variable} ${openSans.variable}`}
      >
        <AuthProvider>
          {' '}
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
