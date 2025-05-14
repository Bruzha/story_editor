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
      { name: 'Профиль', href: '/profile', icon: '/icons/name.svg' },
      { name: 'Проекты', href: '/projects', icon: '/icons/project.svg' },
      { name: 'Идеи', href: '/ideas', icon: '/icons/idea.svg' },
    ];
  } else if (type === 'project') {
    masLinks = [
      { name: 'Назад', href: '/projects', icon: '/icons/back.svg' },
      { name: 'Сюжетные линии', href: '/projects/project/plotlines', icon: '/icons/plotline.svg' },
      { name: 'Персонажи', href: '/projects/project/characters', icon: '/icons/character.svg' },
      { name: 'Локации', href: '/projects/project/locations', icon: '/icons/location.svg' },
      { name: 'Объекты', href: '/projects/project/objects', icon: '/icons/object.svg' },
      { name: 'Группы', href: '/projects/project/groups', icon: '/icons/group.svg' },
      { name: 'Схемы отношений', href: '/projects/project/relationships', icon: '/icons/relationship.svg' },
      { name: 'Линия времени', href: '/projects/project/time_events', icon: '/icons/timelines.svg' },
      { name: 'Главы', href: '/projects/project/chapters', icon: '/icons/chapter.svg' },
      { name: 'Заметки', href: '/projects/project/notes', icon: '/icons/notes.svg' },
      { name: 'Экспорт', href: '/projects/project/export', icon: '/icons/export.svg' },
      { name: 'Советы', href: '/projects/project/advices', icon: '/icons/help.svg' },
    ];
  } else if (type === 'timeline') {
    masLinks = [
      { name: 'Назад', href: '/projects/project/plotlines', icon: '/icons/back.svg' },
      { name: 'Список событий', href: '/projects/project/time_events', icon: '/icons/timeevent.svg' },
      { name: 'Линия времени', href: '/projects/project/timeline', icon: '/icons/timeline.svg' },
    ];
  } else if (type === 'help') {
    masLinks = [
      { name: 'Назад', href: '/projects/project/plotlines', icon: '/icons/back.svg' },
      { name: 'Советы', href: '/projects/project/advices', icon: '/icons/help.svg' },
      { name: 'Словарь терминов', href: '/projects/project/terms', icon: '/icons/terms.svg' },
    ];
  } else if (type === 'create_character') {
    masLinks = [
      { name: 'Назад', href: '/projects/project/plotlines', icon: '/icons/back.svg' },
      { name: 'Основная информация', href: '/projects/project/characters/create/base', icon: '/icons/help.svg' },
      { name: 'Внешность', href: '/projects/project/characters/create/appearance', icon: '/icons/terms.svg' },
      { name: 'Личность', href: '/projects/project/characters/create/personality', icon: '/icons/terms.svg' },
      { name: 'Социальные связи', href: '/projects/project/characters/create/social', icon: '/icons/terms.svg' },
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
