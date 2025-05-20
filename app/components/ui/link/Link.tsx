'use clients';
import Link from 'next/link';
import React from 'react';
import './style.scss';

interface IProps {
  name: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; // Добавляем onClick
}

export default function MyLink({ name, href, className, children, onClick }: IProps) {
  return (
    <Link href={href} className={`link ${className || ''}`} onClick={onClick}>
      {children}
      {name}
    </Link>
  );
}
