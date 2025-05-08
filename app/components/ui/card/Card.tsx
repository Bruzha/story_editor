import './style.scss';

interface IProps {
  id: number;
  src: string;
  data: string[];
  markColor: string;
}

function getColorBrightness(hexColor: string): number {
  hexColor = hexColor.replace('#', '').toUpperCase();
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness;
}

export default function Card({ id, src, data, markColor }: IProps) {
  if (!markColor || !/^#([0-9A-Fa-f]{3}){1,2}$/.test(markColor)) {
    markColor = '#4682B4';
  }

  const isLightColor = getColorBrightness(markColor) > 128;
  const textColor = isLightColor ? '#333333' : '#FFFFFF';

  const textStyle = {
    backgroundColor: markColor,
    color: textColor,
  };
  const borderStyle = {
    border: '4px solid ' + textColor,
  };
  const combinedStyle = { ...textStyle, ...borderStyle };

  return (
    <div className="card" style={textStyle}>
      <div>
        <img className="card__avatar" src={src} alt="" style={borderStyle} />
      </div>
      <div>
        <header className="card__title">{data[0]}</header>
        <section>{data[1]}</section>
        <ul>
          {data.slice(2).map((text) => (
            <li className="card__elements" key={id} style={combinedStyle}>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
