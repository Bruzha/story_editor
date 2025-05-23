'use client';

import MyLink from '../../ui/link/Link';
import './style.scss';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../AuthContext';
import { destroyCookie } from 'nookies';
import { useDispatch } from 'react-redux';
import { resetCardsState } from '../../../store/actions';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    destroyCookie(null, 'jwt', { path: '/' });
    dispatch(resetCardsState());
    logout();
    router.push('/');
  };

  return (
    <header className="header">
      <div className="header__name">
        <img src="" alt="Логотип" />
        <h1>РЕДАКТОР ИСТОРИЙ</h1>
      </div>
      <div className="header__links">
        {isAuthenticated ? (
          <>
            <MyLink href="/" name="Главная" className="white-link header__exit-link">
              {''}
            </MyLink>
            <MyLink href="/profile" name="Профиль" className="white-link header__exit-link">
              {''}
            </MyLink>
            <MyLink href="/" name="Выйти" className="white-link header__exit-link" onClick={handleLogout}>
              {''}
            </MyLink>
          </>
        ) : (
          <>
            <MyLink href="/" name="Главная" className="white-link header__exit-link">
              {''}
            </MyLink>
            <MyLink href="/auth/autorisation" name="Войти" className="white-link">
              {''}
            </MyLink>
            <MyLink href="/auth/registration" name="Зарегистрироваться" className="white-link">
              {''}
            </MyLink>
          </>
        )}
      </div>
    </header>
  );
}
