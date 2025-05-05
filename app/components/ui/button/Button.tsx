import './style.scss';

interface IProps {
  name: string;
}

export default function Button({ name }: IProps) {
  return <button className="button__body">{name}</button>;
}
