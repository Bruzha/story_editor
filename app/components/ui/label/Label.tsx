import './style.scss';

interface IProps {
  text: string;
}

export default function Label({ text }: IProps) {
  return <h3 className="label">{text}</h3>;
}
