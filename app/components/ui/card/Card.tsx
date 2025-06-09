'use client';

import './style.scss';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { deleteCard } from '../../../store/thunks/deleteCard';
import { AppDispatch } from '@/app/store';
import { setProjectId } from '@/app/store/reducers/projectReducer'; // Import setProjectId
import React from 'react';

interface IProps {
  id: number;
  type: 'project' | 'character' | 'idea' | string;
  src?: string | null;
  data: string[];
  markColor?: string;
  showDeleteButton?: boolean;
}

function getColorBrightness(hexColor: string): number {
  hexColor = hexColor.replace('#', '').toUpperCase();
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness;
}

export default function Card({ id, type, src, data, markColor, showDeleteButton = true }: IProps) {
  const actualMarkColor = markColor || '#4682B4';
  const isLightColor = getColorBrightness(actualMarkColor) > 128;
  const textColor = isLightColor ? '#333333' : '#FFFFFF';
  const textStyle = {
    backgroundColor: actualMarkColor,
    color: textColor,
  };
  const borderStyle = {
    border: '4px solid ' + textColor,
  };
  const combinedStyle = { ...textStyle, ...borderStyle };

  const isValidSrc = src && src.trim() !== '';

  const filterStyle = {
    filter: textColor === '#FFFFFF' ? 'invert(1)' : 'none',
  };

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const handleClick = () => {
    if (type === 'project') {
      dispatch(setProjectId(String(id)));
    }
    if (type === 'character') {
      router.push(`/${type}s/${id}/?typePage=characters`);
    } else router.push(`/${type}s/${id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Остановить распространение события click
    dispatch(deleteCard(id, type)); // Отправка thunk
  };

  return (
    <div key={id} className="card" style={textStyle} onClick={handleClick}>
      {isValidSrc && (
        <div>
          <img className="card__avatar" src={src} alt="" style={borderStyle} />
        </div>
      )}
      <div className="card__container-info">
        <div className="card__first-line">
          <header className="card__title">{data[0]}</header>
          {showDeleteButton && (
            <input
              title="Удалить"
              className="card__button-delete"
              type="image"
              src="/icons/delete.svg"
              alt="удалить"
              style={filterStyle}
              onClick={handleDelete}
            />
          )}
        </div>
        <section>{data[1]}</section>
        <ul>
          {data.slice(2).map((text, index) => (
            <li className="card__elements" key={index} style={combinedStyle}>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
