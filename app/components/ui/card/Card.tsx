import './style.scss';

interface IProps {
  id: number;
  src: string;
  alt: string;
  data: string[];
  markColor: string;
}

export default function Card({ id, src, alt, data, markColor }: IProps) {
  const color = {
    background: markColor,
  };
  return (
    <div className="card__container" style={color}>
      <img className="card__avatar" src={src} alt={alt} />
      <div>
        <header className="card__firstLine">{data[0]}</header>
        <section>{data[1]}</section>
        <section className="card__secondLine">
          {data.slice(2).map((text) => (
            <p className="card__elements" key={id}>
              {text}
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}
