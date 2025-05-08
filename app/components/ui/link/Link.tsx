import Link from 'next/link';
import React from 'react';
import './style.scss';

interface IProps {
  name: string;
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function MyLink({ name, href, className, children }: IProps) {
  return (
    <Link href={href} className={`link ${className || ''}`}>
      {children}
      {name}
    </Link>
  );
}
