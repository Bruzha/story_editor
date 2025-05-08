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
      { name: 'Проекты', href: '../../../projects', icon: './icons/project.svg' },
      { name: 'Идеи', href: '../../../ideas', icon: './icons/idea.svg' },
    ];
  } else if (type === 'project') {
    masLinks = [
      { name: 'Назад', href: '../../../profile', icon: './icons/back.svg' },
      { name: 'Сюжетные линии', href: '../../../plotlines', icon: './icons/plotline.svg' },
      { name: 'Персонажи', href: '../../../characters', icon: './icons/character.svg' },
      { name: 'Локации', href: '../../../locations', icon: './icons/location.svg' },
      { name: 'Объекты', href: '../../../objects', icon: './icons/object.svg' },
      { name: 'Группы', href: '../../../groups', icon: './icons/group.svg' },
      { name: 'Схема отношений', href: '../../../relationships', icon: './icons/relationship.svg' },
      { name: 'Линия времени', href: '../../../timelines', icon: './icons/timeline.svg' },
      { name: 'Главы', href: '../../../chapters', icon: './icons/chapter.svg' },
      { name: 'Заметки', href: '../../../notes', icon: './icons/notes.svg' },
      { name: 'Экспорт', href: '../../../export', icon: './icons/export.svg' },
      { name: 'Советы', href: '../../../help', icon: './icons/help.svg' },
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
        {masLinks.map((link, index) => (
          <li key={index} className="sidebar__items">
            <Link href={link.href} name={link.name} className="black-link">
              <img className="sidebar__icon" src={link.icon} alt="" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
