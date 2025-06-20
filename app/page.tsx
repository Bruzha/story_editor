'use client';
import { useState } from 'react';
import Button from './components/ui/button/Button';
import Title from './components/ui/title/Title';
import './style.scss';
import dataFeatures from './dataForInstractions';

export default function Home() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

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
          <h3>Создайте свою вселенную</h3>
          <h3>Сформируйте ярких персонажей</h3>
          <h3>Пишите уникальные истории</h3>
        </div>
        <div className="home__buttons">
          <Button name={'Войти'} />
          <Button name={'Зарегистрироваться'} />
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
              <span className="home__feature-toggle">▼</span>
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

      {/* <section className="home__access">
        <Title text={'КАК ПОЛУЧИТЬ ДОСТУП?'}></Title>
        <div className="home__underline"></div>
        <p>Веб-приложение «РЕДАКТОР ИСТОРИЙ» не требует установки. Для работы необходимо:</p>
        <ul>
          <li>Любое устройство с доступом в интернет (компьютер, ноутбук, планшет, смартфон)</li>
          <li>Современный веб-браузер (Chrome, Firefox, Safari, Edge) последней версии</li>
          <li>Подключение к интернету</li>
        </ul>
      </section> */}

      {/* <section className="home__getting_started">
        <Title text={'НАЧАЛО РАБОТЫ'}></Title>
        <div className="home__underline"></div>
        <p>Чтобы начать работу с приложением:</p>
        <ol>
          <li>Откройте веб-браузер на вашем устройстве</li>
          <li>Введите в адресную строку URL веб-приложения</li>
          <li>Нажмите клавишу «Enter» для перехода на сайт</li>
          <li>На шапке или футере сайта нажмите «Авторизация» или «Регистрация»</li>
          <li>Заполните поля форм</li>
        </ol>
      </section> */}
    </div>
  );
}
