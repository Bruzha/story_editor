'use client';
import { useState } from 'react';
import Button from './components/ui/button/Button';
import Title from './components/ui/title/Title';
import './style.scss';
import dataFeatures from './dataForInstractions';
import { useAuth } from './AuthContext';
import { useDispatch } from 'react-redux';
import { destroyCookie } from 'nookies';
import { clearProfile, resetCardsState } from './store/actions';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const dispatch = useDispatch();

  const features = dataFeatures;

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleLogout = () => {
    dispatch(resetCardsState());
    dispatch(clearProfile());
    destroyCookie(null, 'jwt', { path: '/' });
    logout();
    router.push('/');
  };
  const handleLogin = () => {
    router.push('/auth/autorisation');
  };
  const handleRegister = () => {
    router.push('/auth/registration');
  };

  return (
    <div className="home">
      <header className="home__header">
        <Title text={'РЕДАКТОР ИСТОРИЙ'}></Title>
        <div className="home__subtitle">
          <h3>
            Информационно-поисковая система для создания уникальных сюжетов и персонажей, которая позволяет легко и с
            комфортом планировать, разрабатывать и организовывать произведения писателей, сценаристов, комиксистов и
            прочих творческих личностей.
          </h3>
          <div className="home__line"></div>
          <h3>
            Установка не требуется.
            <br />
            Работайте откуда угодно — даже с телефона.
          </h3>
          <div className="home__line"></div>
          <h3>Создавайте свои вселенные</h3>
          <h3>Формируйте ярких персонажей</h3>
          <h3>Пишите уникальные истории</h3>
        </div>
        <div className="home__buttons">
          {isAuthenticated ? (
            <Button name={'Выйти'} onClick={handleLogout} />
          ) : (
            <>
              <Button name={'Войти'} onClick={handleLogin} />
              <Button name={'Зарегистрироваться'} onClick={handleRegister} />
            </>
          )}
        </div>
      </header>

      <section className="home__features">
        <Title text={'ВОЗМОЖНОСТИ'} />
        <div className="home__underline" />
        <ul className="home__features-list">
          {features.map((feature) => (
            <li
              key={feature.id}
              className={`home__feature-item ${expandedItems.includes(feature.id) ? 'expanded' : ''}`}
              onClick={() => toggleItem(feature.id)}
            >
              {feature.title}
              <span className="home__feature-toggle">
                {expandedItems.includes(feature.id) ? (
                  <img src="/icons/arrow-up.svg" title="Свернуть" alt="Свернуть" width={20} height={20} />
                ) : (
                  <img src="/icons/arrow-down.svg" title="Развернуть" alt="Развернуть" width={20} height={20} />
                )}
              </span>
              {expandedItems.includes(feature.id) && (
                <div className="home__feature-content">
                  {feature.content.map((step, index) => (
                    <div key={index} className="home__feature-step">
                      <p>{step.text}</p>
                      <img src={step.image} alt={`Step ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="home__advantages">
        <Title text={'ПРЕИМУЩЕСТВА'}></Title>
        <div className="home__underline"></div>
        <ul className="home__advantages-list">
          <li className="home__advantage-card">
            <img src="/icons/book-interface.svg" alt="Удобный интерфейс" />
            <p>Удобный интерфейс для создания сложных историй</p>
          </li>
          <li className="home__advantage-card">
            <img src="/icons/image.svg" alt="Миниатюры и цвета" />
            <p>Возможность добавления миниатюр и маркерных цветов</p>
          </li>
          <li className="home__advantage-card">
            <img src="/icons/search2.svg" alt="Быстрый поиск" />
            <p>Быстрый поиск и навигация по элементам</p>
          </li>
          <li className="home__advantage-card">
            <img src="/icons/export2.svg" alt="Гибкий экспорт" />
            <p>Гибкие возможности экспорта</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
