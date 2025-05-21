'use client';

import './style.scss';
import { useRouter } from 'next/navigation'; // Import useRouter

interface IProps {
  id: number;
  type: 'project' | 'character' | 'idea' | string; //  Add a 'type' prop
  src?: string;
  data: string[];
  markColor?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

function getColorBrightness(hexColor: string): number {
  hexColor = hexColor.replace('#', '').toUpperCase();
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness;
}

export default function Card({ id, type, src, data, markColor, showDeleteButton = true, onDelete }: IProps) {
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

  const router = useRouter(); // Initialize useRouter

  const handleClick = () => {
    router.push(`/${type}s/${id}`); //  Navigate to the dynamic page
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
              onClick={onDelete}
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
