import Link from 'next/link';
import './style.scss';

interface IProps {
  name: string;
  href: string;
  className?: string;
}

export default function MyLink({ name, href, className }: IProps) {
  return (
    <Link href={href} className={`link ${className || ''}`}>
      {name}
    </Link>
  );
}
