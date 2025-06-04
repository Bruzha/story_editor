'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import './style.scss';

interface MyLinkProps {
  href: string;
  name: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const MyLink: React.FC<MyLinkProps> = ({ href, name, className, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const isWhiteLink = className?.includes('white-link');

  const linkClass = `link ${className || ''} ${isActive && isWhiteLink ? 'active-link' : ''}`.trim();

  return (
    <Link href={href} className={linkClass} onClick={onClick}>
      {children}
      {name}
    </Link>
  );
};

export default MyLink;
