'use client';

import MyLink from '../../ui/link/Link';
import './style.scss';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../AuthContext';
import { destroyCookie } from 'nookies';
import { useDispatch } from 'react-redux';
import { resetCardsState } from '../../../store/actions';
import { useState, useCallback } from 'react';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    destroyCookie(null, 'jwt', { path: '/' });
    dispatch(resetCardsState());
    logout();
    router.push('/');
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="header">
      <div className="header__name">
        <img src="" alt="Логотип" />
        <h1>РЕДАКТОР ИСТОРИЙ</h1>
      </div>

      <button className="header__menu-icon" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`header__links ${isMenuOpen ? 'header__links--open' : ''}`}>
        {isAuthenticated ? (
          <>
            <MyLink href="/" name="Главная" className="white-link header__exit-link" onClick={closeMenu}>
              {''}
            </MyLink>
            <MyLink href="/profile" name="Профиль" className="white-link header__exit-link" onClick={closeMenu}>
              {''}
            </MyLink>
            <MyLink
              href="/"
              name="Выйти"
              className="white-link header__exit-link"
              onClick={(e) => {
                handleLogout(e);
                closeMenu();
              }}
            >
              {''}
            </MyLink>
          </>
        ) : (
          <>
            <MyLink href="/" name="Главная" className="white-link header__exit-link" onClick={closeMenu}>
              {''}
            </MyLink>
            <MyLink href="/auth/autorisation" name="Войти" className="white-link" onClick={closeMenu}>
              {''}
            </MyLink>
            <MyLink href="/auth/registration" name="Зарегистрироваться" className="white-link" onClick={closeMenu}>
              {''}
            </MyLink>
          </>
        )}
      </div>
    </header>
  );
}
