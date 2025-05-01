import '../style_components/button.css';

interface MyButtonProps {
  name: string;
}

export default function Button({ name }: MyButtonProps) {
  return <button className="button">{name}</button>;
}
