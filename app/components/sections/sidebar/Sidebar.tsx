import Link from '../../ui/link/Link';
import './style.scss';
import React from 'react';

interface SidebarProps {
  type: string;
}

interface LinkListItem {
  name: string;
  href: string;
  icon: string;
}

export default function Sidebar({ type }: SidebarProps) {
  let masLinks: LinkListItem[] = [];

  if (type === 'profile') {
    masLinks = [
      { name: 'Профиль', href: '../../../profile', icon: './icons/name.svg' },
      { name: 'Проекты', href: 'путь1', icon: './icons/project.svg' },
      { name: 'Идеи', href: 'путь2', icon: './icons/idea.svg' },
    ];
  } else if (type === 'project') {
    masLinks = [
      { name: 'Сюжетные линии', href: 'путь1', icon: './icons/plotline.svg' },
      { name: 'Персонажи', href: 'путь2', icon: './icons/character.svg' },
      { name: 'Локации', href: 'путь1', icon: './icons/location.svg' },
      { name: 'Объекты', href: 'путь2', icon: './icons/object.svg' },
      { name: 'Группы', href: 'путь1', icon: './icons/group.svg' },
      { name: 'Схема отношений', href: 'путь2', icon: './icons/relationship.svg' },
      { name: 'Линия времени', href: 'путь1', icon: './icons/timeline.svg' },
      { name: 'Главы', href: 'путь2', icon: './icons/chapter.svg' },
      { name: 'Заметки', href: 'путь1', icon: './icons/notes.svg' },
      { name: 'Экспорт', href: 'путь2', icon: './icons/export.svg' },
      { name: 'Советы', href: 'путь2', icon: './icons/help.svg' },
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
      {masLinks.map((link, index) => (
        <div key={index} className="sidebar__items">
          <img className="sidebar__icon" src={link.icon} alt="" />
          <Link href={link.href} name={link.name} className="black-link" />
        </div>
      ))}
    </aside>
  );
}
