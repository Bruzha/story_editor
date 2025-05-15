import './style.scss';

interface IProps {
  text: string;
}

export default function Title({ text }: IProps) {
  return <h1 className="title">{text}</h1>;
}
