'use client';
import Link from '../../ui/link/Link';
import './style.scss';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

interface IProps {
  type: string;
}

interface ListItem {
  name: string;
  href: string;
  icon: string;
}

export default function Sidebar({ type }: IProps) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState('');
  const projectId = useSelector((state: RootState) => state.project?.projectId);
  const characterId = useSelector((state: RootState) => state.item?.itemId);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  let masLinks: ListItem[] = [];
  if (type === 'profile') {
    masLinks = [
      { name: 'Профиль', href: '/profile', icon: '/icons/name.svg' },
      { name: 'Проекты', href: '/projects', icon: '/icons/project.svg' },
      { name: 'Идеи', href: '/ideas', icon: '/icons/idea.svg' },
    ];
  } else if (type === 'project' && projectId) {
    masLinks = [
      { name: 'Назад', href: '/projects', icon: '/icons/back.svg' },
      { name: 'Данные проекта', href: `/projects/${projectId}`, icon: '/icons/base.svg' },
      { name: 'Сюжетные линии', href: `/projects/${projectId}/plotlines`, icon: '/icons/plotline.svg' },
      { name: 'Персонажи', href: `/projects/${projectId}/characters`, icon: '/icons/character.svg' },
      { name: 'Локации', href: `/projects/${projectId}/locations`, icon: '/icons/location.svg' },
      { name: 'Объекты', href: `/projects/${projectId}/objects`, icon: '/icons/object.svg' },
      { name: 'Группы', href: `/projects/${projectId}/groups`, icon: '/icons/group.svg' },
      { name: 'Схемы отношений', href: `/projects/${projectId}/relationships`, icon: '/icons/relationship.svg' },
      { name: 'Линия времени', href: `/projects/${projectId}/time_events`, icon: '/icons/timelines.svg' },
      { name: 'Главы', href: `/projects/${projectId}/chapters`, icon: '/icons/chapter.svg' },
      { name: 'Заметки', href: `/projects/${projectId}/notes`, icon: '/icons/notes.svg' },
      { name: 'Экспорт', href: `/projects/${projectId}/export`, icon: '/icons/export.svg' },
      { name: 'Советы', href: `/projects/${projectId}/advices`, icon: '/icons/help.svg' },
    ];
  } else if (type === 'timeline' && projectId) {
    masLinks = [
      { name: 'Назад', href: `/projects/${projectId}`, icon: '/icons/back.svg' },
      { name: 'Список событий', href: `/projects/${projectId}/time_events`, icon: '/icons/timeevent.svg' },
      { name: 'Линия времени', href: `/projects/${projectId}/timeline`, icon: '/icons/timeline.svg' },
    ];
  } else if (type === 'help' && projectId) {
    masLinks = [
      { name: 'Назад', href: `/projects/${projectId}`, icon: '/icons/back.svg' },
      { name: 'Советы', href: `/projects/${projectId}/advices`, icon: '/icons/help.svg' },
      { name: 'Словарь терминов', href: `/projects/${projectId}/terms`, icon: '/icons/terms.svg' },
    ];
  } else if (type === 'create_character' && projectId) {
    masLinks = [
      { name: 'Назад', href: `/projects/${projectId}`, icon: '/icons/back.svg' },
      {
        name: 'Основная информация',
        href: `/characters/${characterId}?typePage=characters`,
        icon: '/icons/base.svg',
      },
      {
        name: 'Внешность',
        href: `/characters/${characterId}?typePage=appearance`,
        icon: '/icons/appearance.svg',
      },
      {
        name: 'Личность',
        href: `/characters/${characterId}?typePage=personality`,
        icon: '/icons/personality.svg',
      },
      {
        name: 'Социальные связи',
        href: `/characters/${characterId}?typePage=social`,
        icon: '/icons/social.svg',
      },
    ];
  } else if (type === 'create_new_character' && projectId) {
    masLinks = [
      { name: 'Назад', href: `/projects/${projectId}/characters`, icon: '/icons/back.svg' },
      {
        name: 'Основная информация',
        href: `/characters/create?typePage=characters`,
        icon: '/icons/base.svg',
      },
      {
        name: 'Внешность',
        href: `/characters/create?typePage=appearance`,
        icon: '/icons/appearance.svg',
      },
      {
        name: 'Личность',
        href: `/characters/create?typePage=personality`,
        icon: '/icons/personality.svg',
      },
      {
        name: 'Социальные связи',
        href: `/characters/create?typePage=social`,
        icon: '/icons/social.svg',
      },
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
