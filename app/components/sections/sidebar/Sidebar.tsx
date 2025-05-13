'use client';
import Link from '../../ui/link/Link';
import './style.scss';
import React, { useEffect, useState } from 'react';

interface IProps {
  type: string;
}

interface ListItem {
  name: string;
  href: string;
  icon: string;
}

export default function Sidebar({ type }: IProps) {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  let masLinks: ListItem[] = [];
  if (type === 'profile') {
    masLinks = [
      { name: 'Профиль', href: '/profile', icon: './icons/name.svg' },
      { name: 'Проекты', href: '/projects', icon: './icons/project.svg' },
      { name: 'Идеи', href: '/ideas', icon: './icons/idea.svg' },
    ];
  } else if (type === 'project') {
    masLinks = [
      { name: 'Назад', href: '/projects', icon: './icons/back.svg' },
      { name: 'Сюжетные линии', href: '/plotlines', icon: './icons/plotline.svg' },
      { name: 'Персонажи', href: '/characters', icon: './icons/character.svg' },
      { name: 'Локации', href: '/locations', icon: './icons/location.svg' },
      { name: 'Объекты', href: '/objects', icon: './icons/object.svg' },
      { name: 'Группы', href: '/groups', icon: './icons/group.svg' },
      { name: 'Схемы отношений', href: '/relationships', icon: './icons/relationship.svg' },
      { name: 'Линия времени', href: '/timeevents', icon: './icons/timelines.svg' },
      { name: 'Главы', href: '/chapters', icon: './icons/chapter.svg' },
      { name: 'Заметки', href: '/notes', icon: './icons/notes.svg' },
      { name: 'Экспорт', href: '/export', icon: './icons/export.svg' },
      { name: 'Советы', href: '/advices', icon: './icons/help.svg' },
    ];
  } else if (type === 'timeline') {
    masLinks = [
      { name: 'Назад', href: '/plotlines', icon: './icons/back.svg' },
      { name: 'Список событий', href: '/timeevents', icon: './icons/timeevent.svg' },
      { name: 'Линия времени', href: '/timeline', icon: './icons/timeline.svg' },
    ];
  } else if (type === 'help') {
    masLinks = [
      { name: 'Назад', href: '/plotlines', icon: './icons/back.svg' },
      { name: 'Советы', href: '/advices', icon: './icons/help.svg' },
      { name: 'Словарь терминов', href: '/terms', icon: './icons/terms.svg' },
    ];
  } else if (type === 'create_character') {
    masLinks = [
      { name: 'Назад', href: '/plotlines', icon: './icons/back.svg' },
      { name: 'Основная информация', href: '/create_character_base', icon: './icons/help.svg' },
      { name: 'Внешность', href: '/create_character_appearance', icon: './icons/terms.svg' },
      { name: 'Личность', href: '/create_character_personality', icon: './icons/terms.svg' },
      { name: 'Социальные связи', href: '/create_character_social', icon: './icons/terms.svg' },
    ];
  }
  if (!masLinks || masLinks.length === 0) {
    return (
      <aside className="sidebar">
        <div>
          <p>Нет доступных ссылок</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <ul className="sidebar__links-container">
        {masLinks.map((link, index) => {
          const isActive = currentPath === link.href;
          const itemClass = isActive ? 'sidebar__items sidebar__items-active' : 'sidebar__items';

          return (
            <li key={index} className={itemClass}>
              <Link href={link.href} name={link.name} className="black-link">
                <img className="sidebar__icon" src={link.icon} alt={link.name} />
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
