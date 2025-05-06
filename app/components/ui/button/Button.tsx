import './style.scss';

interface IProps {
  name: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ name, type = 'button' }: IProps) {
  return (
    <button className="button" type={type}>
      {name}
    </button>
  );
}
