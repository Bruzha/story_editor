'use client';

import { useAuth } from '@/app/AuthContext'; // Импортируем useAuth
import MyLink from '../../ui/link/Link'; // Предполагается, что у вас есть кастомный компонент Link
import { useRouter } from 'next/navigation'; // Импортируем useRouter
import { destroyCookie } from 'nookies'; // Если вы используете nookies для хранения токена
import { AiFillInstagram } from 'react-icons/ai';
import { FaPinterest, FaVk } from 'react-icons/fa';
import './style.scss';

export default function Footer() {
  const { isAuthenticated, logout } = useAuth(); // Получаем состояние аутентификации и функцию logout
  const router = useRouter(); // Получаем роутер

  const handleLogout = () => {
    //  Добавьте здесь логику выхода (например, удаление куки, сброс состояния Redux)
    destroyCookie(null, 'jwt', { path: '/' }); // Удаляем куки (пример с использованием nookies)
    // dispatch(resetUserState()); // Сбрасываем состояние пользователя в Redux (если нужно)
    logout(); // Вызываем функцию logout из AuthContext
    router.push('/'); // Перенаправляем на главную страницу
  };

  return (
    <footer className="footer">
      <div className="footer__name">
        <img src="" alt="Логотип" /> {/* Замените "" на путь к вашему логотипу */}
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
          // Если пользователь аутентифицирован, показываем ссылки для выхода
          <>
            <MyLink href="/" name="Главная" className="white-link footer__link">
              {''}
            </MyLink>
            <MyLink href="/profile" name="Профиль" className="white-link footer__link">
              {''}
            </MyLink>
            <MyLink
              href="#" // Используем href="#" или javascript:void(0) для ссылки "Выйти"
              name="Выйти"
              className="white-link footer__link"
              onClick={handleLogout} // Добавляем обработчик выхода
            >
              {''}
            </MyLink>
          </>
        ) : (
          // Если пользователь не аутентифицирован, показываем ссылки для входа и регистрации
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
