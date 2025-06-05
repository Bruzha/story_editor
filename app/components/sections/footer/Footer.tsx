'use client';

import { useAuth } from '@/app/AuthContext';
import MyLink from '../../ui/link/Link';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';
import { AiFillInstagram } from 'react-icons/ai';
import { FaPinterest, FaVk } from 'react-icons/fa';
import './style.scss';

export default function Footer() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    destroyCookie(null, 'jwt', { path: '/' });
    logout();
    router.push('/');
  };

  return (
    <footer className="footer">
      <div className="footer__name">
        <img src="" alt="Логотип" />
        <p>РЕДАКТОР ИСТОРИЙ</p>
      </div>
      <div className="footer__info">
        <p className="footer__description">
          &quot;РЕДАКТОР ИСТОРИЙ&quot; — это удобная информационно-поисковая система для создания уникальных сюжетов и
          персонажей.
        </p>
      </div>
      <div className="footer__links">
        {isAuthenticated ? (
          <>
            <MyLink href="/" name="Главная" className="white-link footer__link">
              {''}
            </MyLink>
            <MyLink href="/profile" name="Профиль" className="white-link footer__link">
              {''}
            </MyLink>
            <MyLink href="#" name="Выйти" className="white-link footer__link" onClick={handleLogout}>
              {''}
            </MyLink>
          </>
        ) : (
          <>
            <MyLink href="/" name="Главная" className="white-link footer__link">
              {''}
            </MyLink>
            <MyLink href="/auth/autorisation" name="Войти" className="white-link footer__link">
              {''}
            </MyLink>
            <MyLink href="/auth/registration" name="Зарегистрироваться" className="white-link footer__link">
              {''}
            </MyLink>
          </>
        )}
      </div>
      <div className="footer__social">
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="footer__social-link">
          <FaVk size={30} color="var(--secondary-text-color)" />{' '}
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="footer__social-link">
          <FaPinterest size={30} color="var(--secondary-text-color)" />
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="footer__social-link">
          <AiFillInstagram size={30} color="var(--secondary-text-color)" />{' '}
        </a>
      </div>
    </footer>
  );
}
