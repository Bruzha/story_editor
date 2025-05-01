import '../style_components/card_character.css';

interface CardCharacterProps {
  src: string;
  alt: string;
  name: string;
}

export default function CardCharacter({ src, alt, name }: CardCharacterProps) {
  return (
    <div className="container">
      <img src={src} alt={alt} />
      <div>
        <p>{name}</p>
      </div>
    </div>
  );
}
