import Link from '../../ui/link/Link';
import './style.scss';
import React from 'react';

interface SidebarProps {
  type: string;
}

interface LinkListItem {
  name: string;
  href: string;
}

export default function Sidebar({ type }: SidebarProps) {
  let masLinks: LinkListItem[] = [];

  if (type === 'профиль') {
    masLinks = [
      { name: 'Профиль', href: 'путь1' },
      { name: 'Проекты', href: 'путь1' },
      { name: 'Идеи', href: 'путь2' },
    ];
  } else if (type === 'станица проекта') {
    masLinks = [
      { name: 'Сюжетные линии', href: 'путь1' },
      { name: 'Персонажи', href: 'путь2' },
      { name: 'Локации', href: 'путь1' },
      { name: 'Объекты', href: 'путь2' },
      { name: 'Группы', href: 'путь1' },
      { name: 'Схема отношений', href: 'путь2' },
      { name: 'Линия времени', href: 'путь1' },
      { name: 'Главы', href: 'путь2' },
      { name: 'Заметки', href: 'путь1' },
      { name: 'Экспорт', href: 'путь2' },
      { name: 'Вспомогательные материалы', href: 'путь2' },
    ];
  }
  if (!masLinks || masLinks.length === 0) {
    return (
      <aside className="sidebar__container">
        <div>
          <p>Нет доступных ссылок</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar__container">
      {masLinks.map((link, index) => (
        <Link key={index} href={link.href} name={link.name} className="black-link" />
      ))}
    </aside>
  );
}
